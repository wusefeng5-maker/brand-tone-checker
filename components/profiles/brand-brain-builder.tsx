"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createBrandBrainProfileAction,
  generateBrandBrainAction,
  type BrandBrainActionState,
  type BrandProfileActionState,
} from "@/app/(app)/profiles/actions";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/ui/toast";
import type { Dictionary } from "@/lib/i18n/config";

type BrandBrainLabels = Dictionary["brandBrain"];

function GenerateButton({ labels }: { labels: BrandBrainLabels }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? <Spinner /> : null}
      {pending ? labels.building : labels.build}
    </button>
  );
}

function SaveButton({ labels }: { labels: BrandBrainLabels }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? <Spinner /> : null}
      {pending ? labels.saving : labels.save}
    </button>
  );
}

function TextInput({
  label,
  name,
  value,
  required,
}: {
  label: string;
  name: string;
  value: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
        defaultValue={value}
        name={name}
        required={required}
      />
    </label>
  );
}

function TextAreaInput({
  label,
  name,
  value,
  rows = 4,
}: {
  label: string;
  name: string;
  value: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <textarea
        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
        defaultValue={value}
        name={name}
        rows={rows}
      />
    </label>
  );
}

async function readFilesAsText(files: FileList) {
  const chunks = await Promise.all(
    Array.from(files).map(async (file) => {
      const text = await file.text();

      return [`--- ${file.name} ---`, text].join("\n");
    }),
  );

  return chunks.join("\n\n");
}

export function BrandBrainBuilder({ labels }: { labels: BrandBrainLabels }) {
  const [sourceText, setSourceText] = useState("");
  const [generateState, generateAction] = useActionState<
    BrandBrainActionState,
    FormData
  >(generateBrandBrainAction, {});
  const [saveState, saveAction] = useActionState<
    BrandProfileActionState,
    FormData
  >(createBrandBrainProfileAction, {});
  const draft = generateState.draft;
  const f = labels.fields;

  return (
    <div className="rounded-3xl border border-orange-100 bg-orange-50/60 p-6 sm:p-8">
      <div>
        <p className="text-sm font-semibold text-orange-600">
          {labels.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950">
          {labels.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          {labels.description}
        </p>
        {draft?.confidence === "Low" ? (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-100 px-4 py-3 text-sm font-semibold text-orange-900">
            {labels.lowConfidence} - {labels.informationInsufficient}
          </div>
        ) : null}
      </div>

      <form action={generateAction} className="mt-6 space-y-4">
        <Toast message={generateState.error} tone="error" />
        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">
            {labels.material}
          </span>
          <textarea
            className="mt-2 min-h-44 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
            name="sourceText"
            onChange={(event) => setSourceText(event.target.value)}
            placeholder={labels.materialPlaceholder}
            required
            value={sourceText}
          />
        </label>
        <input
          accept=".txt,.md,text/plain,text/markdown"
          className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-700"
          multiple
          onChange={async (event) => {
            const files = event.target.files;
            if (!files?.length) {
              return;
            }

            const text = await readFilesAsText(files);
            setSourceText((current) =>
              [current, text].filter(Boolean).join("\n\n"),
            );
          }}
          type="file"
        />
        <p className="text-xs text-zinc-500">{labels.uploadHint}</p>
        <GenerateButton labels={labels} />
      </form>

      {draft ? (
        <form action={saveAction} className="mt-8 space-y-5">
          <Toast
            message={saveState.message}
            tone={saveState.errors ? "error" : "info"}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <TextInput
              label={f.brandName}
              name="brandName"
              required
              value={draft.brandName}
            />
            <TextInput
              label={f.brandArchetype}
              name="brandArchetype"
              value={draft.brandArchetype}
            />
          </div>
          <TextAreaInput
            label={f.brandPersonality}
            name="brandPersonality"
            value={draft.brandPersonality}
          />
          <TextAreaInput
            label={f.communicationStyle}
            name="communicationStyle"
            value={draft.communicationStyle.join("\n")}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <TextAreaInput
              label={f.brandDo}
              name="brandDo"
              value={draft.brandDo.join("\n")}
            />
            <TextAreaInput
              label={f.brandDont}
              name="brandDont"
              value={draft.brandDont.join("\n")}
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <TextAreaInput
              label={f.vocabulary}
              name="vocabulary"
              value={draft.vocabulary.join("\n")}
            />
            <TextAreaInput
              label={f.typicalCta}
              name="typicalCta"
              value={draft.typicalCta.join("\n")}
            />
            <TextAreaInput
              label={f.emotion}
              name="emotion"
              value={draft.emotion.join("\n")}
            />
          </div>
          <TextAreaInput
            label={f.audiencePainPoints}
            name="audiencePainPoints"
            value={draft.audiencePainPoints.join("\n")}
          />
          <TextAreaInput
            label={f.brandPromise}
            name="brandPromise"
            value={draft.brandPromise}
          />
          <TextAreaInput
            label={f.brandKeywords}
            name="brandKeywords"
            value={draft.brandKeywords.join("\n")}
          />
          <TextAreaInput
            label={f.brandSummary}
            name="brandSummary"
            rows={5}
            value={draft.brandSummary}
          />
          <SaveButton labels={labels} />
        </form>
      ) : null}
    </div>
  );
}
