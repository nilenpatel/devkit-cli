const fs = require('fs');
const path = require('path');

const SKIP = new Set(['node_modules', '.git', 'dist', 'build']);

function dirSize(dir) {
  let total = 0;
  const breakdown = {};

  function walk(d) {
    try {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        if (SKIP.has(entry.name)) continue;
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile()) {
          const s = fs.statSync(full).size;
          total += s;
          const ext = path.extname(entry.name) || '(none)';
          breakdown[ext] = (breakdown[ext] || 0) + s;
        }
      }
    } catch { /* skip */ }
  }

  walk(dir);
  return { total, breakdown };
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function size(args) {
  const target = args[0] || '.';
  const dir = path.resolve(target);

  if (!fs.existsSync(dir)) {
    console.error(`  Directory not found: ${target}`);
    process.exit(1);
  }

  const { total, breakdown } = dirSize(dir);

  console.log(`\n  Directory Size: ${dir}\n`);
  console.log(`  Total: ${formatSize(total)}\n`);
  console.log(`  ${'Extension'.padEnd(12)} ${'Size'.padStart(10)}`);
  console.log(`  ${'─'.repeat(12)} ${'─'.repeat(10)}`);

  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  for (const [ext, bytes] of sorted.slice(0, 15)) {
    console.log(`  ${ext.padEnd(12)} ${formatSize(bytes).padStart(10)}`);
  }
  console.log('');
}

module.exports = size;
