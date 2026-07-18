"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { checkToneAction } from "@/app/(app)/check/actions";
import type { CheckToneActionState } from "@/app/(app)/check/actions";
import { ToneCheckResultView } from "@/components/check/tone-check-result";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/ui/toast";
import type { Dictionary, Locale } from "@/lib/i18n/config";

type BrandProfileOption = {
  audience: string | null;
  exampleCopy: string | null;
  id: string;
  name: string;
  toneTags: string[];
};

type ToneCheckFormProps = {
  brandProfiles: BrandProfileOption[];
  labels: Dictionary;
  locale: Locale;
};

function isBrandBrainReady(profile: BrandProfileOption) {
  return Boolean(
    profile.audience?.trim() &&
      profile.exampleCopy?.trim() &&
      profile.toneTags.length > 0,
  );
}

function ContextSelect({
  customName,
  label,
  name,
  options,
  customLabel,
  value,
  onChange,
}: {
  customName: string;
  customLabel: string;
  label: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <select
        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="custom">{customLabel}</option>
      </select>
      {value === "custom" ? (
        <input
          className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950"
          name={customName}
          placeholder={customLabel}
          required
        />
      ) : null}
    </label>
  );
}

function CheckButton({
  disabled,
  labels,
}: {
  disabled: boolean;
  labels: Dictionary["check"];
}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
      disabled={isDisabled}
      type="submit"
    >
      {pending ? <Spinner /> : null}
      {pending ? labels.checking : labels.check}
    </button>
  );
}

export function ToneCheckForm({
  brandProfiles,
  labels,
  locale,
}: ToneCheckFormProps) {
  const platformOptions = labels.check.options.platforms;
  const audienceOptions = labels.check.options.audiences;
  const goalOptions = labels.check.options.goals;
  const languageOptions = labels.check.options.languages;
  const [platform, setPlatform] = useState<string>(platformOptions[0]);
  const [audience, setAudience] = useState<string>(audienceOptions[0]);
  const [goal, setGoal] = useState<string>(goalOptions[0]);
  const [language, setLanguage] = useState<string>(
    locale === "zh" ? "中文" : "English",
  );
  const [selectedBrandProfileId, setSelectedBrandProfileId] = useState(
    brandProfiles[0]?.id ?? "",
  );
  const [state, formAction] = useActionState<CheckToneActionState, FormData>(
    checkToneAction,
    {},
  );
  const hasBrandProfiles = brandProfiles.length > 0;
  const selectedBrandProfile = brandProfiles.find(
    (profile) => profile.id === selectedBrandProfileId,
  );
  const brandBrainReady = selectedBrandProfile
    ? isBrandBrainReady(selectedBrandProfile)
    : false;
  const canCheck = hasBrandProfiles && brandBrainReady;

  return (
    <>
      <form
        action={formAction}
        className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-200/70 sm:p-8"
      >
        <Toast message={state.error} tone="error" />
        <Toast
          message={state.result ? labels.check.success : undefined}
          tone="success"
        />

        <div className="space-y-6">
          <label className="block">
            <span className="text-sm font-semibold text-zinc-800">
              {labels.check.brandProfile}
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950 disabled:bg-zinc-50 disabled:text-zinc-400"
              disabled={!hasBrandProfiles}
              name="brandProfileId"
              onChange={(event) => setSelectedBrandProfileId(event.target.value)}
              value={selectedBrandProfileId}
            >
              {hasBrandProfiles ? (
                brandProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))
              ) : (
                <option value="">{labels.check.noBrand}</option>
              )}
            </select>
          </label>

          {hasBrandProfiles && !brandBrainReady ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-800">
              {labels.check.incompleteBrand}
            </div>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-3">
            <ContextSelect
              customName="customPlatform"
              customLabel={labels.check.options.custom}
              label={labels.check.platform}
              name="platform"
              onChange={setPlatform}
              options={platformOptions}
              value={platform}
            />
            <ContextSelect
              customName="customAudience"
              customLabel={labels.check.options.custom}
              label={labels.check.audience}
              name="contextAudience"
              onChange={setAudience}
              options={audienceOptions}
              value={audience}
            />
            <ContextSelect
              customName="customGoal"
              customLabel={labels.check.options.custom}
              label={labels.check.goal}
              name="goal"
              onChange={setGoal}
              options={goalOptions}
              value={goal}
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <ContextSelect
              customName="customLanguage"
              customLabel={labels.check.options.custom}
              label={labels.check.language}
              name="language"
              onChange={setLanguage}
              options={languageOptions}
              value={language}
            />
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-zinc-800">
              {labels.check.copy}
            </span>
            <textarea
              className="mt-2 min-h-56 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-950 disabled:bg-zinc-50 disabled:text-zinc-400"
              disabled={!canCheck}
              name="inputText"
              placeholder={labels.check.copyPlaceholder}
              required={canCheck}
            />
          </label>
        </div>

        <div className="mt-6">
          <CheckButton disabled={!canCheck} labels={labels.check} />
          {!hasBrandProfiles ? (
            <p className="mt-3 text-sm text-zinc-500">
              {labels.check.noBrand}
            </p>
          ) : !brandBrainReady ? (
            <p className="mt-3 text-sm text-zinc-500">
              {labels.check.incompleteBrand}
            </p>
          ) : null}
        </div>
      </form>

      {state.result ? (
        <div className="mt-8">
          <ToneCheckResultView
            historyHref={state.checkId ? `/checks/${state.checkId}` : undefined}
            labels={labels}
            locale={locale}
            result={state.result}
          />
          {state.checkId ? (
            <Link
              className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              href={`/checks/${state.checkId}`}
            >
              {labels.check.viewSaved}
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
