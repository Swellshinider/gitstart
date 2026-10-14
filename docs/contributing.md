# Contributing

Read [AGENTS.md](../AGENTS.md), the [architecture](architecture.md), and the [current specification](agents/specification.md) before changing GitStart. Keep changes focused on the requested behavior and follow existing patterns. Do not add runtime code, dependencies, or tool-specific skill copies without a concrete need.

Check the current branch before implementation. Create a dedicated `feature/`, `bugfix/`, `docs/`, `refactor/`, `test/`, or `chore/` branch when working from the default branch.

Validate the affected skills, templates, packaging, and links using the [development guide](development.md). Describe the behavior changed, why it matters, and the checks actually performed. Include a screenshot when a visual result exists; these Markdown workflows normally require concrete repository examples instead.

Keep useful decisions and unresolved questions in the current specification. Consolidate resolved information into the relevant documentation rather than accumulating duplicate progress logs. Propose exact paths and retained information before deleting obsolete documentation, and obtain approval.

After implementing an approved plan, wait for the user's manual testing before committing. Obtain explicit approval before opening a pull request with `gh`. Wait for required checks and obtain separate confirmation before merging; never bypass branch protection. Do not add a `Co-Authored-By` trailer or mention Codex or OpenAI in commit messages, PR titles, or PR bodies.
