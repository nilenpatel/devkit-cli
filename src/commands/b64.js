const fs = require('fs');
const path = require('path');

function b64(args) {
  if (args.length < 2) {
    console.error('  Usage: devkit b64 <encode|decode> <text or --file path>');
    process.exit(1);
  }

  const action = args[0];
  let input;

  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const filePath = path.resolve(args[fileIdx + 1]);
    if (!fs.existsSync(filePath)) {
      console.error(`  File not found: ${args[fileIdx + 1]}`);
      process.exit(1);
    }
    input = fs.readFileSync(filePath, 'utf-8');
  } else {
    input = args.slice(1).join(' ');
  }

  if (action === 'encode') {
    console.log(`\n  ${Buffer.from(input).toString('base64')}\n`);
  } else if (action === 'decode') {
    console.log(`\n  ${Buffer.from(input, 'base64').toString('utf-8')}\n`);
  } else {
    console.error(`  Unknown action: "${action}". Use "encode" or "decode".`);
    process.exit(1);
  }
}

module.exports = b64;
