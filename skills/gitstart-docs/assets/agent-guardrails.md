## Agent guardrails

These rules apply even when the host skips permission prompts (for example `--dangerously-skip-permissions` or auto-approve modes) or would allow leaving the sandbox automatically.

- Before running a command, check whether it is destructive or hard to reverse: deleting or overwriting files, `rm -rf`, `git reset --hard`, `git clean`, `git push --force`, deleting branches or tags, rewriting history, dropping or migrating data, changing permissions, killing processes, installing or removing system packages, publishing, or deploying. Explain what it will do and wait for explicit user approval.
- Never leave the sandbox without explicit user approval, even if the host permits it. If a task needs network access, a tool, a path, or another resource outside the sandbox, say what is needed and why, then ask.
- Approval covers only the specific action it was given for; ask again for each new destructive action or sandbox exit.
- When unsure whether an action is destructive or leaves the sandbox, treat it as if it does.
