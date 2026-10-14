import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { agents, skills, prepareInstall, applyInstall } from '../lib/installer.js';
import { run } from '../lib/cli.js';

const repository = fileURLToPath(new URL('../', import.meta.url));
const roots = {
  project: { claude: '.claude/skills', codex: '.agents/skills', cursor: '.cursor/skills', vscode: '.github/skills', gemini: '.gemini/skills' },
  user: { claude: '.claude/skills', codex: '.agents/skills', cursor: '.cursor/skills', vscode: '.copilot/skills', gemini: '.gemini/skills' },
};

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'gitstart-installer-'));
  const cwd = path.join(directory, 'project');
  const home = path.join(directory, 'home');
  fs.mkdirSync(cwd);
  fs.mkdirSync(home);
  t.after(() => {
    assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith('gitstart-installer-'));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return { directory, cwd, home, interactive: false, log: () => {} };
}

function files(directory, relative = '') {
  return fs.readdirSync(path.join(directory, relative), { withFileTypes: true })
    .flatMap(entry => entry.isDirectory()
      ? files(directory, path.join(relative, entry.name))
      : [path.join(relative, entry.name)]).sort();
}

function write(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

for (const scope of ['project', 'user']) {
  test(`installs all five ${scope} destinations with complete unchanged skill contents`, async t => {
    const context = fixture(t);
    assert.equal(await run(['--agents', Object.keys(agents).join(','), '--scope', scope], context), 0);
    const base = scope === 'project' ? context.cwd : context.home;
    for (const [agent, root] of Object.entries(roots[scope])) {
      for (const skill of skills) {
        const source = path.join(repository, 'skills', skill);
        const destination = path.join(base, root, skill);
        assert.deepEqual(files(destination), files(source), `${agent}/${skill} file tree`);
        for (const relative of files(source)) {
          assert.deepEqual(fs.readFileSync(path.join(destination, relative)), fs.readFileSync(path.join(source, relative)), `${agent}/${skill}/${relative}`);
        }
      }
    }
    assert.deepEqual(fs.readdirSync(scope === 'project' ? context.home : context.cwd), []);
  });
}

test('repeated installation performs no writes and preserves additional user files', t => {
  const context = fixture(t);
  const options = { ...context, selectedAgents: ['claude'], scope: 'project' };
  applyInstall(prepareInstall(options));
  const extra = path.join(context.cwd, '.claude/skills/gitstart-init/assets/custom.md');
  write(extra, 'User resource');
  const before = files(context.cwd).map(relative => [relative, fs.statSync(path.join(context.cwd, relative)).mtimeMs]);
  const plan = prepareInstall(options);
  assert.ok(plan.every(entry => entry.changes.length === 0));
  const messages = [];
  applyInstall(plan, message => messages.push(message));
  assert.equal(messages.length, 3);
  assert.ok(messages.every(message => message.startsWith('Unchanged:')));
  assert.deepEqual(files(context.cwd).map(relative => [relative, fs.statSync(path.join(context.cwd, relative)).mtimeMs]), before);
  assert.equal(fs.readFileSync(extra, 'utf8'), 'User resource');
});

test('multiple selections deduplicate repeated agent destinations', async t => {
  const context = fixture(t);
  const plan = prepareInstall({ ...context, scope: 'project', selectedAgents: ['claude', 'gemini', 'claude'] });
  assert.equal(plan.length, 6);
  assert.equal(new Set(plan.map(entry => entry.directory)).size, 6);
  assert.equal(await run(['--agents', 'claude,gemini,claude', '--scope', 'project'], context), 0);
  assert.equal(files(context.cwd).filter(relative => path.basename(relative) === 'SKILL.md').length, 6);
});

test('approved conflicts replace only bundled files and refused conflicts skip the whole skill', async t => {
  const context = fixture(t);
  const approved = path.join(context.cwd, '.claude/skills/gitstart-init/SKILL.md');
  const declined = path.join(context.cwd, '.claude/skills/gitstart-readme/SKILL.md');
  const extra = path.join(context.cwd, '.claude/skills/gitstart-init/user.txt');
  write(approved, 'Original init');
  write(declined, 'Original readme');
  write(extra, 'Keep me');
  const answers = ['yes', 'no'];
  assert.equal(await run(['--agents', 'claude', '--scope', 'project'], {
    ...context, interactive: true, prompt: async () => answers.shift(),
  }), 0);
  assert.equal(answers.length, 0);
  assert.deepEqual(fs.readFileSync(approved), fs.readFileSync(path.join(repository, 'skills/gitstart-init/SKILL.md')));
  assert.equal(fs.readFileSync(declined, 'utf8'), 'Original readme');
  assert.deepEqual(fs.readdirSync(path.dirname(declined)), ['SKILL.md']);
  assert.equal(fs.readFileSync(extra, 'utf8'), 'Keep me');
  assert.ok(fs.existsSync(path.join(context.cwd, '.claude/skills/gitstart-docs/SKILL.md')));
  assert.ok(files(context.cwd).every(relative => !/\.gitstart-.*\.(bak|tmp)$/.test(path.basename(relative))));
});

test('a noninteractive conflict aborts every destination before writing', async t => {
  const context = fixture(t);
  const target = path.join(context.cwd, '.gemini/skills/gitstart-docs/SKILL.md');
  write(target, 'Existing instructions');
  await assert.rejects(run(['--agents', 'claude,gemini', '--scope', 'project'], context), /Existing files differ/);
  assert.deepEqual(files(context.cwd), [path.relative(context.cwd, target)]);
  assert.equal(fs.readFileSync(target, 'utf8'), 'Existing instructions');
});

test('invalid arguments and missing noninteractive selections leave both scopes untouched', async t => {
  const context = fixture(t);
  for (const args of [[], ['--agents', 'claude'], ['--scope', 'project'], ['--agents', 'unknown', '--scope', 'project'], ['--agents', '', '--scope', 'project'], ['--agents', 'claude', '--scope', 'invalid'], ['--unknown'], ['unexpected']]) {
    await assert.rejects(run(args, context));
    assert.deepEqual(fs.readdirSync(context.cwd), []);
    assert.deepEqual(fs.readdirSync(context.home), []);
  }
});

test('empty agent selection cancels before any writes', async t => {
  const context = fixture(t);
  assert.equal(await run([], { ...context, interactive: true, prompt: async () => '' }), 130);
  assert.deepEqual(fs.readdirSync(context.cwd), []);
  assert.deepEqual(fs.readdirSync(context.home), []);
});

test('cancellation during conflict approval writes nothing, including earlier approved skills', async t => {
  const context = fixture(t);
  const first = path.join(context.cwd, '.claude/skills/gitstart-init/SKILL.md');
  const second = path.join(context.cwd, '.claude/skills/gitstart-readme/SKILL.md');
  write(first, 'First original');
  write(second, 'Second original');
  let prompts = 0;
  assert.equal(await run(['--agents', 'claude', '--scope', 'project'], {
    ...context, interactive: true, prompt: async () => {
      if (++prompts === 1) return 'y';
      throw new DOMException('Cancelled', 'AbortError');
    },
  }), 130);
  assert.equal(prompts, 2);
  assert.equal(files(context.cwd).length, 2);
  assert.equal(fs.readFileSync(first, 'utf8'), 'First original');
  assert.equal(fs.readFileSync(second, 'utf8'), 'Second original');
});

test('interactive menus retry invalid selections and support multiple agents with user scope', async t => {
  const context = fixture(t);
  const answers = ['0', '1,5,1', 'wrong', '2'];
  assert.equal(await run([], { ...context, interactive: true, prompt: async () => answers.shift() }), 0);
  assert.equal(answers.length, 0);
  assert.deepEqual(fs.readdirSync(context.cwd), []);
  assert.equal(files(context.home).filter(relative => path.basename(relative) === 'SKILL.md').length, 6);
});

test('destination symlinks or Windows junctions are rejected without touching their targets', t => {
  const context = fixture(t);
  const external = path.join(context.directory, 'external');
  fs.mkdirSync(external);
  fs.symlinkSync(external, path.join(context.cwd, '.claude'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => prepareInstall({ ...context, selectedAgents: ['claude'], scope: 'project' }), /Refusing symlink/);
  assert.deepEqual(fs.readdirSync(external), []);
});

for (const existing of [false, true]) {
  test(`rejects a stale ${existing ? 'existing' : 'new'} destination after preflight`, t => {
    const context = fixture(t);
    const target = path.join(context.cwd, '.claude/skills/gitstart-init/SKILL.md');
    if (existing) write(target, 'Original');
    const plan = prepareInstall({ ...context, selectedAgents: ['claude'], scope: 'project' });
    write(target, 'Changed after approval');
    assert.throws(() => applyInstall(plan), /Destination changed after inspection/);
    assert.deepEqual(files(context.cwd), [path.relative(context.cwd, target)]);
    assert.equal(fs.readFileSync(target, 'utf8'), 'Changed after approval');
  });
}

for (const existing of [false, true]) {
  test(`failed writes restore ${existing ? 'overwritten files and preserve extras' : 'new files and newly created directories'}`, t => {
    const context = fixture(t);
    const options = { ...context, selectedAgents: ['claude'], scope: 'project' };
    const initial = prepareInstall(options)[0];
    const original = initial.changes[0].target;
    const extra = path.join(initial.directory, 'user.txt');
    if (existing) {
      write(original, 'Restore this original');
      write(extra, 'Preserve this extra');
    }
    const plan = prepareInstall(options);
    const rename = fs.renameSync;
    let calls = 0;
    t.mock.method(fs, 'renameSync', (...args) => {
      if (++calls === 2) throw new Error('Simulated rename failure');
      return rename(...args);
    });
    assert.throws(() => applyInstall(plan), /Simulated rename failure.*Changes to this skill were restored.*Completed: none/);
    if (existing) {
      assert.equal(fs.readFileSync(original, 'utf8'), 'Restore this original');
      assert.equal(fs.readFileSync(extra, 'utf8'), 'Preserve this extra');
      assert.deepEqual(files(context.cwd), [path.relative(context.cwd, original), path.relative(context.cwd, extra)].sort());
    } else {
      assert.deepEqual(fs.readdirSync(context.cwd), []);
    }
    assert.ok(files(context.directory).every(relative => !/\.gitstart-.*\.(bak|tmp)$/.test(path.basename(relative))));
  });
}

test('rechecks later files after an earlier write and preserves concurrent edits', t => {
  const context = fixture(t);
  const options = { ...context, selectedAgents: ['claude'], scope: 'project' };
  const initial = prepareInstall(options)[0];
  const first = initial.changes[0].target;
  const second = initial.changes[1].target;
  write(first, 'First original');
  write(second, 'Second original');
  const plan = prepareInstall(options);
  const rename = fs.renameSync;
  let calls = 0;
  t.mock.method(fs, 'renameSync', (...args) => {
    const result = rename(...args);
    if (++calls === 1) write(second, 'External edit');
    return result;
  });
  assert.throws(() => applyInstall(plan), /Destination changed after inspection.*Changes to this skill were restored/);
  assert.equal(fs.readFileSync(first, 'utf8'), 'First original');
  assert.equal(fs.readFileSync(second, 'utf8'), 'External edit');
  assert.deepEqual(files(context.cwd), [path.relative(context.cwd, first), path.relative(context.cwd, second)].sort());
});

for (const existing of [false, true]) {
  test(`rollback preserves an externally edited ${existing ? 'overwritten' : 'new'} file and reports incomplete recovery`, t => {
    const context = fixture(t);
    const options = { ...context, selectedAgents: ['claude'], scope: 'project' };
    const first = prepareInstall(options)[0].changes[0].target;
    if (existing) write(first, 'Original before install');
    const plan = prepareInstall(options);
    const rename = fs.renameSync;
    let calls = 0;
    t.mock.method(fs, 'renameSync', (...args) => {
      if (++calls === 2) {
        write(first, 'External edit');
        throw new Error('Simulated rename failure');
      }
      return rename(...args);
    });
    let failure;
    assert.throws(() => applyInstall(plan), error => {
      failure = error;
      assert.match(error.message, /Simulated rename failure.*Recovery failed:.*Destination changed after inspection/);
      return true;
    });
    assert.equal(fs.readFileSync(first, 'utf8'), 'External edit');
    const backups = files(context.cwd).filter(relative => relative.endsWith('.bak'));
    if (existing) {
      assert.equal(backups.length, 1);
      const backup = path.join(context.cwd, backups[0]);
      assert.equal(fs.readFileSync(backup, 'utf8'), 'Original before install');
      assert.ok(failure.message.includes(`original retained at ${backup}`));
    } else {
      assert.deepEqual(backups, []);
    }
    assert.deepEqual(files(context.cwd).filter(relative => !backups.includes(relative)), [path.relative(context.cwd, first)]);
  });
}

test('original survives in a reported backup when install and restoration renames fail', t => {
  const context = fixture(t);
  const options = { ...context, selectedAgents: ['claude'], scope: 'project' };
  const first = prepareInstall(options)[0].changes[0].target;
  write(first, 'Original retained for recovery');
  const plan = prepareInstall(options);
  const rename = fs.renameSync;
  let calls = 0;
  t.mock.method(fs, 'renameSync', (...args) => {
    if (++calls >= 2) throw new Error('Install and recovery rename failed');
    return rename(...args);
  });
  let failure;
  assert.throws(() => applyInstall(plan), error => {
    failure = error;
    assert.match(error.message, /Install and recovery rename failed.*Recovery failed:/);
    return true;
  });
  const backups = files(context.cwd).filter(relative => relative.endsWith('.bak'));
  assert.equal(backups.length, 1);
  const backup = path.join(context.cwd, backups[0]);
  assert.equal(fs.readFileSync(backup, 'utf8'), 'Original retained for recovery');
  assert.ok(failure.message.includes(`original retained at ${backup}`));
  assert.deepEqual(fs.readFileSync(first), plan[0].changes[0].content);
  assert.deepEqual(files(context.cwd).filter(relative => !backups.includes(relative)), [path.relative(context.cwd, first)]);
});

test('failure in a later skill reports completed destinations and restores only the affected skill', t => {
  const context = fixture(t);
  const options = { ...context, selectedAgents: ['claude'], scope: 'project' };
  const initial = prepareInstall(options);
  const original = initial[1].changes[0].target;
  write(original, 'Readme original');
  const plan = prepareInstall(options);
  const failureTarget = plan[1].changes[1].target;
  const rename = fs.renameSync;
  let failed = false;
  const messages = [];
  t.mock.method(fs, 'renameSync', (...args) => {
    if (args[1] === failureTarget && !failed) {
      failed = true;
      throw new Error('Later skill failed');
    }
    return rename(...args);
  });
  assert.throws(() => applyInstall(plan, message => messages.push(message)), error => {
    assert.match(error.message, /Later skill failed.*Changes to this skill were restored/);
    assert.ok(error.message.endsWith(`Completed: ${plan[0].directory}.`));
    return true;
  });
  assert.deepEqual(messages, [`Installed: ${plan[0].directory}`]);
  const source = path.join(repository, 'skills', plan[0].skill);
  assert.deepEqual(files(plan[0].directory), files(source));
  for (const relative of files(source)) {
    assert.deepEqual(fs.readFileSync(path.join(plan[0].directory, relative)), fs.readFileSync(path.join(source, relative)));
  }
  assert.equal(fs.readFileSync(original, 'utf8'), 'Readme original');
  assert.deepEqual(files(plan[1].directory), [path.relative(plan[1].directory, original)]);
  assert.equal(fs.existsSync(plan[2].directory), false);
});

test('restrictive Unix permissions survive replacement and restoration', { skip: process.platform === 'win32' ? 'Windows chmod does not implement Unix permission bits.' : false }, t => {
  const context = fixture(t);
  const options = { ...context, selectedAgents: ['claude'], scope: 'project' };
  const initial = prepareInstall(options)[0];
  const first = initial.changes[0].target;
  const second = initial.changes[1].target;
  write(first, 'Original');
  fs.chmodSync(first, 0o600);
  applyInstall(prepareInstall(options));
  assert.equal(fs.statSync(first).mode & 0o777, 0o600);
  write(first, 'Restore original');
  write(second, 'Other changed original');
  const plan = prepareInstall(options);
  const rename = fs.renameSync;
  let calls = 0;
  t.mock.method(fs, 'renameSync', (...args) => {
    if (++calls === 2) {
      const backups = files(context.cwd).filter(relative => relative.endsWith('.bak'));
      assert.equal(backups.length, 2);
      for (const relative of backups) assert.equal(fs.statSync(path.join(context.cwd, relative)).mode & 0o777, 0o600);
      throw new Error('Simulated rename failure');
    }
    return rename(...args);
  });
  assert.throws(() => applyInstall(plan), /Simulated rename failure/);
  assert.equal(fs.readFileSync(first, 'utf8'), 'Restore original');
  assert.equal(fs.statSync(first).mode & 0o777, 0o600);
  assert.ok(files(context.cwd).every(relative => !/\.gitstart-.*\.(bak|tmp)$/.test(path.basename(relative))));
});

test('actual executable prints help/version and exits unsuccessfully for invalid arguments', t => {
  const context = fixture(t);
  const executable = path.join(repository, 'bin/gitstart-cli.js');
  const { version } = JSON.parse(fs.readFileSync(path.join(repository, 'package.json'), 'utf8'));
  for (const args of [['--help'], ['--version'], ['--unknown'], ['--agents', 'claude', '--scope', 'invalid'], []]) {
    const result = spawnSync(process.execPath, [executable, ...args], { cwd: context.cwd, encoding: 'utf8' });
    assert.equal(result.error, undefined);
    assert.equal(result.status, args.includes('--help') || args.includes('--version') ? 0 : 1, result.stderr);
    if (args.includes('--help')) assert.match(result.stdout, /Usage: gitstart-cli/);
    if (args.includes('--version')) assert.equal(result.stdout.trim(), version);
  }
  assert.deepEqual(fs.readdirSync(context.cwd), []);
  assert.deepEqual(fs.readdirSync(context.home), []);
});
