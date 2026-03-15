const fs = require('fs');
const path = require('path');

const TEMPLATES = {
  node: `node_modules/
dist/
.env
.env.local
*.log
coverage/
`,
  python: `__pycache__/
*.pyc
*.pyo
.env
venv/
.venv/
dist/
*.egg-info/
`,
  java: `*.class
*.jar
target/
.settings/
.classpath
.project
`,
  go: `bin/
vendor/
*.exe
*.test
`,
  rust: `target/
Cargo.lock
`,
  web: `.env
node_modules/
dist/
build/
.cache/
`,
  general: `.env
.DS_Store
Thumbs.db
*.log
*.tmp
`,
};

function gitignore(args) {
  if (args.length === 0) {
    console.log('\n  Usage: devkit gitignore <language>');
    console.log(`  Available: ${Object.keys(TEMPLATES).join(', ')}\n`);
    return;
  }

  const lang = args[0].toLowerCase();
  const template = TEMPLATES[lang];

  if (!template) {
    console.error(`  Unknown template: "${lang}". Available: ${Object.keys(TEMPLATES).join(', ')}`);
    process.exit(1);
  }

  const write = args.includes('--write') || args.includes('-w');

  if (write) {
    const target = path.resolve('.gitignore');
    if (fs.existsSync(target)) {
      const existing = fs.readFileSync(target, 'utf-8');
      fs.writeFileSync(target, existing + '\n' + template);
      console.log(`\n  Appended ${lang} rules to .gitignore\n`);
    } else {
      fs.writeFileSync(target, template);
      console.log(`\n  Created .gitignore with ${lang} rules\n`);
    }
  } else {
    console.log(`\n  .gitignore template for ${lang}:\n`);
    console.log(template);
  }
}

module.exports = gitignore;
