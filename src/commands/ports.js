const { execSync } = require('child_process');
const os = require('os');

function ports() {
  console.log('\n  Active Ports:\n');

  try {
    let output;
    const platform = os.platform();

    if (platform === 'win32') {
      output = execSync('netstat -ano', { encoding: 'utf-8' });
      const lines = output.split('\n').filter(l => l.includes('LISTENING'));
      const seen = new Set();

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const addr = parts[1];
          const pid = parts[4];
          const port = addr.split(':').pop();
          const key = `${port}-${pid}`;
          if (!seen.has(key)) {
            seen.add(key);
            console.log(`    Port ${port.padEnd(6)} PID ${pid}`);
          }
        }
      }
    } else {
      // macOS / Linux
      try {
        output = execSync('lsof -i -P -n 2>/dev/null | grep LISTEN || ss -tlnp 2>/dev/null', { encoding: 'utf-8' });
      } catch {
        output = execSync('netstat -tlnp 2>/dev/null || netstat -an', { encoding: 'utf-8' });
      }
      const lines = output.trim().split('\n');
      for (const line of lines.slice(0, 30)) {
        console.log(`    ${line.trim()}`);
      }
    }
  } catch (err) {
    console.error(`  Could not retrieve port information: ${err.message}`);
  }

  console.log('');
}

module.exports = ports;
