import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../lib/index.js', import.meta.url), 'utf8')
for (const specifier of ['imapflow', 'mailparser', 'nodemailer', 'schemastery']) {
  const bareImport = new RegExp(`(?:from\\s*|import\\s*\\()(['\"])${specifier}(?:/[^'\"]*)?\\1`)
  if (bareImport.test(source)) {
    throw new Error(`Host bundle still depends on external runtime package: ${specifier}`)
  }
}

const module = await import(new URL(`../lib/index.js?bundle-check=${Date.now()}`, import.meta.url))
if (module.name !== 'dsh-mail-assistant' || typeof module.apply !== 'function') {
  throw new Error('Host bundle does not expose the DSH plugin contract.')
}
