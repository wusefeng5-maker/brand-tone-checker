import Link from "next/link";
import { DeleteBrandProfileButton } from "@/components/profiles/delete-brand-profile-button";
import { formatDateTime, type Dictionary, type Locale } from "@/lib/i18n/config";

type BrandProfileCardProps = {
  labels: Dictionary;
  locale: Locale;
  profile: {
    id: string;
    name: string;
    audience: string | null;
    toneTags: string[];
    forbiddenWords: string[];
    requiredWords: string[];
    updatedAt: Date;
  };
};

function TagList({
  emptyLabel,
  label,
  values,
}: {
  emptyLabel: string;
  label: string;
  values: string[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-normal text-zinc-400">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) => (
            <span
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700"
              key={value}
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-sm text-zinc-400">{emptyLabel}</span>
        )}
      </div>
    </div>
  );
}

export function BrandProfileCard({
  labels,
  locale,
  profile,
}: BrandProfileCardProps) {
  const isZh = locale === "zh";

  return (
    <article className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">
            {profile.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            {profile.audience ??
              (isZh ? "暂无受众描述。" : "No audience description yet.")}
          </p>
        </div>
        <p className="text-sm text-zinc-400">
          {isZh ? "更新于" : "Updated"} {formatDateTime(profile.updatedAt, locale)}
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <TagList
          emptyLabel={isZh ? "未设置" : "Not set"}
          label={isZh ? "语调" : "Tone"}
          values={profile.toneTags}
        />
        <TagList
          emptyLabel={isZh ? "未设置" : "Not set"}
          label={isZh ? "禁用" : "Forbidden"}
          values={profile.forbiddenWords}
        />
        <TagList
          emptyLabel={isZh ? "未设置" : "Not set"}
          label={isZh ? "必用" : "Required"}
          values={profile.requiredWords}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          href={`/profiles/${profile.id}`}
        >
          {labels.common.edit}
        </Link>
        <DeleteBrandProfileButton
          brandName={profile.name}
          brandProfileId={profile.id}
          labels={labels.common}
        />
      </div>
    </article>
  );
}
