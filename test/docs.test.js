import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repository = fileURLToPath(new URL('../', import.meta.url));
const script = path.join(repository, 'skills/gitstart-docs/scripts/check-links.mjs');
const check = root => spawnSync(process.execPath, [script, root], { encoding: 'utf8' });

test('link checker reports only broken relative links, with file and line', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gitstart-links-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'docs'));
  fs.writeFileSync(path.join(root, 'docs/ok.md'), '# Ok\n');
  fs.writeFileSync(path.join(root, 'README.md'), [
    '[good](docs/ok.md#top) [folder](docs/) [web](https://example.com/x) [mail](mailto:a@b.c) [anchor](#top)',
    '`[inline](missing-inline.md)`',
    '```md',
    '[fenced](missing-fenced.md)',
    '```',
    '[bad](docs/missing.md) <img src="missing.png">',
  ].join('\n'));
  const result = check(root);
  assert.equal(result.status, 1);
  const reported = result.stderr.split('\n').filter(line => line.includes(' -> '));
  assert.deepEqual(reported, ['README.md:6 -> docs/missing.md', 'README.md:6 -> missing.png']);
});

test('this repository has no broken relative Markdown links', () => {
  const result = check(repository);
  assert.equal(result.status, 0, result.stderr);
});

for (const skill of fs.readdirSync(path.join(repository, 'skills'))) {
  test(`skill ${skill} has valid frontmatter and balanced template tokens`, () => {
    const directory = path.join(repository, 'skills', skill);
    const text = fs.readFileSync(path.join(directory, 'SKILL.md'), 'utf8');
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1].trim();
    const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1].trim();
    assert.equal(name, skill);
    assert.match(name, /^[a-z0-9-]{1,64}$/);
    assert.ok(description && description.length <= 1024);
    const assets = path.join(directory, 'assets');
    for (const asset of fs.existsSync(assets) ? fs.readdirSync(assets) : []) {
      const content = fs.readFileSync(path.join(assets, asset), 'utf8');
      assert.equal((content.match(/\{\{/g) ?? []).length, (content.match(/\}\}/g) ?? []).length, asset);
    }
  });
}
