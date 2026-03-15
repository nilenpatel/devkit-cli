const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname);
const issues = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const rel = path.relative(path.join(__dirname, '..'), filePath);

  lines.forEach((line, i) => {
    // Check for 'var' usage (skip this lint rule's own detection line)
    if (/\bvar\s+\w/.test(line) && !line.includes('\\bvar')) {
      issues.push(`${rel}:${i + 1} — Use 'const' or 'let' instead of 'var'`);
    }
    // Check for console.error without message (only non-string occurrences)
    if (/console\.error\(\s*\)/.test(line) && !/['"`]/.test(line)) {
      issues.push(`${rel}:${i + 1} — Empty console.error call`);
    }
    // Check for very long lines
    if (line.length > 150) {
      issues.push(`${rel}:${i + 1} — Line exceeds 150 characters (${line.length})`);
    }
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      checkFile(full);
    }
  }
}

walk(SRC_DIR);

if (issues.length === 0) {
  console.log('  Lint check passed — no issues found.');
} else {
  console.log(`  Lint check: ${issues.length} issue(s) found:\n`);
  for (const issue of issues) {
    console.log(`    ${issue}`);
  }
  process.exit(1);
}
