const crypto = require('crypto');

function password(args) {
  let length = 16;
  let count = 1;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--length' || args[i] === '-l') && args[i + 1]) {
      length = Math.max(4, Math.min(parseInt(args[i + 1], 10) || 16, 128));
    }
    if ((args[i] === '--count' || args[i] === '-n') && args[i + 1]) {
      count = Math.min(parseInt(args[i + 1], 10) || 1, 50);
    }
  }

  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';

  console.log('');
  for (let i = 0; i < count; i++) {
    const bytes = crypto.randomBytes(length);
    let pw = '';
    for (let j = 0; j < length; j++) {
      pw += chars[bytes[j] % chars.length];
    }
    console.log(`  ${pw}`);
  }
  console.log('');
}

module.exports = password;
