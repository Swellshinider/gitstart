# Development

GitStart has no build step or production dependency. Its installer uses Node.js 22 or newer; development uses pnpm. Edit the canonical skill instructions and their templates directly. Keep the npm and plugin versions aligned; CI enforces this.

## Local installation and updates

Use the local entry point in the [README](../README.md) from a disposable project to test the installer. Test user scope with an isolated home directory rather than modifying your real host configuration. Re-running the installer skips identical files and prompts before replacing changed package files while preserving extra user files. No npm publication or registry access is needed for local testing.

For retained plugin installations, register a local checkout using the README commands. Consult `codex plugin --help` or `claude plugin --help` for the installed tool's update commands; alternatively remove and reinstall the plugin, then start a fresh session. Verify that the agent discovers the current skill text rather than a cached previous copy.

## Validation

Run the Node.js test suite through pnpm:

```sh
pnpm test
```

This runs `node --test`. [`test/installer.test.js`](../test/installer.test.js) covers the installer; [`test/docs.test.js`](../test/docs.test.js) checks relative Markdown links across the repository (using the bundled `skills/gitstart-docs/scripts/check-links.mjs`) and each skill's frontmatter and template tokens. The [specification](agents/specification.md) lists the acceptance criteria these tests must keep covering.

Pack into a temporary directory, inspect the archive, and execute the packaged binary in another disposable project. Replace the paths with actual temporary directories:

```sh
pnpm pack --pack-destination /absolute/path/to/temp-package
tar -tf /absolute/path/to/temp-package/gitstart-cli-*.tgz
tar -xf /absolute/path/to/temp-package/gitstart-cli-*.tgz -C /absolute/path/to/temp-extract
node /absolute/path/to/temp-extract/package/bin/gitstart-cli.js --agents "claude,codex,cursor,vscode,gemini" --scope project
```

Create the extraction directory first and run the final command from the disposable target project. Confirm the tarball includes the executable and all skill assets, excludes development-only files, and runs without dependencies. Packing is a local check; publication requires separate approval.

Check all JSON files for valid syntax. All plugins load the root `skills/` directory; the Codex, Claude Code (also read by VS Code), and Cursor marketplace catalogs must point to the same plugin root.

For Claude's packaging validator, run:

```sh
claude plugin validate --strict .claude-plugin/plugin.json
claude plugin validate --strict .claude-plugin/marketplace.json
claude plugin validate --strict skills
```

Skill frontmatter is validated by `pnpm test`; no external validator is needed.

## Continuous integration

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on pushes to `main` and on pull requests, on `windows-latest` with Node.js 22 and 24. It runs `pnpm test` (including the documentation checks), checks that the npm and plugin versions agree, and packs the package, extracts it, and installs all five hosts into an empty project. Claude's strict plugin validators and host discovery remain manual.

## Behavioral checks

Exercise the skills through an agent in disposable directories. Test an empty folder, freshly initialized Git, an existing documentation convention, missing branding assets, and obsolete documentation with incoming links. Check that a second application preserves project-specific content and open questions.

Confirm Git identity, remotes, configuration, and history survive. For documentation cleanup, verify that the agent presents exact deletion paths and retained information and waits for approval. Decline the proposal once and confirm no file is deleted. Check all retained references after an approved deletion.

Confirm installer copies are discoverable in each of the five hosts using isolated test configurations, and retain the Codex, Claude, Cursor, and VS Code plugin discovery checks. Metadata and file-copy validation prove packaging structure only; they do not prove the agent follows the workflow. Record executed checks and their outcomes, and state any checks that were not run.
