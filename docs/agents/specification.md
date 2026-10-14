# GitStart v0.1 specification

## Goal and decisions

Provide three reusable repository maintenance skills and apply their conventions to GitStart itself. This file is the current specification.

- English instructions and documentation; MIT license.
- Canonical skills: `gitstart-init`, `gitstart-readme`, and `gitstart-docs` under `skills/`.
- Plugin and marketplace name: `gitstart`; initial version: `0.1.0`.
- Private GitHub distribution repository: `Swellshinider/gitstart`; collaborators require repository access. Local installation is the verified path.
- Codex and Claude Code packaging share the same skill files.
- Markdown instructions, templates, and packaging metadata only; no runtime or production dependencies.
- Offer GitStart's layout for existing repositories and migrate only after acceptance.
- Preserve Git configuration and user content. Require exact-path approval before documentation deletion.
- Add assets and badges only when real assets or verified links exist; do not invent project answers or published URLs.

## Acceptance criteria

Each skill is discoverable and usable independently. Initialization handles both an empty directory and existing Git safely. README maintenance includes requirements, installation, uninstallation, agent guidance, documentation, policies, and license last. Documentation maintenance reconciles current facts, resolves references, and retains open questions.

Repeated application preserves project-specific content. Packaging metadata, skill resources, and repository links validate. Disposable-repository exercises cover existing conventions, absent branding assets, and deletion proposals with incoming references. Both tools must discover all three skills in isolated test configurations; behavioral checks and any unverified cases must be reported honestly.

## Milestones

1. v0.1 foundation: three skills, supporting templates, shared Codex and Claude packaging, and GitStart's own documentation.
2. Validate packaging, discovery, and behavior; complete user manual testing before commit and PR approval.
3. Evaluate additional tool packaging only after checking each tool's actual supported format.

## Open future questions

- Which release process should publish the marketplace?
- Which of Cursor, Gemini, or Copilot should be supported next, and what native packaging does that tool accept?

Do not claim compatibility with those tools until it is verified. Replace resolved questions with concise decisions in the appropriate document rather than retaining an obsolete decision log.
