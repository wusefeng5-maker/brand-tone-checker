# Deployment

## 部署目标

Brand Tone Checker 是 Vercel-ready 的 Next.js 应用，生产环境需要配置 PostgreSQL、Clerk 和 OpenAI-compatible AI provider。

## 前置条件

- Node.js 22.x。
- pnpm。
- 可访问的 PostgreSQL 数据库。
- Clerk application。
- OpenAI-compatible API key 和 model。
- 生产环境变量已配置在部署平台中。

## 环境变量

生产环境至少需要配置：

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXT_PUBLIC_APP_URL="https://your-production-domain.com"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/dashboard"

ADMIN_EMAILS="admin@example.com"

AI_PROVIDER="openai-compatible"
OPENAI_COMPATIBLE_BASE_URL="https://api.openai.com/v1"
OPENAI_COMPATIBLE_API_KEY=""
OPENAI_COMPATIBLE_MODEL="gpt-5.5"
```

说明：

- `DATABASE_URL` 用于 Prisma 连接数据库。
- `DIRECT_URL` 用于需要直连数据库的迁移或托管数据库场景。
- `NEXT_PUBLIC_APP_URL` 应指向正式域名。
- `ADMIN_EMAILS` 使用逗号分隔多个管理员邮箱。
- 所有 secret 只配置在部署平台，不写入仓库。

## 数据库迁移

生产发布前应确认迁移已经在目标数据库上执行。

本地或 CI 场景常用：

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

生产环境建议使用受控部署流程执行迁移，并在迁移前确认数据库备份策略。

## Vercel 部署流程

1. 在 Vercel 创建项目并连接仓库。
2. 配置 Node.js 版本为 22.x。
3. 配置 pnpm，并使用锁文件安装依赖。
4. 在 Vercel Environment Variables 中填入所有必需变量。
5. 确认 PostgreSQL 数据库可从 Vercel 访问。
6. 在发布流程中执行 Prisma Client 生成。
7. 部署 Next.js 应用。
8. 发布后检查关键页面和核心流程。

## 发布前检查

在发布前运行：

```bash
pnpm lint
pnpm build
pnpm test
```

## 发布后冒烟测试

建议至少检查：

- `/` 营销官网可访问。
- `/sign-in` 和 `/sign-up` 可访问并连接 Clerk。
- 登录后可访问 `/dashboard`。
- 可进入 `/profiles` 并创建 Brand Profile。
- 可进入 `/check` 并看到 Tone Check 表单。
- 提交质检后可生成并保存报告。
- `/checks` 可看到历史记录。
- 管理员邮箱可访问 `/admin`。
- 非管理员无法访问 `/admin`。

## 运维注意事项

- 不要在日志中输出完整 Prompt、用户密钥或数据库连接串。
- AI 调用失败会写入 `AiCallLog`，后台可用于基础排查。
- 当前 Admin 是只读后台，不承担运营配置写入。
- 当前应用未实现支付闭环，生产收费策略需要另行补齐。
- 数据保留、删除和隐私策略应在正式上线前明确。
