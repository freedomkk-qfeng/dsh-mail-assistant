# dsh-mail-assistant

> npm 包：`@eduwork/dsh-mail@0.1.0`。旧无作用域包保留供迁移；安装切换与数据兼容见 [迁移说明](docs/EDUWORK-MIGRATION.md)。

**简体中文** | [English](README.en.md)

面向 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai/deepseek-harness) 的安全型邮件助手插件。它通过标准 IMAP 读取邮件、通过标准 SMTP 发送纯文本邮件，但刻意不成为另一个邮箱客户端。

当前版本：`0.1.0`。该版本按 DeepSeek Harness `0.1.2-rc.1` 的公开接口进行了兼容复核；连接重要邮箱前仍应完成组织自己的安全与合规审查。

## 定位与边界

插件只提供五个 Agent 工具：

| 工具 | 能力 | 关键约束 |
| --- | --- | --- |
| `mail_list_folders` | 列出服务器上的邮箱目录 | 只读；返回精确路径，便于查找归档和历史邮件 |
| `mail_find` | 按主题、发件人、收件人与日期分页查找邮件 | 每页最多 50 条；用不透明游标持续拉取，不搜索或执行正文指令 |
| `mail_read` | 读取一封邮件的纯文本正文和附件元数据 | IMAP `EXAMINE`/只读锁；不修改已读状态 |
| `mail_get_attachment` | 把一个附件保存到会话工作区 | 大小上限、随机文件名、不覆盖、仅工作区内 |
| `mail_send` | 发送或回复纯文本邮件，可附加工作区文件 | 普通权限逐次确认；Full Access 免确认；仍需单独开启发信能力 |

明确不做：删除、移动、归档、标签、已读/未读修改、联系人、规则、后台轮询、自动唤醒、自动回复、HTML 邮件创作和完整邮箱 UI。

## 安全默认值

- 安装后读信和发信权限都为关闭；启动时不连接邮箱。
- 密码或客户端授权码只通过 DSH Credential Provider 保存，固定引用为 `DSH_MAIL_ASSISTANT_PASSWORD`；不会进入 `settings.yaml` 或浏览器回读。
- IMAP 始终使用只读 mailbox lock，不调用 `STORE`、`COPY`、`MOVE`、`EXPUNGE`。
- 邮件正文、标题、地址和附件名全部标记为不可信外部数据；它们不能授权发信、请求密钥或改变系统规则。
- 历史检索显式返回 `hasMore` 和 `nextCursor`；需要完整覆盖时，Agent 必须持续翻页至 `hasMore=false`，不能把首屏结果误当成整个邮箱。
- 发信只接受纯文本。收件地址拒绝换行注入，附件必须是当前会话工作区内的普通文件。
- 只支持隐式 TLS 或 STARTTLS，证书校验不可关闭。
- SMTP 在 DATA 阶段断线或超时时返回 `unknown`，并明确禁止 Agent 自动重试，避免重复发信。

完整威胁模型见[安全模型](docs/security-model.md)。

## 安装

要求：Node.js 22+、DSH `0.1.2-rc.1`，且所用 Profile 已包含 Settings、Credentials、Tools、Filesystem、Permission Presets、Approval 和 Web Client 官方能力。

普通使用请固定经过复核的 npm 精确版本：

```bash
dsh plugin --profile web add @eduwork/dsh-mail@0.1.0
```

需要审计、开发或验证尚未发布的改动时，再从源码安装：

```bash
git clone https://github.com/freedomkk-qfeng/dsh-mail-assistant.git
cd dsh-mail-assistant
npm ci
npm run check
dsh plugin --profile web add .
```

从父目录也可以显式传入路径：

```bash
dsh plugin --profile web add ./dsh-mail-assistant
```

DSH 会链接本地 checkout，不会扫描当前目录；源码安装后请保留这个目录。团队部署应固定上面经复核的精确版本。

## 配置与首次验证

1. 打开 DSH 的“设置 → 邮件助手”。
2. 填写邮箱地址、客户端授权码和可选的发件人显示名称。
3. 选择邮箱服务商自动填写服务器；单位邮箱或自建邮箱使用“手动配置”。
4. 登录用户名、收件箱目录和安全上限收纳在“高级设置”中，通常无需修改。
5. 配置完成后，分别决定是否开放“允许 Agent 读信”和“允许 Agent 发信”。
6. 保存后，在对话中让 Agent“查一下最近的邮件”。插件不会在保存时主动登录邮箱。

无 UI 的部署可在 `cordis.patch.yml` 中覆盖非敏感配置，并把密码放入 DSH 凭据引用 `DSH_MAIL_ASSISTANT_PASSWORD`（本地 Credential Provider 也会按引用名读取同名环境变量）。不要把密码写进 Bundle 或 patch。

不同服务商对普通密码、应用密码和 OAuth2 的支持不同。此插件的 v0.1 只实现用户名 + 密码/授权码的标准 IMAP/SMTP 登录；强制 OAuth2 的邮箱不在当前支持范围内。

## 与 DSH 的组合关系

插件复用 DSH 原生能力，而不是 fork 客户端：

- `ctx.credentials`：保存和逐次解析授权码；
- `ctx.settings` 与 `settings.section`：配置存储和设置页；
- `ctx.tools`：工具注册、单调拒绝 guard 和统一执行管线；
- `ctx.permissionPresets` 与原生 `tools/pre-execute`：普通权限逐次确认，Full Access 免确认；
- `ctx.fs`：发送附件的工作区解析、包含性检查和有界读取；
- DSH Client Loader：动态加载设置页，不修改官方 Web 应用。

二进制写入尚未出现在 DSH `ctx.fs` seam 中，因此 `mail_get_attachment` 在本地 Host 文件系统上通过 `ctx.fs` 完成路径解析与包含性校验后，以独占写方式落盘。远程/非本地 FS Provider 可能不支持该工具；其他读信和发信能力不受影响。详见[兼容性](docs/compatibility.md)。

## 维护者发布

GitHub Actions 的 `Release package` 手动工作流默认只执行检查、打包和 SHA-256 生成。只有选中与 manifest 一致的稳定 tag 并显式勾选 `publish` 时才会发布；发布还要求同一 commit 的跨平台 CI 成功。npm Trusted Publisher 应绑定 GitHub 仓库 `freedomkk-qfeng/dsh-mail-assistant`、工作流文件 `release.yml`、Environment `npm`；工作流不使用长期 npm Token。

## 文档

- [快速接入](docs/getting-started.md)
- [架构与扩展边界](docs/architecture.md)
- [工具契约](docs/tool-contract.md)
- [安全模型](docs/security-model.md)
- [兼容性与限制](docs/compatibility.md)
- [公开发布检查表](docs/release-checklist.md)
- [贡献指南](CONTRIBUTING.md)
- [治理规则](GOVERNANCE.md)
- [支持](SUPPORT.md)
- [安全问题报告](SECURITY.md)

## 致谢与来源

本项目参考了社区插件 [`STARDUSTLC666/dsh-email`](https://github.com/STARDUSTLC666/dsh-email) 对 ImapFlow、Nodemailer、MailParser 与 DSH 的组合经验，但重新划定了能力边界，并改用 DSH Credentials、默认关闭权限、只读 IMAP、工作区附件边界、邮件不可信标记和 DSH 原生权限预设。第三方依赖与许可证见[第三方组件声明](THIRD_PARTY_NOTICES.md)。

## License

[MIT](LICENSE)
