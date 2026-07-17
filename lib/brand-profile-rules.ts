export const FREE_BRAND_PROFILE_LIMIT = 1;
export const BRAND_NAME_MAX_LENGTH = 100;
export const AUDIENCE_MAX_LENGTH = 200;
export const BRAND_PROFILE_LIST_MAX_ITEMS = 30;
export const BRAND_PROFILE_LIST_ITEM_MAX_LENGTH = 50;
export const EXAMPLE_COPY_MAX_LENGTH = 1000;

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

function validateOptionalTextLength(
  value: string | null,
  maxLength: number,
  message: string,
) {
  if (value && value.length > maxLength) {
    return message;
  }

  return undefined;
}

function validateDelimitedField(values: string[], label: string) {
  if (values.length > BRAND_PROFILE_LIST_MAX_ITEMS) {
    return `${label} can include up to ${BRAND_PROFILE_LIST_MAX_ITEMS} items.`;
  }

  if (values.some((value) => value.length > BRAND_PROFILE_LIST_ITEM_MAX_LENGTH)) {
    return `${label} items must be ${BRAND_PROFILE_LIST_ITEM_MAX_LENGTH} characters or fewer.`;
  }

  return undefined;
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
  const audience = normalizeOptionalText(formData.get("audience"));
  const toneTags = parseDelimitedInput(formData.get("toneTags"));
  const forbiddenWords = parseDelimitedInput(formData.get("forbiddenWords"));
  const requiredWords = parseDelimitedInput(formData.get("requiredWords"));
  const exampleCopy = normalizeOptionalText(formData.get("exampleCopy"));
  const errors: BrandProfileFormErrors = {};

  if (!name) {
    errors.name = "Brand name is required.";
  } else if (name.length > BRAND_NAME_MAX_LENGTH) {
    errors.name = `Brand name must be ${BRAND_NAME_MAX_LENGTH} characters or fewer.`;
  }

  errors.audience = validateOptionalTextLength(
    audience,
    AUDIENCE_MAX_LENGTH,
    `Audience must be ${AUDIENCE_MAX_LENGTH} characters or fewer.`,
  );
  errors.toneTags = validateDelimitedField(toneTags, "Tone tags");
  errors.forbiddenWords = validateDelimitedField(
    forbiddenWords,
    "Forbidden words",
  );
  errors.requiredWords = validateDelimitedField(requiredWords, "Required words");
  errors.exampleCopy = validateOptionalTextLength(
    exampleCopy,
    EXAMPLE_COPY_MAX_LENGTH,
    `Example copy must be ${EXAMPLE_COPY_MAX_LENGTH} characters or fewer.`,
  );

  Object.keys(errors).forEach((key) => {
    if (!errors[key as keyof BrandProfileFormErrors]) {
      delete errors[key as keyof BrandProfileFormErrors];
    }
  });

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  const validName = name;
  if (!validName) {
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
      name: validName,
      audience,
      toneTags,
      forbiddenWords,
      requiredWords,
      exampleCopy,
    },
  };
}
