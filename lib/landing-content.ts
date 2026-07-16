export const landingContent = {
  product: {
    name: "对味",
    englishName: "Duìwèi AI",
    descriptor: "品牌语调一致性检查",
    copyright: "© 2026 对味 Duìwèi AI. All rights reserved.",
  },
  nav: [
    { label: "功能", href: "#features" },
    { label: "定价", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  navActions: {
    login: "登录",
    start: "免费体验",
  },
  hero: {
    titleLines: ["每条文案发出去前，先问一句：", "「这像我们的品牌吗？」"],
    subtitle:
      "粘贴一段文案，30 秒测出它和你们品牌语调差多远，并直接给你能发的改写稿。",
    primaryCta: "免费体验",
    secondaryCta: "查看演示",
  },
  demo: {
    title: "静态演示",
    status: "已对味",
    brandProfile: "品牌档案：新消费茶饮",
    input:
      "本周新品上线，喜欢的朋友赶紧下单，错过就没了。",
    scoreBefore: "62",
    scoreAfter: "92",
    issues: ["活泼度不够", "缺少品牌口头禅", "促销感偏强"],
    rewrite:
      "咱家的本周新品来啦。清爽、轻甜、刚刚好，适合把今天过成一点点小假期。",
    issuesTitle: "发现的问题",
    rewriteTitle: "建议改写",
    scoreLabels: {
      before: "检查前",
      after: "改写后",
    },
  },
  scenarios: [
    {
      title: "代运营",
      description:
        "同时服务多个品牌客户，交付前先统一检查语调，减少来回改稿。",
    },
    {
      title: "品牌运营",
      description:
        "小团队也能沉淀品牌表达标准，新人写稿不再全靠感觉。",
    },
    {
      title: "跨境品牌",
      description:
        "中英文内容保持同一个品牌性格，避免翻译后语气走偏。",
    },
  ],
  scenarioIntro: {
    title: "三类团队，最容易先用起来",
  },
  values: [
    {
      title: "把感觉变成标准",
      description: "一次设置品牌档案，以后每条文案都按同一把尺子检查。",
    },
    {
      title: "发布前拦截串味",
      description: "在内容发出去之前发现禁忌词、语气偏差和表达风险。",
    },
    {
      title: "直接拿到改写稿",
      description: "不只指出问题，还给出更接近品牌语调的完整版本。",
    },
    {
      title: "轻量即开即用",
      description: "面向小团队和代运营场景，不需要复杂部署和培训。",
    },
  ],
  valueIntro: {
    title: "把品牌语调检查，变成发布前的固定动作",
  },
  workflow: [
    {
      title: "品牌档案",
      description: "录入受众、语调标签、禁忌词、必要词和示例文案。",
    },
    {
      title: "粘贴文案",
      description: "放入小红书、公众号、邮件或广告文案。",
    },
    {
      title: "AI 检查",
      description: "按品牌规范输出分数、问题和标签命中情况。",
    },
    {
      title: "获得报告",
      description: "查看逐段建议，复制可直接发布的改写稿。",
    },
  ],
  workflowIntro: {
    title: "四步完成一次对味检查",
    description: "从品牌档案到完整报告，不需要复杂配置。",
  },
  pricing: {
    title: "先免费体验，再决定是否升级",
    description:
      "MVP 阶段优先验证核心检查价值，支付能力后续接入。当前页面仅展示产品定价方向。",
    plans: [
      {
        name: "Free",
        price: "¥0",
        detail: "每日免费检查额度，适合先体验。",
      },
      {
        name: "Pro",
        price: "¥19/月起",
        detail: "面向个人品牌和小团队，支持更多档案与检查。",
      },
      {
        name: "Agency",
        price: "后续开放",
        detail: "面向代运营团队，预留多品牌和团队协作。",
      },
    ],
  },
  faq: [
    {
      question: "和通用 AI 润色工具有什么区别？",
      answer:
        "通用 AI 主要帮你把文案写顺。对味会根据你的品牌档案检查语调、禁忌词、必要词和示例风格，判断这段内容是否像你的品牌。",
    },
    {
      question: "文案安全吗？",
      answer:
        "MVP 设计目标是仅用于本次检查和用户历史记录展示，不作为训练数据对外公开。具体数据策略会在后续产品页中明确说明。",
    },
    {
      question: "需要先准备完整品牌手册吗？",
      answer:
        "不需要。你可以先用几个语调标签、禁忌词和一段示例文案开始，后续再逐步完善品牌档案。",
    },
    {
      question: "适合哪些内容渠道？",
      answer:
        "适合小红书、公众号、朋友圈、邮件、广告短文案、官网介绍和跨境商品描述等发布前检查场景。",
    },
  ],
  faqIntro: {
    title: "FAQ",
  },
  cta: {
    title: "下一条文案发布前，先看看它对不对味。",
    description: "从一条免费体验开始，把品牌语调检查变成发布前的固定动作。",
    button: "立即免费体验",
  },
  footer: {
    privacy: "隐私政策",
    contact: "联系方式：hello@duiwei.ai",
  },
} as const;
