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

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('#')) {
      const header = trimmedLine.replace(/#/g, '').replace('===', '').trim();
      if (header) {
        content += `## ${header}\n\n`;
      }
      continue;
    }

    if (!trimmedLine) continue;

    // Avoid duplicating metadata fields that are parsed separately.
    const key = trimmedLine.split(':')[0];
    if (['id', 'description', 'globs', 'alwaysApply', 'always_apply'].includes(key)) {
      continue;
    }

    // Fallback for any content not captured as a comment. This ensures no data is lost.
    // This part tries to format simple key-value pairs that are not metadata.
    if (line.includes(':')) {
      // This simple split is naive; complex values will be handled by the full parser.
      // The main goal here is to catch what's missed.
      const parts = line.split(':');
      const k = parts[0].trim();
      const v = parts.slice(1).join(':').trim();

      // Heuristic to avoid re-printing complex structures already in metadata
      if (metadata[k] === undefined) {
        const title = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        content += `### ${title}\n${v}\n\n`;
      }
    }
  }

  // Use the full parsed data to generate a clean, structured version of the content.
  let structuredContent = '';
  for (const [key, value] of Object.entries(metadata)) {
    if (['id', 'description', 'globs', 'alwaysApply', 'always_apply'].includes(key)) {
      continue;
    }
    const title = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    structuredContent += `## ${title}\n\n`;
    if (typeof value === 'string') {
      structuredContent += `${value}\n\n`;
    } else if (Array.isArray(value)) {
      structuredContent += value.map(item => `- ${item}`).join('\n') + '\n\n';
    } else if (typeof value === 'object' && value !== null) {
      structuredContent += yaml.dump(value);
    }
  }

  return { metadata, content: structuredContent.trim() };
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
    const frontmatter = yaml.dump({
      description: description || 'No description provided.',
      globs: globs || [],
      alwaysApply: alwaysApply || false,
    });

    const mdcContent = `---\n${frontmatter}---\n\n${content}`;
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
