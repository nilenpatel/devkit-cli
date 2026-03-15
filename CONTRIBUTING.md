# Contributing to devkit-cli

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork this repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/devkit-cli.git`
3. Create a branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Run tests: `npm test`
6. Commit and push
7. Open a Pull Request

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Add tests for new features
- Update the README if you add a new command
- Use clear commit messages

## Adding a New Command

1. Create a new file in `src/commands/`
2. Export a function that accepts parsed arguments
3. Register it in `src/index.js`
4. Add a test in `src/tests/`

## Code Style

- Use `const`/`let`, never `var`
- Use template literals for string interpolation
- Handle errors gracefully with try/catch

## Reporting Issues

- Use GitHub Issues
- Include steps to reproduce
- Include your Node.js version and OS

## Discussions

Have a question or idea? Use the **Discussions** tab — answering questions there helps everyone and earns you the Galaxy Brain badge!
