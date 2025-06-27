const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const yaml = require('js-yaml');

const CWD = process.cwd();
const RAW_RULES_DIR = path.join(CWD, 'raw-rules');

const PLATFORMS = {
  CURSOR: 'Cursor',
  CLAUDE: 'Claude code',
  WINDSURF: 'Windsurf',
  COPILOT: 'Copilot',
};

async function updateIgnoreFile(filePath, entry) {
  try {
    let content = '';

    // Read existing file if it exists
    if (await fs.pathExists(filePath)) {
      content = await fs.readFile(filePath, 'utf8');
    }

    const lines = content.split('\n').map(line => line.trim()).filter(line => line);

    // Check if entry already exists
    if (!lines.includes(entry)) {
      lines.push(entry);
      const updatedContent = lines.join('\n') + '\n';
      await fs.writeFile(filePath, updatedContent);
      console.log(`✅ Updated: ${path.relative(CWD, filePath)} (added ${entry})`);
    } else {
      console.log(`ℹ️  Entry '${entry}' already exists in ${path.relative(CWD, filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function parseYamlWithComments(fileContent) {
  const lines = fileContent.split('\n');
  const metadata = yaml.load(fileContent);
  let content = '';

  // Extract only the metadata we need
  const { id, description, globs, alwaysApply, always_apply, ...restData } = metadata;

  // Process lines to create markdown content
  let isFirstSection = true;
  let currentSection = '';
  let inCodeBlock = false;
  let skipUntilNextSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip file header comment
    if (trimmedLine.includes('===') && trimmedLine.includes('.yaml')) {
      continue;
    }

    // Check if this is a metadata field at root level that should be skipped
    if (trimmedLine && !line.startsWith(' ') && !line.startsWith('\t') && !inCodeBlock) {
      const key = trimmedLine.split(':')[0].trim();
      if (['id', 'description', 'globs', 'alwaysApply', 'always_apply'].includes(key)) {
        skipUntilNextSection = true;
        // If this is globs field, skip the entire array
        if (key === 'globs') {
          // Skip subsequent indented lines that are part of the globs array
          let j = i + 1;
          while (j < lines.length && (lines[j].startsWith('  ') || lines[j].startsWith('\t') || lines[j].trim() === '')) {
            j++;
          }
          i = j - 1; // Set i to the last line we want to skip
        }
        continue;
      } else {
        skipUntilNextSection = false;
      }
    }

    // Handle comments as section headers
    if (trimmedLine.startsWith('#') && !trimmedLine.includes('===')) {
      const headerText = trimmedLine.replace(/^#+\s*/, '').trim();
      if (headerText) {
        if (!isFirstSection) {
          content += '\n';
        }
        content += `## ${headerText}\n\n`;
        isFirstSection = false;
        currentSection = headerText;
        skipUntilNextSection = false;
        continue;
      }
    }

    // Skip lines if we're in a metadata section
    if (skipUntilNextSection) {
      continue;
    }

    // Handle code blocks
    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      content += line + '\n';
      continue;
    }

    // Add content lines (preserve original formatting for better structure)
    if (trimmedLine || inCodeBlock) {
      content += line + '\n';
    } else if (content && !content.endsWith('\n\n')) {
      // Add spacing between sections
      content += '\n';
    }
  }

  return {
    metadata: { id, description, globs, alwaysApply: alwaysApply || always_apply },
    content: content.trim(),
  };
}

async function getRawRules() {
  try {
    const files = await fs.readdir(RAW_RULES_DIR);
    const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

    const rules = await Promise.all(yamlFiles.map(async file => {
      const filePath = path.join(RAW_RULES_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf8');

      const { metadata, content } = parseYamlWithComments(fileContent);

      if (!metadata.id) {
        console.warn(`⚠️  Skipping ${file}: missing 'id' field.`);
        return null;
      }

      return {
        id: metadata.id,
        description: metadata.description,
        globs: metadata.globs,
        alwaysApply: metadata.alwaysApply || metadata.always_apply,
        content: content,
      };
    }));

    return rules.filter(Boolean);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: The 'raw-rules' directory does not exist at ${RAW_RULES_DIR}`);
    } else {
      console.error('❌ Error reading raw rules:', error);
    }
    return [];
  }
}

function aggregateGlobs(rules) {
  const allGlobs = rules.flatMap(rule => rule.globs || []);
  return [...new Set(allGlobs)];
}

async function generateForCursor(rules) {
  const outputDir = path.join(CWD, '.cursor/rules');
  console.log('\n🚀 Generating rules for Cursor...');
  await fs.ensureDir(outputDir);
  await fs.emptyDir(outputDir);

  for (const rule of rules) {
    const { id, description, globs, alwaysApply, content } = rule;

    // Format globs as comma-separated string for Cursor
    let formattedGlobs = '';
    if (Array.isArray(globs)) {
      formattedGlobs = globs.join(',');
    } else if (globs) {
      formattedGlobs = String(globs);
    }

    // Manually construct frontmatter to ensure proper Cursor format
    let frontmatter = 'description: ';
    if (description) {
      // Handle multiline descriptions
      if (description.includes('\n') || description.length > 60) {
        frontmatter += `>\n  ${description.replace(/\n/g, '\n  ')}`;
      } else {
        frontmatter += description;
      }
    } else {
      frontmatter += 'No description provided.';
    }

    frontmatter += `\nglobs: ${formattedGlobs}`;
    frontmatter += `\nalwaysApply: ${Boolean(alwaysApply)}`;

    const mdcContent = `---\n${frontmatter}\n---\n\n${content}`;
    const filePath = path.join(outputDir, `${id}.mdc`);
    await fs.writeFile(filePath, mdcContent);
    console.log(`✅ Created: ${path.relative(CWD, filePath)}`);
  }

  // Update .cursorignore
  const ignoreFile = path.join(CWD, '.cursorignore');
  await updateIgnoreFile(ignoreFile, 'raw-rules/');

  console.log('✨ Cursor rules generated successfully!');
}

async function generateForClaude(rules) {
  const outputDir = path.join(CWD, 'claude-rules');
  console.log('\n🚀 Generating combined .md file for Claude Code...');
  await fs.ensureDir(outputDir);

  const combinedContent = rules.map(rule => `### Rule: ${rule.id}\n\n${rule.content}`).join('\n\n---\n\n');

  const mdContent = `## Combined AI Development Rules\n\n${combinedContent}`;
  const filePath = path.join(outputDir, 'claude-combined-rules.md');

  await fs.writeFile(filePath, mdContent);
  console.log(`✅ Created: ${path.relative(CWD, filePath)}`);

  // Update .gitignore for Claude Code
  const ignoreFile = path.join(CWD, '.gitignore');
  await updateIgnoreFile(ignoreFile, 'raw-rules/');

  console.log('✨ Claude Code rule generated successfully!');
}

async function generateForWindsurf(rules) {
  const outputDir = path.join(CWD, '.windsurf/rules');
  console.log('\n🚀 Generating rules for Windsurf...');
  await fs.ensureDir(outputDir);

  const combinedContent = rules.map(rule => rule.content).join('\n\n---\n\n');
  const windsurfContent = `<rules>\n${combinedContent}\n</rules>`;
  const filePath = path.join(outputDir, 'rules.md');

  await fs.writeFile(filePath, windsurfContent);
  console.log(`✅ Created: ${path.relative(CWD, filePath)}`);

  // Update .codeiumignore for Windsurf
  const ignoreFile = path.join(CWD, '.codeiumignore');
  await updateIgnoreFile(ignoreFile, 'raw-rules/');

  console.log('✨ Windsurf rules generated successfully!');
}

async function generateForCopilot(rules) {
  const outputDir = path.join(CWD, '.github');
  console.log('\n🚀 Generating instructions for Copilot...');
  await fs.ensureDir(outputDir);

  const aggregatedGlobs = aggregateGlobs(rules);
  const frontmatter = yaml.dump({
    applyTo: aggregatedGlobs,
  });

  const combinedContent = rules.map(rule => `### ${rule.id}\n\n${rule.content}`).join('\n\n---\n\n');
  const copilotContent = `---\n${frontmatter}---\n\n# Copilot Instructions\n\n${combinedContent}`;
  const filePath = path.join(outputDir, 'copilot-instructions.md');

  await fs.writeFile(filePath, copilotContent);
  console.log(`✅ Created: ${path.relative(CWD, filePath)}`);

  // Update .copilotignore
  const ignoreFile = path.join(CWD, '.copilotignore');
  await updateIgnoreFile(ignoreFile, 'raw-rules/');

  console.log('✨ Copilot instructions generated successfully!');
}

async function main() {
  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Which AI platform do you want to generate rules for?',
      choices: Object.values(PLATFORMS),
    },
  ]);

  const rules = await getRawRules();
  if (rules.length === 0) {
    console.log('No rules found to generate.');
    return;
  }

  switch (platform) {
  case PLATFORMS.CURSOR:
    await generateForCursor(rules);
    break;
  case PLATFORMS.CLAUDE:
    await generateForClaude(rules);
    break;
  case PLATFORMS.WINDSURF:
    await generateForWindsurf(rules);
    break;
  case PLATFORMS.COPILOT:
    await generateForCopilot(rules);
    break;
  default:
    console.error(`Unknown platform: ${platform}`);
  }
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
