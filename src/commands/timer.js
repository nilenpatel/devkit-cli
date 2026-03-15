function timer(args) {
  if (args.length === 0) {
    console.error('  Usage: devkit timer <seconds>');
    process.exit(1);
  }

  const seconds = parseInt(args[0], 10);
  if (isNaN(seconds) || seconds <= 0) {
    console.error('  Please provide a positive number of seconds.');
    process.exit(1);
  }

  if (seconds > 3600) {
    console.error('  Maximum timer is 3600 seconds (1 hour).');
    process.exit(1);
  }

  console.log(`\n  Timer: ${seconds} seconds\n`);

  let remaining = seconds;
  const interval = setInterval(() => {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    process.stdout.write(`\r  ⏱  ${display} remaining  `);
    remaining--;

    if (remaining < 0) {
      clearInterval(interval);
      process.stdout.write('\r  ⏱  00:00 — Time\'s up!     \n\n');
    }
  }, 1000);
}

module.exports = timer;
