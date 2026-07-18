"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { BrandProfileActionState } from "@/app/(app)/profiles/actions";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/ui/toast";
import type { Dictionary } from "@/lib/i18n/config";

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
  labels: Dictionary["common"];
};

function SubmitButton({
  label,
  labels,
}: {
  label: string;
  labels: Dictionary["common"];
}) {
  const { pending } = useFormStatus();
  const pendingLabel = label.toLowerCase().includes("create")
    ? labels.creating
    : labels.saving;

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
  labels,
  submitLabel,
  initialValues,
}: BrandProfileFormProps) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <Toast message={state.message} tone={state.errors ? "error" : "info"} />

      <label className="block">
        <span className="text-sm font-semibold text-zinc-800">
          {labels.appName === "对味" ? "品牌名称" : "Brand name"}
        </span>
        <input
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
          defaultValue={initialValues?.name ?? ""}
          name="name"
          placeholder={labels.appName === "对味" ? "例如：对味 AI" : "Example: Duiwei AI"}
          required
        />
        {state.errors?.name ? (
          <span className="mt-2 block text-sm text-red-600">
            {state.errors.name}
          </span>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-zinc-800">
          {labels.appName === "对味" ? "受众" : "Audience"}
        </span>
        <textarea
          className="mt-2 min-h-24 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
          defaultValue={initialValues?.audience ?? ""}
          name="audience"
          placeholder={
            labels.appName === "对味"
              ? "描述核心客户、使用场景和沟通语境"
              : "Describe your core customers, scenarios, and communication context"
          }
        />
      </label>

      <div className="grid gap-5 lg:grid-cols-3">
        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">
            {labels.appName === "对味" ? "语调标签" : "Tone tags"}
          </span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
            defaultValue={joinValues(initialValues?.toneTags)}
            name="toneTags"
            placeholder={"professional\nwarm\ndirect"}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">
            {labels.appName === "对味" ? "禁用词" : "Forbidden words"}
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
            {labels.appName === "对味" ? "必用词" : "Required words"}
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
          {labels.appName === "对味" ? "品牌示例文案" : "Example brand copy"}
        </span>
        <textarea
          className="mt-2 min-h-36 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
          defaultValue={initialValues?.exampleCopy ?? ""}
          name="exampleCopy"
          placeholder={
            labels.appName === "对味"
              ? "粘贴最能代表品牌语气的示例"
              : "Paste a sample that best represents this brand voice"
          }
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={submitLabel} labels={labels} />
      </div>
    </form>
  );
}
