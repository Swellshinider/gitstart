import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const agents = {
  claude: { label: 'Claude Code', directory: '.claude/skills' },
  codex: { label: 'Codex', directory: '.agents/skills' },
  cursor: { label: 'Cursor', directory: '.cursor/skills' },
  vscode: { label: 'VS Code (GitHub Copilot)', directory: '.github/skills', userDirectory: '.copilot/skills' },
  gemini: { label: 'Gemini CLI', directory: '.gemini/skills' },
};

export const skills = ['gitstart-init', 'gitstart-readme', 'gitstart-docs'];
const sourceRoot = fileURLToPath(new URL('../skills/', import.meta.url));

function filesIn(directory, relative = '') {
  return fs.readdirSync(path.join(directory, relative), { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => {
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) return filesIn(directory, name);
      if (!entry.isFile()) throw new Error(`Unsupported bundled skill file: ${name}`);
      return [name];
    });
}

function assertSafePath(target) {
  let current = path.resolve(target);
  let leaf = true;
  while (true) {
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (stat?.isSymbolicLink()) throw new Error(`Refusing symlink destination: ${current}`);
    if (stat && !leaf && !stat.isDirectory()) throw new Error(`Not a directory: ${current}`);
    if (stat && leaf && !stat.isFile()) throw new Error(`Not a regular file: ${current}`);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
    leaf = false;
  }
}

export function prepareInstall({ selectedAgents, scope, cwd, home }) {
  if (!['project', 'user'].includes(scope)) throw new Error('Scope must be project or user.');
  if (!selectedAgents.length || selectedAgents.some(name => !Object.hasOwn(agents, name))) {
    throw new Error('Choose valid agents: claude,codex,cursor,vscode,gemini.');
  }
  const base = path.resolve(scope === 'user' ? home : cwd);
  return [...new Set(selectedAgents)].flatMap(agent => skills.map(skill => {
    const host = agents[agent];
    const directory = path.join(base, scope === 'user' ? host.userDirectory ?? host.directory : host.directory, skill);
    const changes = filesIn(path.join(sourceRoot, skill)).flatMap(relative => {
      const target = path.join(directory, relative);
      assertSafePath(target);
      const content = fs.readFileSync(path.join(sourceRoot, skill, relative));
      const previous = fs.existsSync(target) ? fs.readFileSync(target) : null;
      const mode = previous === null ? 0o666 : fs.statSync(target).mode & 0o777;
      return previous?.equals(content) ? [] : [{ target, content, previous, mode }];
    });
    return { agent, skill, directory, changes };
  }));
}

function ensureDirectory(directory, created) {
  if (fs.existsSync(directory)) return;
  ensureDirectory(path.dirname(directory), created);
  fs.mkdirSync(directory);
  created.push(directory);
}

function assertContent(target, expected) {
  assertSafePath(target);
  const current = fs.existsSync(target) ? fs.readFileSync(target) : null;
  if (expected === null ? current !== null : !current?.equals(expected)) {
    throw new Error(`Destination changed after inspection: ${target}`);
  }
}

function writeAtomic(target, content, mode) {
  const temporary = path.join(path.dirname(target), `.gitstart-${randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temporary, content, { flag: 'wx', mode });
    fs.renameSync(temporary, target);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

export function applyInstall(plan, report = () => {}) {
  const completed = [];
  for (const entry of plan) {
    if (!entry.changes.length) {
      report(`Unchanged: ${entry.directory}`);
      continue;
    }
    const written = [];
    const created = [];
    const backups = new Map();
    try {
      // Recheck after prompts so a changed destination never uses stale approval.
      for (const change of entry.changes) {
        assertContent(change.target, change.previous);
      }
      for (const change of entry.changes) {
        assertContent(change.target, change.previous);
        ensureDirectory(path.dirname(change.target), created);
        if (change.previous !== null) {
          const backup = path.join(path.dirname(change.target), `.gitstart-${randomUUID()}.bak`);
          backups.set(change.target, backup);
          fs.writeFileSync(backup, change.previous, { flag: 'wx', mode: 0o600 });
        }
        writeAtomic(change.target, change.content, change.mode);
        written.push(change);
      }
    } catch (error) {
      const recoveryErrors = [];
      const retainedBackups = new Set();
      for (const change of written.reverse()) {
        try {
          assertContent(change.target, change.content);
          if (change.previous === null) fs.unlinkSync(change.target);
          else writeAtomic(change.target, change.previous, change.mode);
        } catch (recoveryError) {
          const backup = backups.get(change.target);
          if (backup) retainedBackups.add(backup);
          recoveryErrors.push(`${change.target}: ${recoveryError.message}${backup ? `; original retained at ${backup}` : ''}`);
        }
      }
      for (const backup of backups.values()) {
        if (retainedBackups.has(backup)) continue;
        try {
          if (fs.existsSync(backup)) fs.unlinkSync(backup);
        } catch (cleanupError) {
          recoveryErrors.push(`${backup}: ${cleanupError.message}`);
        }
      }
      for (const directory of created.reverse()) {
        try {
          fs.rmdirSync(directory);
        } catch (cleanupError) {
          if (!['ENOTEMPTY', 'ENOENT'].includes(cleanupError.code)) {
            recoveryErrors.push(`${directory}: ${cleanupError.message}`);
          }
        }
      }
      const recovery = recoveryErrors.length ? ` Recovery failed: ${recoveryErrors.join('; ')}.` : ' Changes to this skill were restored.';
      throw new Error(`${entry.directory}: ${error.message}.${recovery} Completed: ${completed.join(', ') || 'none'}.`);
    }
    completed.push(entry.directory);
    report(`Installed: ${entry.directory}`);
    for (const backup of backups.values()) {
      try {
        fs.unlinkSync(backup);
      } catch (error) {
        report(`Could not remove recovery backup ${backup}: ${error.message}`);
      }
    }
  }
}
