# 兼容性与已知限制

**简体中文** | [English](compatibility.en.md)

## 已验证基线

- DeepSeek Harness `0.1.2-alpha.2`；
- Node.js 22+；
- Web Client 动态 Bundle；
- 本地 Host 文件系统；
- IMAP4rev1/IMAP4rev2 服务器与 SMTP Submission 服务的用户名 + 密码/应用密码认证。

插件依赖 DSH Profile 提供 `settings`、`credentials`、`tools`、`permissionPresets`、`approval` 和 `fs`。设置页还依赖官方 Web Client 的 Remotes、Renderer 与 Settings 插槽；普通权限下发信需要交互式审批通路，Full Access 下不会弹出审批。

## 协议范围

- IMAP 遵循只读 mailbox 语义，并用 UIDVALIDITY 防止陈旧 UID 误读。
- SMTP 支持隐式 TLS 和 STARTTLS，不支持明文连接。
- 当前不实现 XOAUTH2/OIDC 邮箱登录。Gmail、Microsoft 365 等是否可用取决于租户是否仍允许应用密码或相应 SMTP AUTH。
- 不向 IMAP Sent folder 追加副本；是否保存“已发送”由 SMTP 服务端策略决定。
- 复杂 S/MIME、PGP、日历邀请和嵌套 `message/rfc822` 只作为普通 MIME 数据处理，不承诺专用语义。

## DSH 二进制写限制

`ctx.fs` 在 `0.1.2-alpha.2` 提供 `readBytes`，没有 `writeBytes`。因此：

- 发送本地附件可完整复用官方 seam；
- 下载附件只能在 `ctx.fs.processPath()` 与 Host Node 进程指向同一文件系统时工作；插件会在创建目录后解析真实路径并再次验证工作区包含关系；
- E2B、远程容器或其他不共享 Host 路径的 FS Provider 应禁用或预期 `mail_get_attachment` 明确失败；
- 官方增加二进制写 API 后，本插件应优先迁移并删除本地写适配。

## 版本策略

在 `0.x` 阶段，DSH alpha 的 Client Loader、settings slots 或 tool schema 变化可能要求插件同步更新。每次升级先运行 `npm run check`，再在隔离 Profile 中完成真实 IMAP/SMTP 验收，不应只依赖编译通过。
