---
name: gitstart-init
description: Bootstrap an empty or freshly initialized project from an idea, with Git and useful repository documentation. Use when starting a project or establishing its initial documentation; use a maintenance workflow for established projects instead.
---

# Initialize a project

Turn the user's idea into a small, usable repository foundation. Keep known facts, chosen defaults, and unresolved questions distinct. Follow the repository's instructions and the user's authorization boundaries.

## Inspect before creating

- Read the idea and existing instructions, files, Git state, and manifests. Check whether the directory is already inside a parent repository before considering `git init`.
- If Git is absent, initialize it in the intended project directory. If it exists, preserve its history, branch conventions, identity, remotes, hooks, and configuration. Never change global Git settings or invent an identity or remote.
- Follow the project's branch policy before editing. Do not stage, commit, push, create a remote repository, open a PR, or publish as part of bootstrap unless separately authorized.
- Ask about consequential missing decisions; otherwise state a safe, reversible default and proceed. Do not select a license on the user's behalf.

## Establish the foundation

For a new project, use this default layout:

```text
README.md
AGENTS.md
.gitignore
docs/
  architecture.md
  development.md
  contributing.md
  agents/
    specification.md
```

These files must earn their place. Write only documentation supported by the idea or repository; omit a document if there is nothing useful to say yet. Keep the current scope and open questions in the specification instead of scattering them through empty documents.

If another layout already exists, describe the GitStart alternative and offer a migration. Preserve the established layout until the user accepts that migration. Preserve existing project-specific content on repeat runs; add or reconcile missing material instead of replacing entire files.

- Create a concise README describing the project and its usable setup or current development state. Link to existing documentation and agent instructions; never invent working commands, capabilities, assets, badges, or policies.
- Use [the agent instructions template](assets/AGENTS.template.md) only as a starting point when instructions are absent. Existing instructions take precedence. For Claude Code projects, offer a small `CLAUDE.md` that imports `AGENTS.md` with `@AGENTS.md` if no equivalent entry point exists; keep the instructions in one place.
- Use [the specification template](assets/specification.template.md) to record intent, the first deliverable, accepted decisions, and remaining questions. Link the original idea in place; do not silently move, delete, or duplicate it.
- Describe actual architecture, setup, and contribution steps. An instruction-only project needs no invented services, package manager, build, or test runner.
- Add ignore rules appropriate to discovered tooling, local artifacts, and secret-bearing files. Preserve existing rules and intentional sample files; never read or copy credentials into documentation.
- Add a license only after the user chooses one. Until then, state that licensing is undecided and omit license badges or reuse claims.

Replace template tokens with known facts; omit unsupported sections rather than leaving scaffold placeholders.

## Check the result

Verify links and setup commands where possible, inspect Git status and the changes, and check that rerunning bootstrap would preserve existing content and Git settings. Report created or updated files, explicit assumptions, unresolved decisions, and anything not verified. Do not claim implementation exists merely because its specification was written.
