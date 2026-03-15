const os = require('os');
const { execSync } = require('child_process');

function envInfo() {
  console.log('\n  Environment Info:\n');
  console.log(`  OS:         ${os.type()} ${os.release()} (${os.arch()})`);
  console.log(`  Platform:   ${os.platform()}`);
  console.log(`  Hostname:   ${os.hostname()}`);
  console.log(`  CPUs:       ${os.cpus().length} × ${os.cpus()[0]?.model || 'unknown'}`);
  console.log(`  Memory:     ${(os.totalmem() / (1024 ** 3)).toFixed(1)} GB total, ${(os.freemem() / (1024 ** 3)).toFixed(1)} GB free`);
  console.log(`  Uptime:     ${(os.uptime() / 3600).toFixed(1)} hours`);
  console.log(`  Node.js:    ${process.version}`);
  console.log(`  Home:       ${os.homedir()}`);

  try {
    const gitVer = execSync('git --version', { encoding: 'utf-8' }).trim();
    console.log(`  Git:        ${gitVer.replace('git version ', '')}`);
  } catch { /* git not installed */ }

  try {
    const npmVer = execSync('npm --version', { encoding: 'utf-8' }).trim();
    console.log(`  npm:        ${npmVer}`);
  } catch { /* npm not installed */ }

  console.log('');
}

module.exports = envInfo;
