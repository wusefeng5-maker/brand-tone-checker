import { dictionaries, type Locale } from "@/lib/i18n/config";

export function getLandingContent(locale: Locale) {
  const { landing, nav } = dictionaries[locale];

  return {
    product: {
      name: dictionaries[locale].common.appName,
      englishName: "Duìwèi AI",
      descriptor: landing.productDescriptor,
      copyright: landing.copyright,
    },
    nav: [
      { label: nav.features, href: "#features" },
      { label: nav.pricing, href: "#pricing" },
      { label: nav.faq, href: "#faq" },
    ],
    navActions: {
      login: nav.login,
      start: nav.start,
    },
    hero: {
      titleLines: [landing.heroTitleA, landing.heroTitleB],
      subtitle: landing.heroSubtitle,
      primaryCta: landing.primaryCta,
      secondaryCta: landing.secondaryCta,
    },
    scenarios: landing.scenarios,
    scenarioIntro: {
      title: landing.scenariosTitle,
    },
    values: landing.values,
    valueIntro: {
      title: landing.valuesTitle,
    },
    workflow: landing.workflow,
    workflowIntro: {
      title: landing.workflowTitle,
      description: landing.workflowDescription,
    },
    pricing: {
      title: landing.pricingTitle,
      description: landing.pricingDescription,
      plans: landing.plans,
    },
    faq: landing.faq,
    faqIntro: {
      title: landing.faqTitle,
    },
    cta: {
      title: landing.ctaTitle,
      description: landing.ctaDescription,
      button: landing.primaryCta,
    },
    footer: {
      privacy: landing.privacy,
      contact: landing.contact,
    },
  };
}
