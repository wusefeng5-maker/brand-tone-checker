"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { checkToneAction } from "@/app/(app)/check/actions";
import type { CheckToneActionState } from "@/app/(app)/check/actions";
import { ToneCheckResultView } from "@/components/check/tone-check-result";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/ui/toast";

type BrandProfileOption = {
  id: string;
  name: string;
};

type ToneCheckFormProps = {
  brandProfiles: BrandProfileOption[];
};

function CheckButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
      disabled={isDisabled}
      type="submit"
    >
      {pending ? <Spinner /> : null}
      {pending ? "Checking..." : "Check"}
    </button>
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
        <Toast message={state.error} tone="error" />
        <Toast
          message={state.result ? "Tone check completed." : undefined}
          tone="success"
        />

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
              className="mt-2 min-h-56 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950 disabled:bg-zinc-50 disabled:text-zinc-400"
              disabled={!hasBrandProfiles}
              name="inputText"
              placeholder="Paste the copy you want to check against this brand profile."
              required={hasBrandProfiles}
            />
          </label>
        </div>

        <div className="mt-6">
          <CheckButton disabled={!hasBrandProfiles} />
          {!hasBrandProfiles ? (
            <p className="mt-3 text-sm text-zinc-500">
              Create a brand profile before running your first tone check.
            </p>
          ) : null}
        </div>
      </form>

      {state.result ? (
        <div className="mt-8">
          <ToneCheckResultView result={state.result} />
          {state.checkId ? (
            <Link
              className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              href={`/checks/${state.checkId}`}
            >
              View saved report
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
