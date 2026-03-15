const { describe, it, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const scaffold = require('../commands/scaffold');

const TEST_DIR = path.join(__dirname, '..', '..', 'test-output');

afterEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

describe('scaffold', () => {
  it('should create a node project', () => {
    const name = path.join(TEST_DIR, 'node-test');
    scaffold(['--type', 'node', '--name', name]);

    assert.ok(fs.existsSync(path.join(name, 'package.json')));
    assert.ok(fs.existsSync(path.join(name, 'index.js')));
    assert.ok(fs.existsSync(path.join(name, '.gitignore')));

    const pkg = JSON.parse(fs.readFileSync(path.join(name, 'package.json'), 'utf-8'));
    assert.ok(pkg.name.includes('node-test'));
  });

  it('should create a python project', () => {
    const name = path.join(TEST_DIR, 'py-test');
    scaffold(['--type', 'python', '--name', name]);

    assert.ok(fs.existsSync(path.join(name, 'main.py')));
    assert.ok(fs.existsSync(path.join(name, 'requirements.txt')));
  });

  it('should create a web project', () => {
    const name = path.join(TEST_DIR, 'web-test');
    scaffold(['--type', 'web', '--name', name]);

    assert.ok(fs.existsSync(path.join(name, 'index.html')));
    assert.ok(fs.existsSync(path.join(name, 'style.css')));
    assert.ok(fs.existsSync(path.join(name, 'app.js')));
  });
});
