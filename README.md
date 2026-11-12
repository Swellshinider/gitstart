<h1 align="center">GitStart</h1>

<p align="center">
    Three skills for coding agents to initialize repositories, maintain READMEs, and keep documentation useful as projects evolve.
</p>

GitStart packages three Markdown skills and a dependency-free Node.js installer for Claude Code, Codex, Cursor, VS Code with GitHub Copilot, and Gemini CLI. It applies its documentation conventions to this repository. Plugins for Codex, Claude Code, Cursor, and VS Code remain available.

## Quick Start

### Requirements

- Windows 11; other platforms are not supported.
- Node.js 22 or newer for the installer.
- A supported agent with Agent Skills enabled. Install and configure the host separately.
- pnpm for local development and package validation.

### Installation

The npm package `gitstart-cli` is prepared for publication; it has not been published. For manual testing now, run the local entry point from the project that should receive the skills, replacing the path with your checkout's absolute path:

```sh
node /absolute/path/to/GitStart/bin/gitstart-cli.js
```

The numbered menu accepts multiple agents and asks for project or user scope. Project scope defaults to the current working directory; user scope uses your home directory. Every selected destination receives all three skill folders, including their assets.

For explicit selection, including non-interactive terminals:

```sh
node /absolute/path/to/GitStart/bin/gitstart-cli.js --agents "claude,codex,cursor,vscode,gemini" --scope project
node /absolute/path/to/GitStart/bin/gitstart-cli.js --help
node /absolute/path/to/GitStart/bin/gitstart-cli.js --version
```

`--agents` accepts any comma-separated selection of the five identifiers. `--scope` accepts `project` or `user`; both flags are required without an interactive terminal. After approved npm publication, the equivalent entry point will be:

```sh
npx gitstart-cli
```

| Agent (`--agents`) | Project skills root | User skills root | Official format |
| --- | --- | --- | --- |
| Claude Code (`claude`) | `.claude/skills/` | `~/.claude/skills/` | [Claude Code skills](https://code.claude.com/docs/en/skills) |
| Codex (`codex`) | `.agents/skills/` | `~/.agents/skills/` | [Codex skills](https://developers.openai.com/codex/skills) |
| Cursor (`cursor`) | `.cursor/skills/` | `~/.cursor/skills/` | [Cursor skills](https://cursor.com/docs/skills) |
| VS Code / Copilot (`vscode`) | `.github/skills/` | `~/.copilot/skills/` | [VS Code skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) |
| Gemini CLI (`gemini`) | `.gemini/skills/` | `~/.gemini/skills/` | [Gemini CLI skills](https://geminicli.com/docs/cli/skills/) |

Identical files are skipped. Before replacing a different file supplied by GitStart, the interactive installer presents its exact path and asks for approval. Extra user files are preserved. Non-interactive conflicts abort before any files are written. The installer does not install hosts, edit their settings, or run during package installation.

If an update fails, the installer restores changes to the affected skill and reports earlier completed installations. If recovery also fails, it reports the retained backup paths for replaced files; inspect those before retrying. Symlinks and junctions inside the destination are refused; the project or home directory itself may be redirected.

Start a fresh agent session after installation and check that all three skills appear. Paths follow official documentation; manual discovery and workflow testing in all five hosts remain pending. Some hosts also read another host's skill directories, so agent selection controls where files are copied, not which agents can discover them. Avoid installing the same skills through both copies and plugins unless you intend duplicate discovery.

#### Existing plugin installation

The GitHub repository is `Swellshinider/gitstart` and is private; collaborators need repository access and authenticated Git access to clone it. Run these commands from a local GitStart checkout. Once the package is available on the default branch, you can replace `.` in the marketplace registration commands with `Swellshinider/gitstart`.

For Codex:

```sh
codex plugin marketplace add .
codex plugin add gitstart@gitstart
```

For Claude Code:

```sh
claude plugin marketplace add .
claude plugin install gitstart@gitstart --scope local
```

Restart your agent session after installation if the skills are not available. Use a checkout's absolute path when registering this marketplace from a different directory.

Claude's `--scope local` enables GitStart only in the directory where you install it. To use it in another project, run the Claude commands there with the absolute GitStart checkout path instead of `.`.

For Cursor, the catalog is `.cursor-plugin/marketplace.json`. On Teams or Enterprise plans, an admin opens Dashboard → Plugins & MCPs → Team Marketplaces → Add Marketplace → Import from Repo and enters the repository URL. For local testing, copy the checkout to `~/.cursor/plugins/local/gitstart`, then run **Developer: Reload Window** and check **Customize**.

For VS Code with GitHub Copilot, enable `chat.plugins.enabled` and add the checkout to the `chat.plugins.marketplaces` setting, for example `"file:///C:/absolute/path/to/GitStart"` (or `Swellshinider/gitstart` once published on the default branch). Then run **Chat: Open Customizations**, open Plugins, Browse, and install `gitstart`. **Chat: Install Plugin from Source** also accepts the checkout folder. VS Code reads the root `plugin.json` and the `.claude-plugin/marketplace.json` catalog.

Cursor and VS Code plugin discovery follows their documentation and has not yet been tested in the actual hosts.

### Uninstallation

For installer copies, inspect custom content first, then remove only `gitstart-init/`, `gitstart-readme/`, and `gitstart-docs/` under each selected skills root in the table above. Preserve any custom content you need before removal. Do not remove shared skills roots or other skills.

For plugin installations:

```sh
codex plugin remove gitstart@gitstart
```

```sh
claude plugin uninstall gitstart@gitstart --scope local
```

For Cursor, uninstall GitStart in **Customize**, or delete `~/.cursor/plugins/local/gitstart` for a local copy. For VS Code, uninstall it from the Plugins view.

Removing copied skills or plugins does not remove documentation they have created in your projects.

## Skills

| Skill | Use it to |
| --- | --- |
| [gitstart-init](skills/gitstart-init/SKILL.md) | Inspect a new repository and establish Git and documentation foundations. |
| [gitstart-readme](skills/gitstart-readme/SKILL.md) | Create or refresh a README using the project's actual requirements and commands. |
| [gitstart-docs](skills/gitstart-docs/SKILL.md) | Reconcile documentation, decisions, open questions, and references with current project behavior. It can also audit without editing and ships `scripts/check-links.mjs`, which checks relative Markdown links (`node check-links.mjs [root]`). |

Select the relevant skill in your agent and describe the task, such as “Use gitstart-init to establish this repository from its project idea.” Copied Claude Code skills use `/gitstart-init`, `/gitstart-readme`, and `/gitstart-docs`; the Claude plugin uses `/gitstart:gitstart-init`, `/gitstart:gitstart-readme`, and `/gitstart:gitstart-docs`.

GitStart preserves existing conventions and project-specific content. It offers its layout before migrating an established repository. Documentation deletion requires approval of the exact paths and retained information.

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

Follow the [contribution guidelines](docs/contributing.md). Preserve user content and Git configuration, avoid secret disclosure, and request approval before deleting documentation.

## LICENSE

GitStart is available under the [MIT License](LICENSE).
