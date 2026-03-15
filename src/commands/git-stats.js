const { execSync } = require('child_process');

function gitStats() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    console.error('  Not a git repository. Run this inside a git repo.');
    process.exit(1);
  }

  const log = execSync(
    'git log --format="%H|%an|%ae|%aI" --no-merges',
    { encoding: 'utf-8' }
  ).trim();

  if (!log) {
    console.log('  No commits found.');
    return;
  }

  const lines = log.split('\n');
  const authors = {};
  const dateCounts = {};

  for (const line of lines) {
    const [hash, name, email, date] = line.split('|');
    const day = date.slice(0, 10);

    authors[name] = (authors[name] || 0) + 1;
    dateCounts[day] = (dateCounts[day] || 0) + 1;
  }

  // Total commits
  console.log(`\n  Total commits: ${lines.length}`);

  // Top contributors
  const sorted = Object.entries(authors).sort((a, b) => b[1] - a[1]);
  console.log('\n  Top Contributors:');
  for (const [name, count] of sorted.slice(0, 5)) {
    const bar = '█'.repeat(Math.min(count, 40));
    console.log(`    ${name.padEnd(20)} ${String(count).padStart(4)} ${bar}`);
  }

  // Streak calculation
  const days = Object.keys(dateCounts).sort().reverse();
  let streak = 0;
  if (days.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    let check = new Date(today);
    for (let i = 0; i < 365; i++) {
      const key = check.toISOString().slice(0, 10);
      if (dateCounts[key]) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
  }
  console.log(`\n  Current streak: ${streak} day${streak !== 1 ? 's' : ''}`);

  // Most active day
  const busiest = Object.entries(dateCounts).sort((a, b) => b[1] - a[1])[0];
  if (busiest) {
    console.log(`  Most active day: ${busiest[0]} (${busiest[1]} commits)`);
  }

  console.log('');
}

module.exports = gitStats;
