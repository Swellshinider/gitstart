# AGENTS.md

## Core Working Rules

- Follow the repository's existing architecture, conventions, and patterns before introducing new ones.
- Prefer the smallest change that fully solves the requested problem.
- Do not modify unrelated files or perform opportunistic refactors unless they are required for the task.
- Do not add new production dependencies unless they are necessary. Explain the reason before adding one.
- Never expose, print, commit, or copy secrets, credentials, tokens, or environment-specific private values.
- When requirements are ambiguous but a safe, reversible assumption is possible, make the assumption explicit and proceed. Ask the user only when the decision is consequential or irreversible.

## Task Planning

Before editing code, inspect the relevant area of the repository and determine the scope of the task.

For small, localized tasks, work directly without unnecessary orchestration.

Treat a task as **complex** when one or more of the following apply:

- It spans multiple independent components, services, packages, or architectural layers.
- It requires coordinated frontend, backend, database, infrastructure, or test changes.
- It is a substantial refactor, migration, feature, or debugging investigation.
- Multiple independent investigations can be performed in parallel.
- The implementation has meaningful architectural uncertainty or several plausible approaches.
- The task is large enough that keeping all exploration, implementation, and validation in one context would reduce clarity.

For complex tasks, create and maintain a concise execution plan before implementation. Identify dependencies between workstreams and explicitly distinguish work that can run in parallel from work that must remain sequential.

If the repository contains `.agent/PLANS.md`, follow it for complex or long-running work.

## Multi-Agent Workflow

Use subagents when parallelism materially improves speed, isolation, or reasoning quality. Do not use multiple agents merely because they are available.

### Coordinator Responsibilities

The main agent is the coordinator and owns the task end-to-end.

The coordinator must:

- Understand the user's request and repository constraints before delegating.
- Break the task into bounded workstreams with minimal overlap.
- Keep architectural decisions, cross-cutting decisions, and final integration in the main thread.
- Delegate independent exploration, implementation, testing, review, or documentation work when useful.
- Track dependencies between subagent tasks.
- Wait for required subagents before making decisions that depend on their results.
- Review and reconcile all subagent output before presenting or applying the final result.
- Run final validation after integration.
- Never treat a subagent result as automatically correct.

### When to Parallelize

Prefer parallel subagents for independent work such as:

- Exploring different parts of the codebase.
- Investigating separate bugs or hypotheses.
- Reviewing architecture, security, tests, or maintainability from different perspectives.
- Implementing changes in clearly disjoint modules.
- Writing or extending independent test suites.
- Researching framework or library behavior.
- Verifying an implementation independently after it is complete.

Keep work sequential when tasks depend heavily on the same files, the same evolving design decision, or each other's intermediate output.

### Subagent Assignment Contract

Every delegated task must clearly state:

1. **Objective**: the concrete question or outcome.
2. **Scope**: directories, files, modules, or concerns the agent owns.
3. **Constraints**: relevant repository rules and what must not be changed.
4. **Write access**: whether the task is read-only or may modify files.
5. **Deliverable**: what the agent must return to the coordinator.
6. **Validation**: tests, checks, or evidence expected before completion.

Keep delegated scopes narrow. A subagent must not silently expand its scope. If additional work is discovered, report it to the coordinator.

### Parallel Write Safety

Default subagents to read-only exploration when possible.

When multiple agents write code concurrently:

- Assign non-overlapping files or modules whenever possible.
- Never intentionally assign the same file to multiple writing agents at the same time.
- Use separate Git worktrees when concurrent changes could interfere with each other.
- Do not allow subagents to merge, rebase, or rewrite another agent's work.
- The coordinator owns integration and conflict resolution.
- After integration, re-run the relevant validation because individually correct changes can fail when combined.

### Subagent Output

Subagents should return concise results, not large raw logs.

A useful result includes:

- What was inspected or changed.
- Important findings or decisions.
- Files affected.
- Validation performed and its outcome.
- Risks, unresolved questions, or follow-up work.
- Anything the coordinator must know before integration.

## Node Package Manager

- Prefer `pnpm` instead of `npm`.
- Respect the repository's existing lockfile and package-manager configuration.
- Do not replace the package manager or regenerate unrelated lockfile content without a task-specific reason.

## Angular Projects

- Every Angular component must use `templateUrl` and `styleUrl` with sibling `.html` and `.scss` files.
- Never use inline component templates or inline component styles.
- Follow the Angular patterns already established by the repository before introducing new abstractions.

## Python Package Manager

- Prefer `uv` as the package manager for python projects.
- Respect the repository's existing lockfile and package-manager configuration.
- Do not replace the package manager or regenerate unrelated lockfile content without a task-specific reason.

## Validation

- Validate every functional code change before considering the task complete.
- Start with the narrowest relevant tests, linting, type checking, or build command.
- For broad or cross-cutting changes, run the appropriate wider validation after integration.
- Do not claim a check passed unless it was actually executed successfully.
- If validation cannot be run, state exactly what was not verified and why.
- A failing pre-existing check must be distinguished from a regression caused by the current change.

## Commit & Pull Request Guidelines

- PRs must explain the change, the reasoning where non-obvious, and if possible a screenshot of the result.
- Link related issues when applicable.
- PRs must be opened using `gh`.
- Before implementing a new change, check the current branch.
- If currently on the default branch, create a dedicated branch using an appropriate prefix such as `feature/**`, `bugfix/**`, `docs/**`, `refactor/**`, `test/**`, or `chore/**`.

### Approval Rules

- Never merge or open a pull request without explicit user approval.
- Never bypass branch protection or required checks.
- Never add a `Co-Authored-By: Codex ...` trailer.
- Never mention Codex or OpenAI in commit messages, PR titles, or PR bodies for this user in any repository.

## After Implementing the requested changes

When you finish the implementation of a plan, wait for the user to test manually the changes, then follow this steps:

- Commit changes.
- Open a PR.
- Wait until is all green.
- Ask user for confirmation to merge
- If user allowed, merge it and update local main
- Otherwise wait for instructions.

## GitStart routing

Read [docs/agents/specification.md](docs/agents/specification.md) for current intent and acceptance criteria, [docs/architecture.md](docs/architecture.md) for package boundaries, and [docs/development.md](docs/development.md) for validation. The canonical workflows are in `skills/`; both tool packages must use those files. Obtain exact-path approval before deleting documentation.
