# Compatibility and known limits

[简体中文](compatibility.md) | **English**

Package `@eduwork/dsh-mail@0.1.0-alpha.5` retains the alpha.4 runtime and settings contracts. See [migration](EDUWORK-MIGRATION.en.md).

## Reviewed baseline

- DeepSeek Harness `0.1.2-alpha.2`;
- Node.js 22+;
- dynamic Web Client Bundle;
- local Host filesystem;
- IMAP4rev1/IMAP4rev2 and SMTP Submission with username plus password/app-password authentication.

The DSH Profile provides `settings`, `credentials`, `tools`, `permissionPresets`, `approval`, and `fs`. The settings page also depends on official Remotes, Renderer, and Settings Client packages. Ordinary sending requires an interactive approval path; Full Access does not prompt.

## Protocol scope

- IMAP uses read-only mailbox semantics and UIDVALIDITY to reject stale UIDs.
- SMTP supports implicit TLS and STARTTLS, never plaintext.
- XOAUTH2/OIDC mailbox login is not implemented. Gmail, Microsoft 365, and similar providers work only when tenant policy permits app passwords and SMTP AUTH.
- The plugin does not append a copy to the IMAP Sent folder; server policy decides whether sent mail is retained.
- S/MIME, PGP, calendar invitations, and nested `message/rfc822` are treated as ordinary MIME data without specialized semantics.

## DSH binary-write limitation

DSH `0.1.2-alpha.2` exposes `ctx.fs.readBytes` but no `writeBytes`:

- outbound local attachments use the official seam end to end;
- downloads require `ctx.fs.processPath()` and the Host Node process to share one filesystem;
- after creating the destination directory the plugin resolves real paths and rechecks workspace containment;
- E2B, remote containers, and other non-shared Filesystem Providers should disable or expect a clear `mail_get_attachment` failure;
- migrate to the official binary-write API and remove the local adapter when one becomes available.

## Version policy

During `0.x`, a DSH alpha may change the Client Loader, settings slots, or tool schemas. For every upgrade, run the full automated suite and real IMAP/SMTP acceptance in an isolated Profile. Compilation alone is insufficient.
