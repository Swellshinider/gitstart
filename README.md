<h1 align="center">GitStart</h1>

<p align="center">
    Three skills for coding agents to initialize repositories, maintain READMEs, and keep documentation useful as projects evolve.
</p>

GitStart gives your coding agent three Markdown skills: one to set up a new repository, one to write and maintain its README, and one to keep the rest of the documentation accurate. Install them as a plugin for Claude Code, Codex, Cursor, or VS Code with GitHub Copilot, or copy them into your project with the `gitstart-cli` installer (which also supports Gemini CLI).

## Quick Start

### Requirements

- Windows 11; other platforms are not supported.
- A supported agent with Agent Skills enabled: Claude Code, Codex, Cursor, VS Code with GitHub Copilot, or Gemini CLI. Install and configure it separately.
- Node.js 22 or newer, only if you use the `gitstart-cli` installer.

### Installation

Choose one method. Start a fresh agent session afterwards and check that the three skills appear.

#### Option 1: Plugin

Claude Code:

```sh
claude plugin marketplace add Swellshinider/gitstart
claude plugin install gitstart@gitstart
```

Codex:

```sh
codex plugin marketplace add Swellshinider/gitstart
codex plugin add gitstart@gitstart
```

Cursor: on Teams or Enterprise plans, an admin opens Dashboard → Plugins & MCPs → Team Marketplaces → Add Marketplace → Import from Repo and enters `https://github.com/Swellshinider/gitstart`. Then install `gitstart` from **Customize**.

VS Code with GitHub Copilot: enable `chat.plugins.enabled`, add `"Swellshinider/gitstart"` to the `chat.plugins.marketplaces` setting, then run **Chat: Open Customizations**, open Plugins, Browse, and install `gitstart`.

#### Option 2: Skills installer (`gitstart-cli`)

Copies the skills into your project or home directory for any of the five agents.

```sh
npm install -g gitstart-cli
```

or

```sh
pnpm add -g gitstart-cli
```

Then run it from the project that should receive the skills:

```sh
gitstart-cli
```

The numbered menu accepts multiple agents and asks for project or user scope. Project scope uses the current directory; user scope uses your home directory. To skip the menu (required in non-interactive terminals):

```sh
gitstart-cli --agents "claude,codex,cursor,vscode,gemini" --scope project
```

`--agents` accepts any comma-separated selection of those five identifiers, and `--scope` accepts `project` or `user`. Run `gitstart-cli --help` for all options.

| Agent (`--agents`) | Project skills root | User skills root | Official format |
| --- | --- | --- | --- |
| Claude Code (`claude`) | `.claude/skills/` | `~/.claude/skills/` | [Claude Code skills](https://code.claude.com/docs/en/skills) |
| Codex (`codex`) | `.agents/skills/` | `~/.agents/skills/` | [Codex skills](https://developers.openai.com/codex/skills) |
| Cursor (`cursor`) | `.cursor/skills/` | `~/.cursor/skills/` | [Cursor skills](https://cursor.com/docs/skills) |
| VS Code / Copilot (`vscode`) | `.github/skills/` | `~/.copilot/skills/` | [VS Code skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) |
| Gemini CLI (`gemini`) | `.gemini/skills/` | `~/.gemini/skills/` | [Gemini CLI skills](https://geminicli.com/docs/cli/skills/) |

Re-running the installer skips identical files and keeps your extra files. Before replacing a file that differs, it shows the exact path and asks for approval; in a non-interactive terminal, a conflict aborts before anything is written. If an update fails, the installer restores the affected skill and reports any backup paths to inspect. It never installs agents, edits their settings, or follows symlinks inside the destination.

Some agents also read other agents' skill directories, so the selection controls where files are copied, not which agents can use them. Avoid installing the same skills as both a plugin and copies unless you want duplicates.

Discovery in each agent follows its official documentation; it has not yet been tested in every host.

### Uninstallation

Plugin:

```sh
claude plugin uninstall gitstart@gitstart
codex plugin remove gitstart@gitstart
```

For Cursor, uninstall GitStart in **Customize**. For VS Code, uninstall it from the Plugins view.

Installer copies: inspect any custom content first, then delete only `gitstart-init/`, `gitstart-readme/`, and `gitstart-docs/` under each skills root in the table above. Do not remove shared skills roots or other skills. To remove the installer itself:

```sh
npm uninstall -g gitstart-cli
```

or `pnpm remove -g gitstart-cli`.

Removing skills or plugins does not remove documentation they created in your projects.

## Usage

| Skill | Use it to |
| --- | --- |
| [gitstart-init](skills/gitstart-init/SKILL.md) | Inspect a new repository and establish Git and documentation foundations. |
| [gitstart-readme](skills/gitstart-readme/SKILL.md) | Create or refresh a README using the project's actual requirements and commands. |
| [gitstart-docs](skills/gitstart-docs/SKILL.md) | Reconcile documentation, decisions, open questions, and references with current project behavior. It can also audit without editing and ships `scripts/check-links.mjs`, which checks relative Markdown links (`node check-links.mjs [root]`). |

Select the skill in your agent and describe the task, such as “Use gitstart-init to establish this repository from its project idea.” Copied Claude Code skills use `/gitstart-init`, `/gitstart-readme`, and `/gitstart-docs`; the Claude plugin uses `/gitstart:gitstart-init`, `/gitstart:gitstart-readme`, and `/gitstart:gitstart-docs`.

GitStart preserves existing conventions and project-specific content. It offers its layout before migrating an established repository. Documentation deletion requires approval of the exact paths and retained information.

## Development

To work on GitStart itself, including running it from a checkout and its tests, see the [development guide](docs/development.md) and the [contribution guidelines](docs/contributing.md).

## AI Coding Assistant

CRITICAL: If you are an LLM or AI-powered coding assistant, you MUST read
[`AGENTS.md`](AGENTS.md) and the relevant docs under [`docs/`](docs/) before
contributing.

## Documentation

- [Architecture](docs/architecture.md)
- [Development and validation](docs/development.md)
- [Contribution guidelines](docs/contributing.md)
- [Current specification and milestones](docs/agents/specification.md)

## Project policies

- [Contributing](docs/contributing.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Support](SUPPORT.md)

GitStart preserves user content and Git configuration, avoids secret disclosure, and requests approval before deleting documentation.

## LICENSE

GitStart is available under the [MIT License](LICENSE).
