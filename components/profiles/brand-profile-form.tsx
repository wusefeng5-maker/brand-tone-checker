"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { BrandProfileActionState } from "@/app/(app)/profiles/actions";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/ui/toast";

export type BrandProfileFormValues = {
  name?: string;
  audience?: string | null;
  toneTags?: string[];
  forbiddenWords?: string[];
  requiredWords?: string[];
  exampleCopy?: string | null;
};

type BrandProfileFormProps = {
  action: (
    state: BrandProfileActionState,
    formData: FormData,
  ) => Promise<BrandProfileActionState>;
  submitLabel: string;
  initialValues?: BrandProfileFormValues;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const pendingLabel = label.toLowerCase().includes("create")
    ? "Creating..."
    : "Saving...";

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
      disabled={pending}
      type="submit"
    >
      {pending ? <Spinner /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}

function joinValues(values?: string[]) {
  return values?.join("\n") ?? "";
}

export function BrandProfileForm({
  action,
  submitLabel,
  initialValues,
}: BrandProfileFormProps) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <Toast message={state.message} tone={state.errors ? "error" : "info"} />

      <label className="block">
        <span className="text-sm font-semibold text-zinc-800">Brand name</span>
        <input
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
          defaultValue={initialValues?.name ?? ""}
          name="name"
          placeholder="Example: Duiwei AI"
          required
        />
        {state.errors?.name ? (
          <span className="mt-2 block text-sm text-red-600">
            {state.errors.name}
          </span>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-zinc-800">Audience</span>
        <textarea
          className="mt-2 min-h-24 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
          defaultValue={initialValues?.audience ?? ""}
          name="audience"
          placeholder="Describe your core customers, scenarios, and communication context"
        />
      </label>

      <div className="grid gap-5 lg:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">Tone tags</span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
            defaultValue={joinValues(initialValues?.toneTags)}
            name="toneTags"
            placeholder={"professional\nwarm\ndirect"}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">
            Forbidden words
          </span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
            defaultValue={joinValues(initialValues?.forbiddenWords)}
            name="forbiddenWords"
            placeholder={"best ever\nabsolute\ncheap"}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">
            Required words
          </span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
            defaultValue={joinValues(initialValues?.requiredWords)}
            name="requiredWords"
            placeholder={"trusted\nclear\nlong-term"}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-zinc-800">
          Example brand copy
        </span>
        <textarea
          className="mt-2 min-h-36 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
          defaultValue={initialValues?.exampleCopy ?? ""}
          name="exampleCopy"
          placeholder="Paste a sample that best represents this brand voice"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
