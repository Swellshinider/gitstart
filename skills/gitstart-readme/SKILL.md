---
name: gitstart-readme
description: Create or maintain a project's README using the GitStart structure, verified setup instructions, and links to current documentation. Use for README creation or updates, not general documentation cleanup or code implementation.
---

# Create or maintain a README

Read the repository instructions, current README, relevant documentation, manifests, and available assets. Establish what the project actually does and what a reader can use today. Preserve project-specific details and the user's scope.

## Structure

Use [the README template](assets/README.template.md) for a new README or an accepted migration. For an existing README with another convention, offer the GitStart structure and preserve its organization unless the user accepts the change.

Keep this section order when the GitStart structure is used:

1. Centered project title and concise description; optional real logo, badges, and screenshot.
2. Quick Start: Requirements, Installation, Uninstallation.
3. Project-specific usage or other useful sections.
4. AI Coding Assistant.
5. Documentation.
6. Project policies.
7. LICENSE, always last.

## Ground every claim

- Explain current behavior separately from planned work. Verify commands against actual manifests, scripts, or tool help; run safe checks where available. Mark commands that cannot be verified.
- Use the repository's package manager and installation scope. For plugins, include both installation and removal steps for supported hosts; do not delete shared host directories during uninstallation.
- If setup or removal does not apply, say so briefly instead of inventing commands. Never imply that removing a tool also removes user-created project documentation.
- Include a logo or screenshot only when its asset exists; add appropriate alternative text. Include badges only for verified repository, CI, or license targets. Omit unsupported branding without creating placeholder images.
- Keep Markdown outside HTML paragraph blocks. A centered title and an optional HTML image can stand alone; the description and any Markdown screenshot belong in normal Markdown.
- Link the AI Coding Assistant section to existing `AGENTS.md` and relevant docs. If instructions are missing, identify the gap rather than creating a broken link or expanding this task into a bootstrap.
- Link only current documentation and real policies. State that licensing is undecided if no license is established; never infer permission to reuse the project.
- Replace template tokens with facts and remove template notes from the output. Preserve useful content during updates; do not replace an existing README wholesale just to change headings.

## Verify and report

Check relative links, assets, section order, and consistency between commands and project state. Inspect the diff for lost information. Report what changed and which commands or links were not verified.
