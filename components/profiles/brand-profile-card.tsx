import Link from "next/link";
import { DeleteBrandProfileButton } from "@/components/profiles/delete-brand-profile-button";

type BrandProfileCardProps = {
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

function TagList({ label, values }: { label: string; values: string[] }) {
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
          <span className="text-sm text-zinc-400">Not set</span>
        )}
      </div>
    </div>
  );
}

export function BrandProfileCard({ profile }: BrandProfileCardProps) {
  return (
    <article className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal text-zinc-950">
            {profile.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            {profile.audience ?? "No audience description yet."}
          </p>
        </div>
        <p className="text-sm text-zinc-400">
          Updated {profile.updatedAt.toLocaleDateString("en-US")}
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <TagList label="Tone" values={profile.toneTags} />
        <TagList label="Forbidden" values={profile.forbiddenWords} />
        <TagList label="Required" values={profile.requiredWords} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          href={`/profiles/${profile.id}`}
        >
          Edit
        </Link>
        <DeleteBrandProfileButton
          brandName={profile.name}
          brandProfileId={profile.id}
        />
      </div>
    </article>
  );
}
