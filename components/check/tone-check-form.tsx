"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { checkToneAction } from "@/app/(app)/check/actions";
import type { CheckToneActionState } from "@/app/(app)/check/actions";
import type { ToneCheckResult } from "@/lib/ai/types";

type BrandProfileOption = {
  id: string;
  name: string;
};

type ToneCheckFormProps = {
  brandProfiles: BrandProfileOption[];
};

function CheckButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Checking..." : "Check"}
    </button>
  );
}

function ResultList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">No issues found.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function ToneCheckResultView({ result }: { result: ToneCheckResult }) {
  return (
    <section className="mt-8 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70">
      <p className="text-sm font-semibold text-orange-600">Result</p>
      <div className="mt-4 flex items-end gap-3">
        <span className="text-5xl font-semibold tracking-normal text-zinc-950">
          {result.score}
        </span>
        <span className="pb-2 text-sm font-semibold text-zinc-400">/ 100</span>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Summary</h2>
          <p className="mt-2 text-base leading-7 text-zinc-600">{result.summary}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Problems</h2>
          <div className="mt-3">
            <ResultList items={result.problems} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Suggestions</h2>
          <div className="mt-3">
            <ResultList items={result.suggestions} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Rewrite</h2>
          <p className="mt-3 rounded-2xl bg-zinc-950 px-4 py-4 text-base leading-7 text-white">
            {result.rewrite}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ToneCheckForm({ brandProfiles }: ToneCheckFormProps) {
  const [state, formAction] = useActionState<CheckToneActionState, FormData>(
    checkToneAction,
    {},
  );
  const hasBrandProfiles = brandProfiles.length > 0;

  return (
    <>
      <form
        action={formAction}
        className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70 sm:p-8"
      >
        {state.error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {state.error}
          </div>
        ) : null}

        <div className="space-y-6">
          <label className="block">
            <span className="text-sm font-semibold text-zinc-800">
              Brand Profile
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950 disabled:bg-zinc-50 disabled:text-zinc-400"
              disabled={!hasBrandProfiles}
              name="brandProfileId"
            >
              {hasBrandProfiles ? (
                brandProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))
              ) : (
                <option value="">Create a brand profile first</option>
              )}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-zinc-800">
              Copy to check
            </span>
            <textarea
              className="mt-2 min-h-56 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
              name="inputText"
              placeholder="Paste the copy you want to check against this brand profile."
            />
          </label>
        </div>

        <div className="mt-6">
          <CheckButton />
        </div>
      </form>

      {state.result ? <ToneCheckResultView result={state.result} /> : null}
    </>
  );
}
