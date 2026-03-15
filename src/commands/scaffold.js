const fs = require('fs');
const path = require('path');

const TEMPLATES = {
  node: {
    'package.json': JSON.stringify({
      name: '',
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: { test: 'node --test', start: 'node index.js' },
      license: 'MIT',
    }, null, 2),
    'index.js': '// Entry point\nconsole.log("Hello, world!");\n',
    '.gitignore': 'node_modules/\n.env\n',
  },
  python: {
    'main.py': '"""Entry point."""\n\n\ndef main():\n    print("Hello, world!")\n\n\nif __name__ == "__main__":\n    main()\n',
    'requirements.txt': '# Add dependencies here\n',
    '.gitignore': '__pycache__/\n*.pyc\n.env\nvenv/\n',
  },
  web: {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello, world!</h1>
  <script src="app.js"></script>
</body>
</html>`,
    'style.css': `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 2rem; }
h1 { color: #333; }
`,
    'app.js': '// App logic\nconsole.log("App loaded");\n',
  },
};

function scaffold(args) {
  let type = 'node';
  let name = 'my-project';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--type' && args[i + 1]) type = args[++i];
    if (args[i] === '--name' && args[i + 1]) name = args[++i];
  }

  const template = TEMPLATES[type];
  if (!template) {
    console.error(`  Unknown template type: "${type}". Available: ${Object.keys(TEMPLATES).join(', ')}`);
    process.exit(1);
  }

  const dir = path.resolve(name);
  if (fs.existsSync(dir)) {
    console.error(`  Directory "${name}" already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });

  for (const [filename, content] of Object.entries(template)) {
    let fileContent = content;
    if (filename === 'package.json') {
      const pkg = JSON.parse(content);
      pkg.name = name;
      fileContent = JSON.stringify(pkg, null, 2);
    }
    fs.writeFileSync(path.join(dir, filename), fileContent);
  }

  console.log(`\n  Scaffolded "${type}" project in ./${name}/`);
  console.log(`  Files created: ${Object.keys(template).join(', ')}\n`);
}

module.exports = scaffold;
