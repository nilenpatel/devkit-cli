const fs = require('fs');
const path = require('path');

function jsonFmt(args) {
  if (args.length === 0) {
    console.error('  Usage: devkit json-fmt <file.json>');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);

  if (!fs.existsSync(filePath)) {
    console.error(`  File not found: ${args[0]}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');

  try {
    const parsed = JSON.parse(raw);
    const formatted = JSON.stringify(parsed, null, 2);

    const writeBack = args.includes('--write') || args.includes('-w');

    if (writeBack) {
      fs.writeFileSync(filePath, formatted + '\n');
      console.log(`\n  Formatted and saved: ${args[0]}\n`);
    } else {
      console.log(formatted);
    }
  } catch (err) {
    console.error(`\n  Invalid JSON: ${err.message}\n`);
    process.exit(1);
  }
}

module.exports = jsonFmt;
