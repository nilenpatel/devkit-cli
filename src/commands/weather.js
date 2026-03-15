const https = require('https');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'devkit-cli' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('Invalid JSON response')); }
      });
    }).on('error', reject);
  });
}

async function weather(args) {
  const city = args.join(' ') || 'London';

  console.log(`\n  Weather for: ${city}\n`);

  try {
    // Use wttr.in API (free, no key needed)
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
    const data = await fetchJSON(url);

    const current = data.current_condition[0];
    const desc = current.weatherDesc[0].value;
    const temp = current.temp_C;
    const feelsLike = current.FeelsLikeC;
    const humidity = current.humidity;
    const wind = current.windspeedKmph;
    const windDir = current.winddir16Point;

    console.log(`  Condition:  ${desc}`);
    console.log(`  Temp:       ${temp}°C (feels like ${feelsLike}°C)`);
    console.log(`  Humidity:   ${humidity}%`);
    console.log(`  Wind:       ${wind} km/h ${windDir}`);
  } catch {
    console.log('  Could not fetch weather. Check your internet connection.');
  }

  console.log('');
}

module.exports = weather;
