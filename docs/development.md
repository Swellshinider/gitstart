# Development

GitStart has no build step, application runtime, or production dependency. Edit the canonical skill instructions and their templates directly. Keep packaging metadata aligned at version `0.1.0` until a release changes it deliberately.

## Local installation and updates

Use the commands in the [README](../README.md) to register a local checkout and install the plugin. To test a changed checkout, consult `codex plugin --help` or `claude plugin --help` for the installed tool's update commands; alternatively remove and reinstall the plugin, then start a fresh session. Verify that the agent discovers the current skill text rather than a cached previous copy.

## Validation

Check all JSON files for valid syntax and confirm the two plugin manifests agree on the plugin name and version. Both hosts load the root `skills/` directory; the marketplace catalogs must point to the same plugin root. Check Markdown links against repository paths, allowing directory links and excluding examples inside code fences.

For Claude's packaging validator, run:

```sh
claude plugin validate --strict .claude-plugin/plugin.json
claude plugin validate --strict .claude-plugin/marketplace.json
claude plugin validate --strict skills
```

An optional authoring helper is the external skill-creator `quick_validate.py`. Its location is specific to your agent installation and is not a GitStart dependency. If available, run this for each of `gitstart-init`, `gitstart-readme`, and `gitstart-docs`, replacing both placeholders:

```sh
uv run --with pyyaml python <path-to-quick_validate.py> skills/<skill-name>
```

## Behavioral checks

Exercise the skills through an agent in disposable directories. Test an empty folder, freshly initialized Git, an existing documentation convention, missing branding assets, and obsolete documentation with incoming links. Check that a second application preserves project-specific content and open questions.

Confirm Git identity, remotes, configuration, and history survive. For documentation cleanup, verify that the agent presents exact deletion paths and retained information and waits for approval. Decline the proposal once and confirm no file is deleted. Check all retained references after an approved deletion.

Confirm both tools discover all three skills using isolated test configurations. Metadata validation proves packaging structure only; it does not prove the agent follows the workflow. Record executed checks and their outcomes, and state any checks that were not run.

## v0.1 validation

Validated on Windows on 2026-10-14 with Codex CLI `0.162.1` and Claude Code `2.1.296`:

- All three skills passed the external skill-creator validator. Claude's strict validators passed for the plugin, marketplace, and skills.
- JSON metadata, marketplace source paths, local Markdown links, template boundaries, and README license placement passed.
- Both plugins installed and uninstalled in temporary configurations. Claude's component inventory and Codex's `skills/list` API discovered all three skills; Codex exposes their names with the `gitstart:` prefix.
- Independent direct application in five disposable repositories checked bootstrap, repeated application, Git configuration preservation, existing layouts, missing branding, and pending documentation deletions. Follow-ups confirmed that declining deletion preserved every file and approving one exact path removed only that file, with retained information and valid references.

The workflow exercises used an independent agent reading the skill files, not inference sessions launched through the installed hosts. Automatic invocation and consistent host behavior remain for manual testing. No user host configuration was changed.
