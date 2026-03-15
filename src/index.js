#!/usr/bin/env node

const gitStats = require('./commands/git-stats');
const scaffold = require('./commands/scaffold');
const health = require('./commands/health');
const ports = require('./commands/ports');
const jsonFmt = require('./commands/json-fmt');
const loc = require('./commands/loc');
const uuid = require('./commands/uuid');
const password = require('./commands/password');
const hash = require('./commands/hash');
const b64 = require('./commands/b64');
const envInfo = require('./commands/env-info');
const timer = require('./commands/timer');
const ip = require('./commands/ip');
const color = require('./commands/color');
const serve = require('./commands/serve');
const size = require('./commands/size');

const COMMANDS = {
  'git-stats': { fn: gitStats, desc: 'Show git contribution stats for current repo' },
  'scaffold':  { fn: scaffold,  desc: 'Scaffold a new project (--type node|python|web --name NAME)' },
  'health':    { fn: health,    desc: 'Run a code health check on a directory' },
  'ports':     { fn: ports,     desc: 'List ports currently in use' },
  'json-fmt':  { fn: jsonFmt,   desc: 'Pretty-print and validate a JSON file' },
  'loc':       { fn: loc,       desc: 'Count lines of code by language' },
  'uuid':      { fn: uuid,      desc: 'Generate random UUIDs (--count N)' },
  'password':  { fn: password,  desc: 'Generate secure random passwords' },
  'hash':      { fn: hash,      desc: 'Compute SHA256/MD5/SHA512 hash of a file' },
  'b64':       { fn: b64,       desc: 'Base64 encode/decode text or files' },
  'env':       { fn: envInfo,   desc: 'Show system and dev environment info' },
  'timer':     { fn: timer,     desc: 'Countdown timer in terminal' },
  'ip':        { fn: ip,        desc: 'Show local and public IP addresses' },
  'color':     { fn: color,     desc: 'Preview a hex color with RGB/HSL info' },
  'serve':     { fn: serve,     desc: 'Simple local HTTP file server' },
  'size':      { fn: size,      desc: 'Show directory size breakdown by file type' },
};

function showHelp() {
  console.log('\n  devkit-cli — Developer Productivity Toolkit\n');
  console.log('  Usage: devkit <command> [options]\n');
  console.log('  Commands:\n');
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    console.log(`    ${name.padEnd(14)} ${cmd.desc}`);
  }
  console.log('\n  Options:\n');
  console.log('    --help       Show this help message');
  console.log('    --version    Show version number\n');
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.includes('--version') || args.includes('-v')) {
    const pkg = require('../package.json');
    console.log(`devkit-cli v${pkg.version}`);
    return;
  }

  const commandName = args[0];
  const command = COMMANDS[commandName];

  if (!command) {
    console.error(`  Unknown command: "${commandName}". Run "devkit --help" for available commands.`);
    process.exit(1);
  }

  command.fn(args.slice(1));
}

main();

module.exports = { COMMANDS };
