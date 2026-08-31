# 变更日志

**简体中文** | [English](CHANGELOG.en.md)

## 0.1.0-alpha.4 - 2026-09-01

- 首个公开 npm 预览版。
- 仓库元数据、安装入口、默认中文与英文镜像文档更新为公开地址。
- 增加 GitHub CI、CodeQL、Dependabot、Issue/PR 模板、治理规则和公开发布检查表。
- 新增依赖许可证、文档镜像、链接、敏感信息和 npm 包内容检查。
- Host bundle 内嵌 IMAP/SMTP 运行库，发布包不再要求终端用户重复安装这些依赖。
- 下载附件在本地写入前重新验证真实路径，拒绝由符号链接或目录联接造成的工作区逃逸。

## 0.1.0-alpha.3 - 2026-08-31

- 兼容基线更新到 DeepSeek Harness `0.1.2-alpha.2` 和 `@deepseek-ai/cordis` `4.0.2`。
- `mail_send` 接入 DSH 原生权限预设：普通权限逐次确认，Full Access 在发信能力已单独开启时免确认。
- 增加只读 `mail_list_folders`，允许发现归档目录和服务商自定义目录。
- 增加稳定的 `mail_find` 游标分页、正序/倒序以及 `matched`、`returned`、`hasMore`、`nextCursor`。
- 增加有限且不泄露服务端诊断的 IMAP 错误归一化。

## 0.1.0-alpha.2 - 2026-08-30

- 设置流程调整为邮箱账号、服务器、高级选项和 Agent 权限四部分。
- 保持 alpha.1 的设置 Schema 和 Credential Ref 兼容。

## 0.1.0-alpha.1 - 2026-08-29

- 首个内部预览版。
- 提供 `mail_find`、`mail_read`、`mail_get_attachment` 和 `mail_send`。
- 默认只读 IMAP、DSH Credential 存储、独立读/发开关、工作区附件限制和邮件不可信数据标记。
