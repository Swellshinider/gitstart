# Security Policy

## Reporting a vulnerability

Please do not report security vulnerabilities in public GitHub Issues.

Use GitHub's private vulnerability-reporting form:

<https://github.com/Swellshinider/gitstart/security/advisories/new>

If the private-reporting form is unavailable, do not disclose sensitive details
in a public issue. Contact a maintainer through a private channel they have
provided. This repository does not currently publish an alternate private
contact address or a response-time SLA.

When possible, include the affected version (`gitstart-cli --version`) or
commit, reproduction steps, impact, and any safe mitigation. Please allow
maintainers reasonable time to investigate before public disclosure.

## Supported versions

The project does not currently publish a formal version-support matrix. Include
the exact version or commit you tested in every report so the affected scope can
be established accurately.

## Scope

GitStart is a Markdown skill set plus a dependency-free Node.js installer that
copies files into project or home directories. Reports about the installer's
file handling (for example path traversal, symlink or junction handling, or
unintended overwrites) are in scope.
