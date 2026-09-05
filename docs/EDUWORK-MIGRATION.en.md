# eduwork npm scope migration

[简体中文](EDUWORK-MIGRATION.md) | **English**

Starting with this version, the stable npm installation is `@eduwork/dsh-mail@0.1.0`, replacing `dsh-mail-assistant`. The npm `eduwork` organization exists. The GitHub repository and checkout directory remain `dsh-mail-assistant`. Consult the npm registry for current publication status.

## Installation and migration

```sh
dsh plugin --profile web add @eduwork/dsh-mail@0.1.0
```

Back up an existing Profile's package.json and cordis.patch.yml, then update its dependency and dsh.profile.bundles entries. Update module name paths in custom patches too. Do not enable both package identities together; restart the Host after switching. These are separate npm packages, so updating the old package cannot migrate an installation automatically.

## Data compatibility

Keep the Host export name, row id, settings namespace and security scope using `dsh-mail-assistant`, as well as `DSH_MAIL_ASSISTANT_PASSWORD` and `.dsh-mail-assistant/attachments`. The Client ModuleLoader uses the new package name.

Storage directories and user configuration content do not change. Product-managed Profiles migrate their owned dependencies through the product upgrader; community plugins remain unchanged.

## Release scope

This is the first stable package version reviewed for DSH `0.1.2-rc.1`. Build, tests, documentation, licensing, no-network mail-flow simulation, and tarball checks cover this change. It does not claim real institutional sign-in or real email delivery. Previous packages remain installable with their migration notice and are not withdrawn.
