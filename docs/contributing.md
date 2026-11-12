# Contributing

Thanks for helping improve GitStart. Read the [architecture](architecture.md) and the [current specification](agents/specification.md) before changing it. Keep changes focused on the requested behavior and follow existing patterns. Do not add runtime code, dependencies, or tool-specific skill copies without a concrete need. Coding agents must also follow [AGENTS.md](../AGENTS.md).

## Prerequisites

Node.js 22 or newer and pnpm (the version is pinned by `packageManager` in `package.json`). There is no build step. See the [development guide](development.md) to run GitStart from a checkout.

## Workflow

1. Fork the repository (or branch, if you have write access) and create a dedicated `feature/`, `bugfix/`, `docs/`, `refactor/`, `test/`, or `chore/` branch. Do not work on `main`.
2. Make the smallest change that fully addresses the issue. Update documentation in the same change as behavior.
3. Validate the affected skills, templates, packaging, and links using the [development guide](development.md); at minimum run `pnpm test`.
4. Open a pull request using the template. Describe the behavior changed, why it matters, and the checks actually performed. Include a screenshot when a visual result exists; these Markdown workflows normally need concrete repository examples instead.

Never include credentials, tokens, or private data in commits, issues, or pull requests. Report vulnerabilities through [SECURITY.md](../SECURITY.md), not public issues.

## Commit messages and PR titles

Use a conventional-commit prefix: `<type>: <summary>` with a lowercase type, such as `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`, and an imperative lowercase summary without a trailing period. Add `!` before the colon for a breaking change. Examples: `feat: add cursor marketplace`, `docs: remove dated validation logs`.

## Documentation

Keep useful decisions and unresolved questions in the current specification. Consolidate resolved information into the relevant documentation rather than accumulating duplicate progress logs. Propose exact paths and retained information before deleting obsolete documentation, and obtain approval.

## Review and merge

Maintainers merge after required checks pass; branch protection is never bypassed. For maintainers and agents working with a user: wait for the user's manual testing before committing, obtain explicit approval before opening a pull request with `gh`, and obtain separate confirmation before merging. Do not add a `Co-Authored-By` trailer or mention the AI tool used in commit messages, PR titles, or PR bodies.

By contributing, you agree that your contributions are licensed under the [MIT License](../LICENSE). Participation is governed by the [Code of Conduct](../CODE_OF_CONDUCT.md).
