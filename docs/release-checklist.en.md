# Public release checklist

[简体中文](release-checklist.md) | **English**

A release pull request records reviewers, date, command-output links, and exceptions. Every item blocks a stable release; an alpha release must complete all applicable items and state remaining risk.

## Authority and metadata

- [ ] Repository owner approved public release and the MIT license.
- [ ] GitHub repository, npm name, homepage, issues, and private security-report URLs are correct.
- [ ] Version, changelog, compatibility, and install commands agree.
- [ ] Chinese is the default language and every Markdown document has an English mirror with reciprocal entries.
- [ ] Publishable history and content contain no real accounts, messages, app passwords, servers, personal paths, or unauthorized branding.

## Mail and authorization boundary

- [ ] IMAP mailbox locks remain read-only; no `STORE`, `COPY`, `MOVE`, `EXPUNGE`, or flag mutation exists.
- [ ] Reading and sending default off and remain independent.
- [ ] `mail_send` enters DSH permission handling before credentials, attachments, or SMTP access.
- [ ] Ordinary permissions ask per call; Full Access only skips that prompt and never enables sending.
- [ ] Missing Agent sessions, rejection, cancellation, and unavailable approval channels fail closed.
- [ ] Mail remains untrusted data and cannot authorize sending, request secrets, or change system policy.
- [ ] Ambiguous SMTP DATA results return `unknown` and are never automatically retried.

## Credentials, transport, and attachments

- [ ] App passwords only enter a DSH Credential Provider; the browser sees configuration state only.
- [ ] Credentials are resolved for every call and not cached across operations.
- [ ] Only implicit TLS or STARTTLS is accepted; certificate validation is fixed on and protocol logging is off.
- [ ] Addresses reject CR/LF injection and body, message, and attachment limits are enforced.
- [ ] Outbound attachments are regular files inside the current session workspace.
- [ ] Downloaded attachments use random names, exclusive writes, and real-path containment; symlink/junction escape checks pass.
- [ ] Source maps and normalized errors expose no credentials, message content, server responses, or personal paths.

## Functional acceptance

- [ ] `mail_list_folders` returns server folders without mutation.
- [ ] `mail_find` covers both directions, pagination, dates, folders, stale UIDVALIDITY, and `hasMore=false`.
- [ ] `mail_read` preserves unread state; truncation and HTML fallback match documentation.
- [ ] `mail_get_attachment` works on local FS and fails clearly for a remote/non-shared Host path.
- [ ] A real test mailbox covers ordinary approve/reject, Full Access send, and outside-workspace attachment rejection.
- [ ] OAuth2, multiple accounts, Sent-copy behavior, and complex MIME limitations remain explicit.

## Supply chain and publication

- [ ] Clean `npm ci` and `npm run check` pass on Windows and Linux with Node 22/24.
- [ ] `npm audit`, CodeQL, direct/transitive licenses, and install scripts receive human review.
- [ ] GitHub Actions use immutable commits; Dependabot and branch protection are active.
- [ ] `npm pack --dry-run` and the extracted tarball contain only expected files; the Host bundle has no bare IMAP/SMTP imports.
- [ ] Tag, release notes, tarball checksum, deprecation, and rollback are ready.
- [ ] The npm package trusts this repository's `.github/workflows/release.yml` with environment `npm`; stable publication uses OIDC and provenance rather than a long-lived token.
