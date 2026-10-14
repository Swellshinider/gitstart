<h1 align="center">GitStart</h1>

<p align="center">
    Three skills for coding agents to initialize repositories, maintain READMEs, and keep documentation useful as projects evolve.
</p>

GitStart v0.1.0 packages the same Markdown skills for Codex and Claude Code. It applies its documentation conventions to this repository. There is no application runtime or production dependency.

## Quick Start

### Requirements

- Codex, Claude Code, or any other agent tool with plugin support enabled.

### Installation

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

### Uninstallation

```sh
codex plugin remove gitstart@gitstart
```

```sh
claude plugin uninstall gitstart@gitstart --scope local
```

Removing the plugin does not remove documentation it has created in your projects.

## Skills

| Skill | Use it to |
| --- | --- |
| [gitstart-init](skills/gitstart-init/SKILL.md) | Inspect a new repository and establish Git and documentation foundations. |
| [gitstart-readme](skills/gitstart-readme/SKILL.md) | Create or refresh a README using the project's actual requirements and commands. |
| [gitstart-docs](skills/gitstart-docs/SKILL.md) | Reconcile documentation, decisions, open questions, and references with current project behavior. |

Select the relevant skill in your agent and describe the task, such as “Use gitstart-init to establish this repository from its project idea.” In Claude Code, invoke `/gitstart:gitstart-init`, `/gitstart:gitstart-readme`, or `/gitstart:gitstart-docs` with your request.

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
