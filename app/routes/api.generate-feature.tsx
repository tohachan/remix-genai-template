import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

interface FeatureGenerationRequest {
  featureName: string;
  template: 'crud-list' | 'chart-widget' | 'kanban-widget';
  layer: 'features' | 'widgets';
  includeTests: boolean;
  includeStorybook: boolean;
}

interface FeatureGenerationResponse {
  success: boolean;
  message: string;
  generatedFiles?: string[];
  error?: string;
}

// Validate feature name
function validateFeatureName(featureName: string): string | null {
  if (!featureName || typeof featureName !== 'string') {
    return 'Feature name is required';
  }

  const trimmed = featureName.trim();
  if (!trimmed) {
    return 'Feature name cannot be empty';
  }

  if (!/^[a-z][a-z0-9-]*$/.test(trimmed)) {
    return 'Feature name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens';
  }

  if (trimmed.length > 50) {
    return 'Feature name is too long (max 50 characters)';
  }

  return null;
}

// Check if feature already exists
function checkFeatureExists(layer: string, featureName: string): boolean {
  const featurePath = path.join(process.cwd(), 'app', layer, featureName);
  return fs.existsSync(featurePath);
}

// Generate feature using CLI generator
async function generateFeature(options: FeatureGenerationRequest): Promise<FeatureGenerationResponse> {
  const { featureName, template, layer, includeTests, includeStorybook } = options;

  // Validate feature name
  const nameError = validateFeatureName(featureName);
  if (nameError) {
    return {
      success: false,
      message: 'Invalid feature name',
      error: nameError,
    };
  }

  // Check if feature already exists
  if (checkFeatureExists(layer, featureName)) {
    return {
      success: false,
      message: 'Feature already exists',
      error: `Feature '${featureName}' already exists in ${layer} layer`,
    };
  }

  try {
    // Build CLI command
    const command = [
      'npm',
      'run',
      'generate:feature',
      '--',
      featureName,
      '--template',
      template,
      '--layer',
      layer,
      '--includeTests',
      includeTests.toString(),
      '--includeStorybook',
      includeStorybook.toString(),
    ].join(' ');

    console.log('Executing command:', command);

    // Execute generator command
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 30000, // 30 second timeout
    });

    // Parse generated files from stdout
    const generatedFiles: string[] = [];
    const lines = stdout.split('\n');
    let inFilesSection = false;

    for (const line of lines) {
      if (line.includes('📁 Generated files:')) {
        inFilesSection = true;
        continue;
      }

      if (inFilesSection && line.trim().startsWith('app/')) {
        generatedFiles.push(line.trim());
      }

      // Stop when we hit another section
      if (inFilesSection && (line.includes('📝') || line.includes('🎉'))) {
        break;
      }
    }

    // Log any stderr for debugging but don't fail
    if (stderr) {
      console.warn('Generator warnings:', stderr);
    }

    return {
      success: true,
      message: `Feature '${featureName}' generated successfully`,
      generatedFiles: generatedFiles.length > 0 ? generatedFiles : [
        `app/${layer}/${featureName}/ui/${featureName.charAt(0).toUpperCase() + featureName.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}.tsx`,
        `app/${layer}/${featureName}/index.ts`,
        `app/${layer}/${featureName}/README.md`,
      ],
    };

  } catch (error) {
    console.error('Feature generation failed:', error);

    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;

      // Handle specific error cases
      if (errorMessage.includes('timeout')) {
        errorMessage = 'Feature generation timed out. Please try again.';
      } else if (errorMessage.includes('ENOENT')) {
        errorMessage = 'Generator script not found. Please check your installation.';
      } else if (errorMessage.includes('permission')) {
        errorMessage = 'Permission denied. Please check file permissions.';
      }
    }

    return {
      success: false,
      message: 'Feature generation failed',
      error: errorMessage,
    };
  }
}

export const action: ActionFunction = async({ request }) => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return json({
      success: false,
      message: 'Method not allowed',
      error: 'Only POST requests are allowed',
    }, { status: 405 });
  }

  try {
    // Parse request body
    const body = await request.json();

    // Validate request body structure
    const requiredFields = ['featureName', 'template', 'layer'];
    const missingFields = requiredFields.filter(field => !(field in body));

    if (missingFields.length > 0) {
      return json({
        success: false,
        message: 'Missing required fields',
        error: `Missing fields: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    // Validate template and layer values
    const validTemplates = ['crud-list', 'chart-widget', 'kanban-widget'];
    const validLayers = ['features', 'widgets'];

    if (!validTemplates.includes(body.template)) {
      return json({
        success: false,
        message: 'Invalid template',
        error: `Template must be one of: ${validTemplates.join(', ')}`,
      }, { status: 400 });
    }

    if (!validLayers.includes(body.layer)) {
      return json({
        success: false,
        message: 'Invalid layer',
        error: `Layer must be one of: ${validLayers.join(', ')}`,
      }, { status: 400 });
    }

    // Set defaults for optional fields
    const options: FeatureGenerationRequest = {
      featureName: body.featureName,
      template: body.template,
      layer: body.layer,
      includeTests: body.includeTests !== false, // Default to true
      includeStorybook: body.includeStorybook === true, // Default to false
    };

    // Generate feature
    const result = await generateFeature(options);

    // Return appropriate status code
    const statusCode = result.success ? 200 : 400;
    return json(result, { status: statusCode });

  } catch (error) {
    console.error('API error:', error);

    return json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown server error',
    }, { status: 500 });
  }
};
