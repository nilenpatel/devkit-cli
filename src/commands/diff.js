const fs = require('fs');
const path = require('path');

function diff(args) {
  if (args.length < 2) {
    console.error('  Usage: devkit diff <file1> <file2>');
    process.exit(1);
  }

  const file1 = path.resolve(args[0]);
  const file2 = path.resolve(args[1]);

  if (!fs.existsSync(file1)) {
    console.error(`  File not found: ${args[0]}`);
    process.exit(1);
  }
  if (!fs.existsSync(file2)) {
    console.error(`  File not found: ${args[1]}`);
    process.exit(1);
  }

  const lines1 = fs.readFileSync(file1, 'utf-8').split('\n');
  const lines2 = fs.readFileSync(file2, 'utf-8').split('\n');
  const maxLen = Math.max(lines1.length, lines2.length);

  let diffs = 0;

  console.log(`\n  Comparing:`);
  console.log(`  - ${args[0]}`);
  console.log(`  + ${args[1]}\n`);

  for (let i = 0; i < maxLen; i++) {
    const l1 = lines1[i];
    const l2 = lines2[i];

    if (l1 === undefined) {
      console.log(`  \x1b[32m+ ${i + 1}: ${l2}\x1b[0m`);
      diffs++;
    } else if (l2 === undefined) {
      console.log(`  \x1b[31m- ${i + 1}: ${l1}\x1b[0m`);
      diffs++;
    } else if (l1 !== l2) {
      console.log(`  \x1b[31m- ${i + 1}: ${l1}\x1b[0m`);
      console.log(`  \x1b[32m+ ${i + 1}: ${l2}\x1b[0m`);
      diffs++;
    }
  }

  if (diffs === 0) {
    console.log('  Files are identical.');
  } else {
    console.log(`\n  ${diffs} difference${diffs !== 1 ? 's' : ''} found.`);
  }
  console.log('');
}

module.exports = diff;
