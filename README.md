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

## 本地运行（可选）

```bash
npm install
npm start
```

无数据库/真实密钥依赖；多数路由是演示用假实现。

## 注意

- `feat/ai-review-demo` 中的缺陷是**故意植入**的，请勿合并到生产环境。
- 请勿把真实密钥写进本仓库；示例密钥均为明显假值。
