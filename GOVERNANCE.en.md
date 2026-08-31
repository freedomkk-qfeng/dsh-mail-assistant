# Governance

[简体中文](GOVERNANCE.md) | **English**

## Project ownership

`dsh-mail-assistant` is initiated and hosted by [@freedomkk-qfeng](https://github.com/freedomkk-qfeng). It remains provider- and institution-neutral: public code must not embed private servers, accounts, branding, or message samples.

## Roles and decisions

- **Maintainers** merge normal changes, triage issues, and manage DSH and protocol compatibility.
- **Security maintainers** review credentials, read-only IMAP, SMTP sending, attachment paths, and supply-chain changes, and handle private reports.
- **Release managers** control protected tags, npm publishing, provenance, deprecation, and rollback.

The roster is in [Maintainers](MAINTAINERS.en.md). Ordinary decisions use pull requests. Capability boundaries, trust models, dependency strategy, and incompatible changes require a record under `docs/decisions/`. Unresolved credential disclosure, unauthorized sending, message mutation, or workspace escape blocks a release.

## Review and merge

- Documentation, tests, and UI changes that do not alter a security boundary require at least one approval.
- Credential, send-authorization, IMAP mutation, attachment-path, workflow, dependency, and release changes require two approvals. If an early-stage project cannot meet that threshold, the maintainer records independent verification evidence and remaining risk in the PR.
- Authors should not be the only approver of security-sensitive work.
- The public repository should enable CI, CodeQL, branch protection, and Private Vulnerability Reporting.

## Releases

Release managers create tags and npm releases only after the [public release checklist](docs/release-checklist.en.md). The stable process uses npm Trusted Publishing/OIDC and provenance rather than a long-lived publish token. Unsafe releases are deprecated and users are notified under the [security policy](SECURITY.en.md).

## Product boundary

The project assists with reading and explicit sending; it is not a mail client. Delete, move, archive, flag mutation, background polling, auto-reply, and scheduled sending are separate high-risk boundaries that require their own design and review.
