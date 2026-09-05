# 公开发布检查表

**简体中文** | [English](release-checklist.en.md)

发布 Pull Request 应记录审查人、日期、命令输出链接和例外。任何未完成项目都会阻止稳定发布；alpha 发布也必须完成与本次改动相关的项目并明确剩余风险。

## 授权与元数据

- [ ] 仓库所有者确认公开发布和 MIT 许可证。
- [ ] GitHub 仓库、npm 包名、主页、Issue 和安全报告地址准确。
- [ ] 版本、Changelog、兼容性和安装命令一致。
- [ ] 默认文档为中文，每份 Markdown 文档都有英文镜像和双向入口。
- [ ] Git 历史和发布内容不含真实邮箱、邮件、授权码、服务器、个人路径或未授权品牌。

## 邮件与权限边界

- [ ] IMAP mailbox lock 仍固定为只读，代码没有 `STORE`、`COPY`、`MOVE`、`EXPUNGE` 或 flags 写入。
- [ ] 读信和发信能力默认关闭，并且彼此独立。
- [ ] `mail_send` 在读取凭据、附件和访问 SMTP 前进入 DSH 权限通路。
- [ ] 普通权限逐次审批；Full Access 只免除逐次弹窗，不能自动开启发信能力。
- [ ] 无 Agent 会话、拒绝、取消和不可用审批通路均失败关闭。
- [ ] 邮件数据持续标记为不可信，不能成为发信授权、密钥请求或系统指令。
- [ ] SMTP DATA 阶段的不确定结果返回 `unknown`，不会自动重试。

## 凭据、传输和附件

- [ ] 授权码只进入 DSH Credential Provider，浏览器只能看到配置状态。
- [ ] 每次工具调用重新解析凭据，不跨操作缓存。
- [ ] 只允许隐式 TLS 或 STARTTLS，证书校验不可关闭，协议日志关闭。
- [ ] 地址拒绝 CR/LF 注入；正文、消息和附件大小上限有效。
- [ ] 发送附件限定为当前会话工作区普通文件。
- [ ] 下载附件使用随机名、独占写和真实路径包含性复核；符号链接/目录联接逃逸测试通过。
- [ ] Source map 和错误归一化不泄露凭据、邮件内容、服务器响应或个人路径。

## 功能验收

- [ ] `mail_list_folders` 返回真实目录且不修改状态。
- [ ] `mail_find` 的正序/倒序、多页、日期、目录、UIDVALIDITY 失效和 `hasMore=false` 均测试。
- [ ] `mail_read` 不改变已读状态，正文截断和 HTML 降级符合文档。
- [ ] `mail_get_attachment` 在本地 FS 成功，在远程/不共享 Host 路径时明确失败。
- [ ] 普通权限下发信批准/拒绝、Full Access 发信、工作区外附件拒绝均通过真实测试邮箱验收。
- [ ] 不支持的 OAuth2、多账号、Sent 副本和复杂 MIME 行为仍清楚记录。

## 供应链与发布

- [ ] Windows 与 Linux 使用 Node 22/24 完成干净 `npm ci` 和 `npm run check`。
- [ ] `npm audit`、CodeQL、直接/间接许可证和安装脚本已人工审查。
- [ ] GitHub Actions 固定到不可变 commit，Dependabot 与分支保护有效。
- [ ] `npm pack --dry-run` 和解压后的 tarball 只包含预期文件；Host bundle 没有外部 IMAP/SMTP 裸导入。
- [ ] tag、发布说明、tarball checksum、弃用和回滚方案已准备。
- [ ] npm 包已绑定本仓库的 `.github/workflows/release.yml` Trusted Publisher，Environment 填 `npm`；稳定发布使用 OIDC 和 provenance，不使用长期 Token。
