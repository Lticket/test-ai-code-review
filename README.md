# test-ai-code-review

本仓库是 **harness-flow** 对接阿里云 **open-code-review（OCR）AI 初审** 的联调 fixture，不是生产代码。

## 用途

harness-flow 会从 GitHub 克隆本仓库，并在 tracking 分支相对 default 分支的 diff 上执行：

```bash
ocr review --from <baseSha> --to <headSha>
```

因此仓库刻意保留：

1. `main`：相对干净的 TypeScript/Node 脚手架基线
2. `feat/ai-review-demo`：相对 `main` 含有一批可被静态/AI 审查发现的安全问题（仅用于联调）

## harness-flow 绑定建议

| 字段 | 值 |
|------|-----|
| project / repo | `Lticket/test-ai-code-review` |
| defaultBranch | `main` |
| trackingBranch | `feat/ai-review-demo` |

远程地址：`https://github.com/Lticket/test-ai-code-review.git`

## 本分支（feat/ai-review-demo）故意植入的问题主题

- SQL 字符串拼接注入
- 硬编码 API Key / 密码（明显假值）
- 未转义 HTML 导致的 XSS
- 敏感路由缺少鉴权 / 越权
- 库存预留 TOCTOU 竞态
- 文件下载路径穿越
- MD5 密码哈希
- 日志输出 PII / 敏感上下文

另保留部分干净 helper，避免 diff 全是噪音。

## 本地运行（可选）

```bash
npm install
npm start
```

## 注意

- 缺陷仅用于 OCR / harness-flow 联调，请勿当作最佳实践，也请勿合并进真实业务。
- 请勿写入真实密钥。
