import { readFile } from 'node:fs/promises'

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'))
const expectedDsh = '0.1.2-rc.1'
const dshPeers = [
  '@deepseek-ai/dsh-api-remotes',
  '@deepseek-ai/dsh-client-ui-renderer',
  '@deepseek-ai/dsh-client-ui-settings',
  '@deepseek-ai/dsh-credentials',
  '@deepseek-ai/dsh-permission-presets',
  '@deepseek-ai/dsh-tools',
]

if (manifest.name !== '@eduwork/dsh-mail' || manifest.version !== '0.1.0') {
  throw new Error(`Expected stable package @eduwork/dsh-mail@0.1.0, got ${manifest.name}@${manifest.version}`)
}
for (const name of dshPeers) {
  if (manifest.peerDependencies?.[name] !== expectedDsh) {
    throw new Error(`Expected ${name} peer ${expectedDsh}, got ${manifest.peerDependencies?.[name] ?? '<missing>'}`)
  }
}
if (manifest.peerDependencies?.['@deepseek-ai/cordis'] !== '4.0.2') {
  throw new Error('Expected @deepseek-ai/cordis peer 4.0.2')
}
const lockRoot = lock.packages?.['']
if (lockRoot?.name !== manifest.name || lockRoot?.version !== manifest.version) {
  throw new Error('package-lock root identity does not match package.json')
}
for (const name of dshPeers) {
  if (lockRoot.peerDependencies?.[name] !== expectedDsh) {
    throw new Error(`package-lock does not pin ${name} to ${expectedDsh}`)
  }
}
const lockText = JSON.stringify(lock)
if (/0\.1\.2-(?:alpha|dev)\./.test(lockText)) {
  throw new Error('package-lock mixes an alpha/dev DSH runtime into the rc.1 baseline')
}

const [hostSource, clientSource, constantsSource, workspaceSource, patchSource] = await Promise.all([
  readFile(new URL('../src/host/index.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/client/index.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/host/constants.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/host/workspace-files.js', import.meta.url), 'utf8'),
  readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8'),
])
const requiredContracts = [
  ['Host export name', hostSource, /export const name = ['"]dsh-mail-assistant['"]/],
  ['settings namespace', constantsSource, /SETTINGS_NAMESPACE = ['"]dsh-mail-assistant['"]/],
  ['credential ref', constantsSource, /DSH_MAIL_ASSISTANT_PASSWORD/],
  ['security scope name', hostSource, /name:\s*['"]dsh-mail-assistant:security['"]/],
  ['attachment directory', workspaceSource, /\.dsh-mail-assistant\/attachments/],
  ['Client settings scope', clientSource, /settingsScope\.bind\(\{ namespace: NS \}\)/],
  ['Profile row id', patchSource, /id:\s*dsh-mail-assistant/],
]
for (const [label, source, pattern] of requiredContracts) {
  if (!pattern.test(source)) throw new Error(`${label} changed or disappeared`)
}
if (!/readEnabled:\s*false/.test(constantsSource) || !/sendEnabled:\s*false/.test(constantsSource)) {
  throw new Error('Mail read/send defaults must remain disabled')
}

console.log('Stable package identity and exact DSH 0.1.2-rc.1 compatibility contract verified.')
