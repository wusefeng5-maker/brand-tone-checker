# Development

## 本地开发目标

本项目是 Brand Tone Checker 的 SaaS MVP。日常开发应保持当前业务边界清晰：页面负责交互，server actions 负责提交和持久化，`lib/` 负责可测试的业务逻辑，AI 调用通过 provider adapter 进入。

## 推荐环境

- Node.js 22.x。
- pnpm。
- PostgreSQL。
- 可用的 Clerk 本地开发配置。
- 可用的 OpenAI-compatible API 配置。

## 初始化

安装依赖：

```bash
pnpm install
```

复制环境变量：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

生成 Prisma Client：

```bash
pnpm prisma:generate
```

运行迁移：

```bash
pnpm prisma:migrate
```

启动开发服务：

```bash
pnpm dev
```

## 常用脚本

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务。 |
| `pnpm build` | 运行生产构建。 |
| `pnpm start` | 启动生产构建后的服务。 |
| `pnpm lint` | 运行 ESLint。 |
| `pnpm test` | 运行全部测试。 |
| `pnpm prisma:generate` | 生成 Prisma Client。 |
| `pnpm prisma:migrate` | 执行本地 Prisma 迁移。 |

## 测试结构

测试使用 Node.js built-in test runner。当前测试脚本包括：

- `test:admin`：管理员邮箱规则。
- `test:brand-profiles`：品牌档案表单和限制规则。
- `test:brand-brain`：Brand Brain 草稿生成结构。
- `test:check-history`：历史结果读写结构。
- `test:prompt`：Prompt builder。
- `test:rule-engine`：确定性规则引擎。
- `test:tone-check`：Tone Check 结果解析、分数和结论。

运行全部测试：

```bash
pnpm test
```

## 开发约定

- 不在页面组件里直接拼接 Prompt。
- 不在业务页面里直接调用模型 API。
- 新的 AI provider 应通过 `lib/ai/` 的 provider 边界接入。
- 可测试的业务规则应优先放在 `lib/`。
- 涉及历史展示结构时，优先通过 `lib/check-history.ts` 做兼容读取。
- 涉及 Brand Profile 表单字段时，优先复用 `lib/brand-profile-rules.ts`。
- 变更 Prisma schema 前，应同步迁移、测试和部署说明。

## UI 和产品边界

当前核心页面包括：

- Marketing landing page。
- Dashboard。
- Brand Profiles。
- Brand Brain draft builder。
- Tone Check form 和 result。
- Check History list/detail。
- Read-only Admin。

添加展示或文档时，可以引用这些页面；添加业务功能时，应先确认是否属于当前里程碑范围。

## Pull Request 前检查

提交前建议运行：

```bash
pnpm lint
pnpm build
pnpm test
```

如果改动涉及数据库，还应确认 Prisma Client 和迁移状态；如果改动涉及 AI 或 Prompt，还应补充结构化结果解析和失败路径测试。
