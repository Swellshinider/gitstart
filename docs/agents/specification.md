# GitStart v0.1 specification

## Goal and decisions

Provide three reusable repository maintenance skills, install them through a selectable npm CLI, and apply their conventions to GitStart itself. This file is the current specification.

- English instructions and documentation; MIT license.
- Canonical skills: `gitstart-init`, `gitstart-readme`, and `gitstart-docs` under `skills/`.
- Plugin and marketplace name: `gitstart`; initial version: `0.1.0`.
- Private GitHub distribution repository: `Swellshinider/gitstart`; collaborators require repository access. Local installation is the verified path.
- Codex and Claude Code plugins share the same canonical skill files and remain available separately from the copy installer.
- npm package and binary: `gitstart-cli`; version: `0.1.0`; Node.js 22 or newer; no dependencies, build step, or postinstall hook. Prepare for publication without publishing until separately approved.
- Installer hosts: Claude Code, Codex, Cursor, VS Code with GitHub Copilot, and Gemini CLI. Copy all three skill folders and their assets without conversion to the native roots documented in the README.
- Interactive numbered multiple selection, then project or user scope; project defaults to the current working directory, user uses the home directory. No host installation, host settings changes, or new workflows.
- Explicit arguments: `--agents claude,codex,cursor,vscode,gemini` with any selection, `--scope project|user`, `--help`, and `--version`. Non-interactive installation requires both selection flags.
- Skip identical files, preserve extra user files, and obtain exact-path approval before replacing differing package files interactively. Non-interactive conflicts abort before any writes.
- Agent selection determines written destinations, not exclusive discovery. Compatible directories and mixed plugin/copy installations can expose duplicates.
- Offer GitStart's layout for existing repositories and migrate only after acceptance.
- Preserve Git configuration and user content. Require exact-path approval before documentation deletion.
- Add assets and badges only when real assets or verified links exist; do not invent project answers or published URLs.

## Acceptance criteria

Each skill is discoverable and usable independently. Initialization handles both an empty directory and existing Git safely. README maintenance includes requirements, installation, uninstallation, agent guidance, documentation, policies, and license last. Documentation maintenance reconciles current facts, resolves references, and retains open questions.

Repeated application preserves project-specific content. Packaging metadata, skill resources, and repository links validate. Disposable-repository exercises cover existing conventions, absent branding assets, and deletion proposals with incoming references. The retained plugins must discover all three skills in isolated test configurations; behavioral checks and any unverified cases must be reported honestly.

Installer tests verify all five hosts and both scopes, CLI errors, idempotence, asset copying, approved and declined conflicts, non-interactive failure before writes, and preservation of unrelated files. `pnpm test` runs `node --test`. A locally packed tarball includes the binary and canonical assets and runs without dependencies. Manual discovery and workflow validation in all five actual hosts remains a separate acceptance step.

Removal instructions identify only the three GitStart skill folders under each chosen root, require inspection of custom content, and preserve shared directories and generated project documentation. Local testing uses the checkout's absolute `bin/gitstart-cli.js` path; `npx gitstart-cli` is documented only as a command for after approved publication.

## Milestones

1. v0.1 foundation: three skills, supporting templates, shared Codex and Claude packaging, and GitStart's own documentation.
2. Validate packaging, discovery, and behavior; complete user manual testing before commit and PR approval.
3. Prepare and validate the npm installer against documented five-host skill formats; complete manual host testing and obtain separate approval before publication.

## Open future questions

- Which release process should publish the marketplace and npm package after approval?

Native directories have been checked against official host documentation; runtime discovery and workflow behavior in all five hosts must still be tested. Replace resolved questions with concise decisions in the appropriate document rather than retaining an obsolete decision log.
