const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.trim() === '') continue;
    const cells = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cells.push(current.trim());
    rows.push(cells);
  }
  return rows;
}

function csv(args) {
  if (args.length === 0) {
    console.error('  Usage: devkit csv <file.csv>');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`  File not found: ${args[0]}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCSV(content);

  if (rows.length === 0) {
    console.log('  Empty CSV file.');
    return;
  }

  // Calculate column widths
  const colWidths = [];
  for (const row of rows) {
    for (let i = 0; i < row.length; i++) {
      colWidths[i] = Math.max(colWidths[i] || 0, String(row[i]).length);
    }
  }

  // Cap widths
  const maxWidth = 30;
  const widths = colWidths.map(w => Math.min(w, maxWidth));

  console.log('');
  for (let r = 0; r < Math.min(rows.length, 50); r++) {
    const row = rows[r];
    const cells = row.map((cell, i) => {
      const s = String(cell).slice(0, maxWidth);
      return s.padEnd(widths[i] || 0);
    });
    console.log(`  ${cells.join(' | ')}`);

    // Header separator
    if (r === 0) {
      console.log(`  ${widths.map(w => '─'.repeat(w)).join('─┼─')}`);
    }
  }

  if (rows.length > 50) console.log(`  ... (${rows.length - 50} more rows)`);
  console.log(`\n  ${rows.length} rows, ${colWidths.length} columns\n`);
}

module.exports = csv;
