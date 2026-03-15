const fs = require('fs');
const path = require('path');

const LARGE_FILE_THRESHOLD = 500 * 1024; // 500KB
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', 'venv', '.venv']);

function walkDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function health(args) {
  const target = args[0] || '.';
  const dir = path.resolve(target);

  if (!fs.existsSync(dir)) {
    console.error(`  Directory "${target}" does not exist.`);
    process.exit(1);
  }

  console.log(`\n  Code Health Check: ${dir}\n`);

  const files = walkDir(dir);
  let totalFiles = 0;
  let totalLines = 0;
  const largeFiles = [];
  const todos = [];
  const extCounts = {};

  for (const file of files) {
    totalFiles++;
    const ext = path.extname(file) || '(none)';
    extCounts[ext] = (extCounts[ext] || 0) + 1;

    const stat = fs.statSync(file);
    if (stat.size > LARGE_FILE_THRESHOLD) {
      largeFiles.push({ file: path.relative(dir, file), size: stat.size });
    }

    // Only scan text-ish files for TODOs
    const textExts = new Set([
      '.js', '.ts', '.py', '.java', '.go', '.rs', '.rb',
      '.c', '.cpp', '.h', '.css', '.html', '.md', '.txt',
      '.json', '.yaml', '.yml', '.toml',
    ]);
    if (textExts.has(ext) && stat.size < 1024 * 1024) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        totalLines += lines.length;

        lines.forEach((line, i) => {
          if (/\bTODO\b|\bFIXME\b|\bHACK\b|\bXXX\b/i.test(line)) {
            todos.push({ file: path.relative(dir, file), line: i + 1, text: line.trim() });
          }
        });
      } catch {
        // skip binary / unreadable files
      }
    }
  }

  // Summary
  console.log(`  Files scanned:  ${totalFiles}`);
  console.log(`  Total lines:    ${totalLines.toLocaleString()}`);

  // File types
  const sortedExts = Object.entries(extCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log('\n  File types:');
  for (const [ext, count] of sortedExts) {
    console.log(`    ${ext.padEnd(10)} ${count}`);
  }

  // Large files
  if (largeFiles.length > 0) {
    console.log(`\n  Large files (>${(LARGE_FILE_THRESHOLD / 1024).toFixed(0)}KB):`);
    for (const { file, size } of largeFiles.slice(0, 10)) {
      console.log(`    ${file} (${(size / 1024).toFixed(0)}KB)`);
    }
  } else {
    console.log('\n  No large files found.');
  }

  // TODOs
  if (todos.length > 0) {
    console.log(`\n  TODO/FIXME comments (${todos.length} found):`);
    for (const t of todos.slice(0, 15)) {
      console.log(`    ${t.file}:${t.line} — ${t.text.slice(0, 80)}`);
    }
    if (todos.length > 15) console.log(`    ... and ${todos.length - 15} more`);
  } else {
    console.log('\n  No TODO/FIXME comments found.');
  }

  console.log('');
}

module.exports = health;
