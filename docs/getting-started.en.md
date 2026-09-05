# Getting started

[简体中文](getting-started.md) | **English**

## Requirements

- Node.js 22+;
- DeepSeek Harness `0.1.2-alpha.2`;
- a Profile with Settings, Credentials, Tools, Filesystem, Permission Presets, Approval, and Web Client;
- an IMAP/SMTP-enabled mailbox and provider-issued app password.

## Installation

For normal use, pin the reviewed exact npm version:

```bash
dsh plugin --profile web add @eduwork/dsh-mail@0.1.0-alpha.5
```

For auditing, development, or unpublished changes, use a source checkout:

```bash
git clone https://github.com/freedomkk-qfeng/dsh-mail-assistant.git
cd dsh-mail-assistant
npm ci
npm run check
dsh plugin --profile web add .
```

Installation adds one Bundle to the Profile. Empty configuration is valid: the plugin performs no server probe or runtime installation during install, startup, or save. A source installation links the checkout into the Profile, so keep that directory available. Team deployments should pin an exact npm version; use `@eduwork/dsh-mail@alpha` only when intentionally following prereleases.

## Configuration

Open **Settings → Mail assistant** and follow the page order:

1. Enter the email address, app password, and optional sender display name.
2. Select a common provider or manually configure IMAP/SMTP host, port, and TLS mode.
3. Use Advanced settings only when the provider needs a distinct login username, a nonstandard inbox path, or changed safety limits.
4. Enable Agent reading and sending independently, then save.

Typical secure combinations are IMAP 993 with implicit TLS, SMTP 465 with implicit TLS, or SMTP 587 with STARTTLS. Follow the provider's documentation. Certificate validation cannot be disabled.

## Acceptance

1. Enable reading only and find recent mail; unread state must not change.
2. List folders and use an exact returned path to search historical mail in an archive folder.
3. Search a range with more matches than a deliberately small page size; the agent must follow `nextCursor` until `hasMore=false` before summarizing the full range.
4. Read a test message containing prompt-injection text; the agent must treat it as untrusted data.
5. Download a small attachment; it must land under `.dsh-mail-assistant/attachments/` in the current workspace without overwriting.
6. Keep an ordinary permission preset, enable sending, and send to a controlled test address; a fresh approval must appear.
7. Reject approval; no SMTP send occurs.
8. Switch to Full Access and send again to the controlled address; no approval appears and delivery succeeds.
9. Try an attachment outside the workspace; the tool must reject it.

Use a dedicated test mailbox. Never put addresses, subjects, bodies, server logs, or app passwords in a public issue.
