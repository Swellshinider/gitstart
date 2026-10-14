# Architecture

GitStart is an instruction package, not an executable application. The canonical workflows live in [`skills/`](../skills/); each skill has a `SKILL.md` entry point and any supporting templates it needs. Agents read those instructions and operate on the user's repository using their own tools.

The three skills are independently usable:

- `gitstart-init` establishes a repository and useful documentation from current intent.
- `gitstart-readme` maintains the public overview and setup instructions.
- `gitstart-docs` reconciles the broader documentation with the repository's current state.

The root [`plugin.json`](../plugin.json) packages the skills for Codex. [`.claude-plugin/plugin.json`](../.claude-plugin/plugin.json) packages the same directory for Claude Code. Each tool's marketplace catalog points to the plugin root; skills are not copied into separate tool-specific versions.

New repositories default to root `README.md` and `AGENTS.md`, human documentation in `docs/`, and agent specifications in `docs/agents/`. Existing conventions take priority unless the user accepts a migration. Templates provide structure, not invented project facts.

GitStart must preserve Git identity, remotes, history, configuration, unresolved questions, and useful project-specific content. Consolidation should reduce duplication while retaining meaning. Deletion requires a concrete proposal identifying paths, reasons, and where useful information survives, followed by explicit user approval.

See the [current specification](agents/specification.md) for acceptance criteria.
