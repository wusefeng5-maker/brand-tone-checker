import { DemoMockup } from "@/components/marketing/demo-mockup";
import { Logo } from "@/components/marketing/logo";
import { SectionHeading } from "@/components/marketing/section-heading";
import { landingContent } from "@/lib/landing-content";

export function LandingPage() {
  const content = landingContent;

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-zinc-950">
      <Navigation />
      <Hero />
      <Scenarios />
      <Values />
      <Workflow />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );

  function Navigation() {
    return (
      <header className="sticky top-0 z-30 border-b border-white/70 bg-[#f6f7fb]/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            {content.nav.map((item) => (
              <a
                className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-white sm:inline-flex"
              href="#"
            >
              {content.navActions.login}
            </a>
            <a
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5"
              href="#cta"
            >
              {content.navActions.start}
            </a>
          </div>
        </nav>
      </header>
    );
  }

  function Hero() {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-6xl">
              {content.hero.titleLines[0]}
              <span className="mt-2 block bg-gradient-to-r from-[#e8443a] to-[#ff7a45] bg-clip-text text-transparent">
                {content.hero.titleLines[1]}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              {content.hero.subtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#e8443a] to-[#ff7a45] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-300/40 transition hover:-translate-y-0.5"
                href="#cta"
              >
                {content.hero.primaryCta}
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200"
                href="#demo"
              >
                {content.hero.secondaryCta}
              </a>
            </div>
          </div>
          <div id="demo">
            <DemoMockup />
          </div>
        </div>
      </section>
    );
  }

  function Scenarios() {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" id="features">
        <SectionHeading title={content.scenarioIntro.title} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.scenarios.map((scenario) => (
            <article
              className="rounded-3xl border border-white bg-white p-7 shadow-sm shadow-zinc-200/70"
              key={scenario.title}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <SmallSparkIcon />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950">{scenario.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{scenario.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function Values() {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading title={content.valueIntro.title} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.values.map((value, index) => (
            <article className="rounded-3xl bg-white p-6 shadow-sm shadow-zinc-200/70" key={value.title}>
              <div className="text-sm font-bold text-orange-600">0{index + 1}</div>
              <h3 className="mt-5 text-lg font-semibold text-zinc-950">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{value.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function Workflow() {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="rounded-[2rem] bg-zinc-950 px-6 py-12 text-white sm:px-10">
          <SectionHeading
            inverse
            title={content.workflowIntro.title}
            description={content.workflowIntro.description}
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-4">
            {content.workflow.map((step, index) => (
              <article
                className="relative rounded-3xl border border-white/10 bg-white/[0.07] p-6"
                key={step.title}
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-950">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function Pricing() {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" id="pricing">
        <SectionHeading title={content.pricing.title} description={content.pricing.description} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.pricing.plans.map((plan) => (
            <article className="rounded-3xl border border-zinc-100 bg-white p-7 shadow-sm shadow-zinc-200/70" key={plan.name}>
              <h3 className="text-lg font-semibold text-zinc-950">{plan.name}</h3>
              <p className="mt-4 text-3xl font-bold text-zinc-950">{plan.price}</p>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{plan.detail}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  function Faq() {
    return (
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8" id="faq">
        <SectionHeading title={content.faqIntro.title} />
        <div className="mt-10 divide-y divide-zinc-200 rounded-3xl bg-white px-6 shadow-sm shadow-zinc-200/70">
          {content.faq.map((item) => (
            <details className="group py-6" key={item.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-zinc-950">
                {item.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition group-open:rotate-45">
                  <PlusIcon />
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }

  function FinalCta() {
    return (
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" id="cta">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e8443a] to-[#ff7a45] px-6 py-14 text-center text-white shadow-2xl shadow-orange-200 sm:px-10">
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-normal sm:text-5xl">
            {content.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85">
            {content.cta.description}
          </p>
          <a
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-700 shadow-lg transition hover:-translate-y-0.5"
            href="#"
          >
            {content.cta.button}
          </a>
        </div>
      </section>
    );
  }

  function Footer() {
    return (
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-10 pt-4 text-sm text-zinc-500 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>{content.product.copyright}</p>
        <div className="flex flex-wrap gap-5">
          <a className="hover:text-zinc-950" href="#">
            {content.footer.privacy}
          </a>
          <span>{content.footer.contact}</span>
        </div>
      </footer>
    );
  }
}

function SmallSparkIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}
