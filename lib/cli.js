import fs from 'node:fs';
import { homedir } from 'node:os';
import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline/promises';
import { agents, prepareInstall, applyInstall } from './installer.js';

const { version } = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const help = `GitStart ${version}
Usage: gitstart-cli [--agents claude,codex,cursor,vscode,gemini] [--scope project|user]

Without selection flags, a terminal menu selects one or more agents and the scope.
Project scope uses the current directory; user scope uses your home directory.
All three GitStart skills and their assets are installed. Different existing
files require confirmation; additional files are preserved.
Without an interactive terminal, both flags are required and conflicts abort.

  --help       Show this help
  --version    Show the package version`;

export async function run(args, {
  cwd = process.cwd(),
  home = homedir(),
  interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY),
  prompt,
  log = console.log,
} = {}) {
  const { values } = parseArgs({ args, options: {
    agents: { type: 'string' },
    scope: { type: 'string' },
    help: { type: 'boolean' },
    version: { type: 'boolean' },
  } });
  if (values.help) { log(help); return 0; }
  if (values.version) { log(version); return 0; }
  if (values.scope && !['project', 'user'].includes(values.scope)) throw new Error('Scope must be project or user.');
  let selectedAgents = values.agents?.split(',').map(name => name.trim());
  if (selectedAgents?.some(name => !Object.hasOwn(agents, name))) {
    throw new Error('Choose valid agents: claude,codex,cursor,vscode,gemini.');
  }
  if (!interactive && (!selectedAgents || !values.scope)) {
    throw new Error('Without a terminal, provide --agents and --scope. Run --help for usage.');
  }
  let readline;
  const abort = new AbortController();
  const ask = async question => {
    if (prompt) return prompt(question);
    if (!readline) {
      readline = createInterface({ input: process.stdin, output: process.stdout });
      readline.on('SIGINT', () => abort.abort());
      readline.on('close', () => abort.abort());
    }
    return readline.question(question, { signal: abort.signal });
  };
  try {
    const names = Object.keys(agents);
    while (!selectedAgents) {
      names.forEach((name, index) => log(`${index + 1}. ${agents[name].label}`));
      const answer = (await ask('Choose agents (numbers separated by commas; empty cancels): ')).trim();
      if (!answer) throw new DOMException('Installation cancelled', 'AbortError');
      const selections = answer.split(',').map(number => number.trim());
      if (selections.some(number => !/^[1-5]$/.test(number))) {
        log('Choose numbers from 1 to 5.');
        continue;
      }
      selectedAgents = selections.map(number => names[Number(number) - 1]);
    }
    let scope = values.scope;
    while (!scope) {
      const answer = (await ask('Scope: 1. Current project (default), 2. User [1]: ')).trim();
      if (!answer || answer === '1' || answer === 'project') scope = 'project';
      else if (answer === '2' || answer === 'user') scope = 'user';
      else log('Choose 1 (project) or 2 (user).');
    }
    const plan = prepareInstall({ selectedAgents, scope, cwd, home });
    log(`Install all three skills (${scope} scope):`);
    for (const entry of plan) log(`  ${entry.directory}${entry.changes.length ? '' : ' (unchanged)'}`);
    log('Other agents may discover these directories too. Avoid duplicate plugin/skill installations.');
    const conflicts = plan.filter(entry => entry.changes.some(change => change.previous !== null));
    if (!interactive && conflicts.length) {
      throw new Error(`Existing files differ; rerun in a terminal to approve replacement:\n${conflicts.flatMap(entry => entry.changes.filter(change => change.previous !== null).map(change => change.target)).join('\n')}`);
    }
    const declined = new Set();
    for (const entry of conflicts) {
      log(`Existing files to replace in ${entry.directory}:`);
      entry.changes.filter(change => change.previous !== null).forEach(change => log(`  ${change.target}`));
      if (!/^(y|yes)$/i.test((await ask('Replace these files? [y/N]: ')).trim())) {
        declined.add(entry);
        log(`Skipped: ${entry.directory}`);
      }
    }
    applyInstall(plan.filter(entry => !declined.has(entry)), log);
    log('Open a fresh agent session to check skill discovery. No agent settings were changed.');
    return 0;
  } catch (error) {
    if (error.name !== 'AbortError') throw error;
    log('Installation cancelled.');
    return 130;
  } finally {
    readline?.close();
  }
}
