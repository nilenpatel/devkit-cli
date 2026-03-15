const https = require('https');
const os = require('os');

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const results = [];
  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs) {
      if (!addr.internal && addr.family === 'IPv4') {
        results.push({ name, address: addr.address });
      }
    }
  }
  return results;
}

function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).ip);
        } catch {
          reject(new Error('Failed to parse response'));
        }
      });
    }).on('error', reject);
  });
}

async function ip() {
  console.log('\n  IP Addresses:\n');

  // Local IPs
  const locals = getLocalIPs();
  for (const { name, address } of locals) {
    console.log(`  Local (${name}): ${address}`);
  }

  // Public IP
  try {
    const publicIP = await getPublicIP();
    console.log(`  Public:         ${publicIP}`);
  } catch {
    console.log('  Public:         Could not determine (no internet?)');
  }

  console.log('');
}

module.exports = ip;
