const crypto = require('crypto');

function uuid(args) {
  let count = 1;
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--count' || args[i] === '-n') && args[i + 1]) {
      count = Math.min(parseInt(args[i + 1], 10) || 1, 100);
    }
  }

  console.log('');
  for (let i = 0; i < count; i++) {
    console.log(`  ${crypto.randomUUID()}`);
  }
  console.log('');
}

module.exports = uuid;
