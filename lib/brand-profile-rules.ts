export const FREE_BRAND_PROFILE_LIMIT = 1;

export type PlanName = "FREE" | "PRO" | "AGENCY";

export type BrandProfileFormInput = {
  name: string;
  audience: string | null;
  toneTags: string[];
  forbiddenWords: string[];
  requiredWords: string[];
  exampleCopy: string | null;
};

export type BrandProfileFormErrors = Partial<
  Record<keyof BrandProfileFormInput, string>
>;

export type BrandProfileFormResult =
  | { ok: true; data: BrandProfileFormInput }
  | { ok: false; errors: BrandProfileFormErrors };

export function parseDelimitedInput(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") {
    return [];
  }

  const seen = new Set<string>();
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter((item) => {
      if (!item || seen.has(item)) {
        return false;
      }

      seen.add(item);
      return true;
    });
}

export function normalizeOptionalText(
  value: FormDataEntryValue | null,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function canCreateBrandProfile(
  plan: PlanName,
  existingBrandProfileCount: number,
): boolean {
  if (plan === "FREE") {
    return existingBrandProfileCount < FREE_BRAND_PROFILE_LIMIT;
  }

  return true;
}

export function parseBrandProfileFormData(
  formData: FormData,
): BrandProfileFormResult {
  const name = normalizeOptionalText(formData.get("name"));

  if (!name) {
    return {
      ok: false,
      errors: {
        name: "Brand name is required.",
      },
    };
  }

  return {
    ok: true,
    data: {
      name,
      audience: normalizeOptionalText(formData.get("audience")),
      toneTags: parseDelimitedInput(formData.get("toneTags")),
      forbiddenWords: parseDelimitedInput(formData.get("forbiddenWords")),
      requiredWords: parseDelimitedInput(formData.get("requiredWords")),
      exampleCopy: normalizeOptionalText(formData.get("exampleCopy")),
    },
  };
}
