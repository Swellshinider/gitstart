---
name: gitstart-docs
description: Maintain project documentation as implementation and decisions evolve, consolidate useful context, repair links, audit documentation for drift without editing, and propose obsolete documentation for deletion. Use for documentation updates, audits, or cleanup, not code refactoring or initial repository setup.
---

# Maintain useful documentation

Keep active documentation accurate and short enough to serve both people and agents. Read the repository instructions and only the documents and implementation evidence relevant to the requested change. Respect the user's scope.

## Update current knowledge

- Identify the source of truth for each topic before editing. Compare documented behavior with actual code, configuration, commands, and accepted decisions. Keep planned behavior distinguishable from implemented behavior.
- Preserve the repository's documentation layout. If it differs from GitStart's root README/AGENTS, human `docs/`, and `docs/agents/` convention, offer that layout; migrate only after acceptance.
- Update the existing canonical document instead of adding a competing one. Keep agent specifications focused on current intent, accepted decisions, acceptance criteria, and unresolved questions.
- When a question is resolved by evidence or a user decision, retain the resulting decision in the current document and remove the resolved question there. Do not turn proposals or assumptions into accepted decisions.
- Consolidate useful content before proposing redundant files for deletion. Preserve still-relevant rationale, compatibility constraints, and operational knowledge.
- Repair affected links, including README indexes, agent instructions, Markdown links, and references from code or configuration. Do not assume a file is unused because no Markdown link points to it.
- When the specification covers more than one deliverable, split it into `docs/agents/<feature>.md` files and keep `specification.md` as an index with the overall intent.
- In a monorepo, keep shared documentation at the root. Each package's README and `AGENTS.md` cover only what is specific to it and link to the root instead of repeating it.
- Do not archive by default, create repetitive progress logs, copy secrets, or rewrite unrelated files. Keep the original idea document unless its relocation or removal is explicitly approved.

## Audit only

When the user asks to review or audit documentation, change nothing. Report each divergence between the documentation and the repository as a table, then offer to apply the fixes:

| Document | Claim | Evidence | Proposed fix |
| --- | --- | --- | --- |

## Review before deletion

Never delete a document merely because it is old, short, unlinked, or appears superseded. Check its unique information, callers, incoming references, and any retention requirements. If its purpose remains uncertain, keep it and state the uncertainty.

After updating active material, present a concrete removal proposal for each candidate:

| Exact path | Evidence it is obsolete | Useful information retained at | References to repair |
| --- | --- | --- | --- |

Ask for approval of those exact paths and wait before deleting them. A general request to clean up documentation does not approve unspecified deletions. Approval of exact paths already given in the conversation remains valid; do not ask again. If the contents or references changed after approval, reassess the proposal before acting.

When deletion is approved, remove only the approved files, preserve unrelated work, repair their remaining references, and verify that no needed information was lost. Do not remove whole directories just to remove a few documents.

## Verify and report

Check updated facts and commands against their sources. If Node.js is available, run `node <skill-dir>/scripts/check-links.mjs <repo-root>` to find broken relative links (it does not check `#anchors`); otherwise resolve relative links from each document's directory by hand. Inspect the diff for accidental information loss. Report updated files, unresolved contradictions, pending deletion proposals, and checks actually performed. Never claim a deletion happened while approval is pending.
