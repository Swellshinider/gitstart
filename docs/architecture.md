# Architecture

GitStart packages agent instructions and a small Node.js installer. The canonical workflows live in [`skills/`](../skills/); each skill has a `SKILL.md` entry point and any supporting templates it needs. Agents read those instructions and operate on the user's repository using their own tools. The installer only copies those files; it does not execute the workflows.

The three skills are independently usable:

- `gitstart-init` establishes a repository and useful documentation from current intent.
- `gitstart-readme` maintains the public overview and setup instructions.
- `gitstart-docs` reconciles the broader documentation with the repository's current state.

The root [`plugin.json`](../plugin.json) packages the skills for Codex. [`.claude-plugin/plugin.json`](../.claude-plugin/plugin.json) packages the same directory for Claude Code. Each tool's marketplace catalog points to the plugin root; skills are not copied into separate tool-specific versions.

The npm package `gitstart-cli` version `0.1.0` exposes the `gitstart-cli` binary through [`bin/gitstart-cli.js`](../bin/gitstart-cli.js). It requires Node.js 22 or newer, uses the standard library, and has no dependencies or postinstall hook. It is prepared for publication, not published.

The installer accepts multiple host selections and project or user scope, then copies all three canonical skill folders and assets to the [documented native roots](../README.md#installation). Project scope uses the current working directory; user scope uses the home directory. No host-specific skill conversion, new workflow, host installation, or settings edit is involved. Some hosts discover shared or compatible directories, so selected destinations do not imply exclusive host visibility.

Before copying, the installer checks destination files. Identical content is skipped, extra user files are preserved, and replacing different package-supplied files requires exact-path approval interactively. Non-interactive conflicts abort before writes. Plugin distribution remains separate from copied installations; using both can expose duplicate skill names.

Each changed file is rechecked before writing. Symlink destinations are refused. A failed skill update rolls back its writes without reverting earlier completed skills or overwriting external edits. Temporary backups of replaced files are removed on success or retained with their paths reported when recovery fails.

New repositories default to root `README.md` and `AGENTS.md`, human documentation in `docs/`, and agent specifications in `docs/agents/`. Existing conventions take priority unless the user accepts a migration. Templates provide structure, not invented project facts.

GitStart must preserve Git identity, remotes, history, configuration, unresolved questions, and useful project-specific content. Consolidation should reduce duplication while retaining meaning. Deletion requires a concrete proposal identifying paths, reasons, and where useful information survives, followed by explicit user approval.

See the [current specification](agents/specification.md) for acceptance criteria.
