const fs = require('fs');
const path = require('path');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', 'venv', '.venv']);

const EXT_LANG = {
  '.js': 'JavaScript', '.ts': 'TypeScript', '.py': 'Python',
  '.java': 'Java', '.go': 'Go', '.rs': 'Rust', '.rb': 'Ruby',
  '.c': 'C', '.cpp': 'C++', '.h': 'C/C++ Header',
  '.css': 'CSS', '.html': 'HTML', '.json': 'JSON',
  '.md': 'Markdown', '.yaml': 'YAML', '.yml': 'YAML',
  '.sh': 'Shell', '.bash': 'Shell', '.sql': 'SQL',
};

function walkDir(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) results.push(...walkDir(fullPath));
      else if (entry.isFile()) results.push(fullPath);
    }
  } catch { /* skip unreadable dirs */ }
  return results;
}

function loc(args) {
  const target = args[0] || '.';
  const dir = path.resolve(target);

  if (!fs.existsSync(dir)) {
    console.error(`  Directory "${target}" not found.`);
    process.exit(1);
  }

  const files = walkDir(dir);
  const langStats = {};
  let totalLines = 0;
  let totalFiles = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const lang = EXT_LANG[ext];
    if (!lang) continue;

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n').length;
      totalLines += lines;
      totalFiles++;

      if (!langStats[lang]) langStats[lang] = { files: 0, lines: 0 };
      langStats[lang].files++;
      langStats[lang].lines += lines;
    } catch { /* skip */ }
  }

  console.log(`\n  Lines of Code: ${dir}\n`);
  console.log(`  ${'Language'.padEnd(18)} ${'Files'.padStart(6)} ${'Lines'.padStart(8)}`);
  console.log(`  ${'─'.repeat(18)} ${'─'.repeat(6)} ${'─'.repeat(8)}`);

  const sorted = Object.entries(langStats).sort((a, b) => b[1].lines - a[1].lines);
  for (const [lang, stats] of sorted) {
    console.log(`  ${lang.padEnd(18)} ${String(stats.files).padStart(6)} ${String(stats.lines).padStart(8)}`);
  }

  console.log(`  ${'─'.repeat(18)} ${'─'.repeat(6)} ${'─'.repeat(8)}`);
  console.log(`  ${'Total'.padEnd(18)} ${String(totalFiles).padStart(6)} ${String(totalLines).padStart(8)}`);
  console.log('');
}

module.exports = loc;
