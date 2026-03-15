# devkit-cli

A lightweight developer productivity CLI that helps you work faster — right from your terminal.

## Features

- **Git Stats** — Visualize your commit history, streak, and contribution patterns
- **Project Scaffolding** — Quickly generate boilerplate for Node.js, Python, and web projects
- **Code Health Check** — Scan for large files, TODO/FIXME comments, and potential issues
- **Port Scanner** — Check which ports are in use on your machine
- **JSON Formatter** — Pretty-print and validate JSON files from the terminal

## Installation

```bash
# Clone and use directly
git clone https://github.com/YOUR_USERNAME/devkit-cli.git
cd devkit-cli
node src/index.js --help

# Or install globally
npm install -g .
devkit --help
```

## Usage

```bash
# Show git contribution stats for current repo
devkit git-stats

# Scaffold a new project
devkit scaffold --type node --name my-app

# Run a code health check
devkit health .

# Check ports in use
devkit ports

# Format a JSON file
devkit json-fmt data.json
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT
