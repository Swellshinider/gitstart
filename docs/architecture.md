# Architecture

GitStart packages agent instructions and a small Node.js installer. The canonical workflows live in [`skills/`](../skills/); each skill has a `SKILL.md` entry point and any supporting templates it needs. Agents read those instructions and operate on the user's repository using their own tools. The installer only copies those files; it does not execute the workflows.

The three skills are independently usable:

- `gitstart-init` establishes a repository and useful documentation from current intent.
- `gitstart-readme` maintains the public overview and setup instructions.
- `gitstart-docs` reconciles the broader documentation with the repository's current state, or only audits it. It bundles [`scripts/check-links.mjs`](../skills/gitstart-docs/scripts/check-links.mjs), a dependency-free relative-link checker that agents run when Node.js is available; `pnpm test` runs it against this repository.

The root [`plugin.json`](../plugin.json) packages the skills for Codex, Cursor, and VS Code. [`.claude-plugin/plugin.json`](../.claude-plugin/plugin.json) packages the same directory for Claude Code. Marketplace catalogs point to the plugin root: [`.agents/plugins/marketplace.json`](../.agents/plugins/marketplace.json) for Codex, [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json) for Claude Code and VS Code (Copilot reads it as a fallback location), and [`.cursor-plugin/marketplace.json`](../.cursor-plugin/marketplace.json) for Cursor. Skills are not copied into separate tool-specific versions.

The npm package `gitstart-cli` exposes the `gitstart-cli` binary through [`bin/gitstart-cli.js`](../bin/gitstart-cli.js). It requires Node.js 22 or newer, uses the standard library, and has no dependencies or postinstall hook. It is prepared for publication, not published.

The installer copies all three canonical skill folders and assets, unconverted, to the [documented native roots](../README.md#installation); it never installs hosts or edits their settings. Selection, scope, conflict handling, and duplicate discovery with plugins are described in the README. The guarantees below are implemented in [`lib/installer.js`](../lib/installer.js).

Each changed file is rechecked before writing. Symlinks and junctions below the project or home directory are refused; the base directory itself may be redirected. A failed skill update rolls back its writes without reverting earlier completed skills or overwriting external edits. Temporary backups of replaced files are removed on success or retained with their paths reported when recovery fails.

New repositories default to root `README.md` and `AGENTS.md`, human documentation in `docs/`, and agent specifications in `docs/agents/`. Existing conventions take priority unless the user accepts a migration. Templates provide structure, not invented project facts.

GitStart must preserve Git identity, remotes, history, configuration, unresolved questions, and useful project-specific content. Consolidation should reduce duplication while retaining meaning. Deletion requires a concrete proposal identifying paths, reasons, and where useful information survives, followed by explicit user approval.

See the [current specification](agents/specification.md) for acceptance criteria.
