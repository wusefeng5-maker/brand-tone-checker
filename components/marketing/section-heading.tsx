export function SectionHeading({
  eyebrow,
  title,
  description,
  inverse = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  inverse?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold text-orange-600">{eyebrow}</p>
      ) : null}
      <h2
        className={`mt-3 text-3xl font-semibold tracking-normal sm:text-4xl ${
          inverse ? "text-white" : "text-zinc-950"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-7 ${inverse ? "text-zinc-300" : "text-zinc-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
