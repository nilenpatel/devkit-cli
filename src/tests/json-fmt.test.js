const { describe, it, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const jsonFmt = require('../commands/json-fmt');

const TEST_FILE = path.join(__dirname, '..', '..', 'test-temp.json');

afterEach(() => {
  if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
});

describe('json-fmt', () => {
  it('should format valid JSON to stdout', () => {
    fs.writeFileSync(TEST_FILE, '{"a":1,"b":[2,3]}');

    // Capture stdout
    const originalLog = console.log;
    let output = '';
    console.log = (msg) => { output += msg; };

    jsonFmt([TEST_FILE]);

    console.log = originalLog;

    const parsed = JSON.parse(output);
    assert.strictEqual(parsed.a, 1);
    assert.deepStrictEqual(parsed.b, [2, 3]);
  });

  it('should write formatted JSON back to file with --write', () => {
    fs.writeFileSync(TEST_FILE, '{"compact":true}');
    jsonFmt([TEST_FILE, '--write']);

    const content = fs.readFileSync(TEST_FILE, 'utf-8');
    assert.ok(content.includes('  "compact"'));
  });
});
