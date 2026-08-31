# Contributing

[简体中文](CONTRIBUTING.md) | **English**

This project optimizes for a clear mail security boundary, not tool count.

Run `npm ci` and `npm run check`. Add mailbox-independent automated tests for new behavior; cover cancellation, timeout, bounds, and error normalization for protocol changes; give every mutation an explicit capability, target boundary, and approval policy; update Chinese and English documentation together; and never commit real addresses, messages, app passwords, logs, or personal data.

Use a dedicated test mailbox for interoperability. Do not mix new product boundaries such as delete, move, auto-reply, or polling into corrective pull requests. Report vulnerabilities privately through [SECURITY.en.md](SECURITY.en.md).
