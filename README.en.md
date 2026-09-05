# dsh-mail-assistant

> npm migration candidate: `@eduwork/dsh-mail-assistant@0.1.0-alpha.5`, not published yet. Keep using the existing unscoped release until the scoped package is available. See [migration and data compatibility](docs/EDUWORK-MIGRATION.en.md).

[简体中文](README.md) | **English**

A security-focused mail assistant plugin for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). It reads through standard IMAP and sends through standard SMTP, while deliberately refusing to become another full mail client.

Current version: `0.1.0-alpha.4`. This is a public alpha preview for isolated environments and dedicated test mailboxes. Complete your own security and compliance review before connecting a critical mailbox.

## Scope

The plugin exposes exactly five agent tools:

| Tool | Capability | Hard boundary |
| --- | --- | --- |
| `mail_list_folders` | List server mailbox folders | Read-only; returns exact paths for archive/history searches |
| `mail_find` | Page through mail by metadata and date | At most 50 rows per page; opaque continuation cursor; no body search |
| `mail_read` | Read one plain-text message and attachment metadata | Read-only IMAP; never marks mail as read |
| `mail_get_attachment` | Save one attachment into the session workspace | Size cap, random name, no overwrite, workspace only |
| `mail_send` | Send or reply with plain text and workspace attachments | Ordinary permissions ask each time; Full Access skips prompts; sending must still be enabled separately |

It does not delete, move, archive, label, change flags, manage contacts or rules, poll in the background, wake agents, auto-reply, compose HTML, or provide a mailbox UI.

## Secure defaults

- Reading and sending are both disabled after installation. Startup performs no mail network access.
- Passwords and app passwords live only behind the DSH credential reference `DSH_MAIL_ASSISTANT_PASSWORD`; they never enter `settings.yaml` or a browser read response.
- IMAP always uses a read-only mailbox lock and never calls `STORE`, `COPY`, `MOVE`, or `EXPUNGE`.
- Subjects, bodies, addresses, and filenames are untrusted external data. They cannot authorize a send, request a secret, or change system policy.
- Historical searches expose `hasMore` and `nextCursor`; complete-coverage tasks must continue until `hasMore=false` instead of treating the first page as the entire mailbox.
- Sending is plain-text only. Recipient headers reject newline injection, and attachments must be regular files inside the current session workspace.
- Only implicit TLS and STARTTLS are supported; certificate validation cannot be disabled.
- A connection loss during SMTP DATA returns `unknown` and tells the agent not to retry automatically.

See the complete [security model](docs/security-model.en.md).

## Install

Prerequisites: Node.js 22+, DSH `0.1.2-alpha.2`, and a Profile with the official Settings, Credentials, Tools, Filesystem, Permission Presets, Approval, and Web Client capabilities.

For normal use, pin the reviewed exact npm version:

```bash
dsh plugin --profile web add dsh-mail-assistant@0.1.0-alpha.4
```

Use a source checkout for auditing, development, or unpublished changes:

```bash
git clone https://github.com/freedomkk-qfeng/dsh-mail-assistant.git
cd dsh-mail-assistant
npm ci
npm run check
dsh plugin --profile web add .
```

From the parent directory:

```bash
dsh plugin --profile web add ./dsh-mail-assistant
```

DSH links the checkout; it does not scan the invoking directory. Keep a source checkout in place. Use `dsh-mail-assistant@alpha` only when intentionally following prerelease updates.

## Configure and verify

Open **Settings → Mail assistant**. Enter the email address, app password, and optional sender display name first; choose a common provider or manually configure IMAP/SMTP; use Advanced settings only when needed; then enable agent reading and sending independently. After saving, ask the agent to find recent mail. The plugin intentionally does not log in during startup or save.

The v0.1 authentication profile is username plus password/app password over standard IMAP/SMTP. Providers that require OAuth2 are outside the current scope.

## DSH composition

The plugin uses official DSH seams: `ctx.credentials`, `ctx.settings`, `settings.section`, `ctx.tools`, `ctx.permissionPresets`, `tools/pre-execute`, `ctx.fs`, and the Client Loader. Ordinary permissions route sends through the composed Approval service; Full Access proceeds without a prompt. It does not fork the upstream Web client.

DSH `0.1.2-alpha.2` has bounded binary reads but no binary-write filesystem seam. `mail_get_attachment` therefore uses `ctx.fs` to resolve and fence the local destination before an exclusive local write. A remote/non-local FS Provider may not support that one tool. See [compatibility](docs/compatibility.en.md).

## Documentation

- [Getting started](docs/getting-started.en.md)
- [Architecture](docs/architecture.en.md)
- [Tool contract](docs/tool-contract.en.md)
- [Security model](docs/security-model.en.md)
- [Compatibility](docs/compatibility.en.md)
- [Public release checklist](docs/release-checklist.en.md)
- [Contributing](CONTRIBUTING.en.md)
- [Governance](GOVERNANCE.en.md)
- [Support](SUPPORT.en.md)
- [Security reporting](SECURITY.en.md)

The integration approach was informed by the MIT-licensed community project [`STARDUSTLC666/dsh-email`](https://github.com/STARDUSTLC666/dsh-email), with a redesigned permission, credential, read-only, workspace, untrusted-content, and approval boundary. See [third-party notices](THIRD_PARTY_NOTICES.en.md).

## License

[MIT](LICENSE)
