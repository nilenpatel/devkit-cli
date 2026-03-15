const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function hash(args) {
  if (args.length === 0) {
    console.error('  Usage: devkit hash <file> [--algo sha256|md5|sha512]');
    process.exit(1);
  }

  let algo = 'sha256';
  let filePath = args[0];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--algo' && args[i + 1]) {
      algo = args[++i];
    } else if (!args[i].startsWith('--')) {
      filePath = args[i];
    }
  }

  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`  File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(resolved);
  const h = crypto.createHash(algo).update(content).digest('hex');

  console.log(`\n  ${algo.toUpperCase()}: ${h}`);
  console.log(`  File:   ${filePath}\n`);
}

module.exports = hash;
