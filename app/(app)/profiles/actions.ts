"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  type BrandProfileFormInput,
  canCreateBrandProfile,
  parseBrandProfileFormData,
  type BrandProfileFormErrors,
  type PlanName,
} from "@/lib/brand-profile-rules";
import {
  BRAND_BRAIN_SOURCE_MAX_LENGTH,
  generateBrandBrainDraft,
  type BrandBrainDraft,
} from "@/lib/brand-brain";
import { getDictionary } from "@/lib/i18n/server";

export type BrandProfileActionState = {
  message?: string;
  errors?: BrandProfileFormErrors;
};

export type BrandBrainActionState = {
  error?: string;
  draft?: BrandBrainDraft;
};

async function getCurrentUserProfile() {
  const { userId } = await auth.protect();
  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? null;

  return prisma.userProfile.upsert({
    where: {
      clerkUserId: userId,
    },
    update: {
      email,
    },
    create: {
      clerkUserId: userId,
      email,
    },
  });
}

async function createBrandProfileForCurrentUser(data: BrandProfileFormInput) {
  const userProfile = await getCurrentUserProfile();
  const existingBrandProfileCount = await prisma.brandProfile.count({
    where: {
      userId: userProfile.id,
    },
  });

  if (
    !canCreateBrandProfile(
      userProfile.plan as PlanName,
      existingBrandProfileCount,
    )
  ) {
    return {
      ok: false,
      message: "Free users can create only 1 brand profile.",
    };
  }

  await prisma.brandProfile.create({
    data: {
      ...data,
      userId: userProfile.id,
    },
  });

  revalidatePath("/profiles");

  return {
    ok: true,
  };
}

export async function createBrandProfileAction(
  _previousState: BrandProfileActionState,
  formData: FormData,
): Promise<BrandProfileActionState> {
  const parsed = parseBrandProfileFormData(formData);

  if (!parsed.ok) {
    return {
      errors: parsed.errors,
      message: "Please check the brand profile fields.",
    };
  }

  const result = await createBrandProfileForCurrentUser(parsed.data);

  if (!result.ok) {
    return {
      message: result.message,
    };
  }

  redirect("/profiles");
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function formatBrandBrainExample(formData: FormData) {
  const parts = [
    ["Brand personality", getOptionalString(formData, "brandPersonality")],
    ["Communication style", getOptionalString(formData, "communicationStyle")],
    ["Brand do", getOptionalString(formData, "brandDo")],
    ["Typical CTA", getOptionalString(formData, "typicalCta")],
    ["Emotion", getOptionalString(formData, "emotion")],
    ["Audience pain points", getOptionalString(formData, "audiencePainPoints")],
    ["Brand promise", getOptionalString(formData, "brandPromise")],
    ["Brand archetype", getOptionalString(formData, "brandArchetype")],
    ["Brand summary", getOptionalString(formData, "brandSummary")],
  ].filter(([, value]) => value.length > 0);

  return parts.map(([label, value]) => `${label}: ${value}`).join("\n");
}

export async function generateBrandBrainAction(
  _previousState: BrandBrainActionState,
  formData: FormData,
): Promise<BrandBrainActionState> {
  await auth.protect();
  const { t } = await getDictionary();

  const sourceText = getOptionalString(formData, "sourceText");

  if (!sourceText) {
    return {
      error: t.brandBrain.errors.empty,
    };
  }

  if (sourceText.length > BRAND_BRAIN_SOURCE_MAX_LENGTH) {
    return {
      error: t.brandBrain.errors.tooLong,
    };
  }

  try {
    const draft = await generateBrandBrainDraft(sourceText);

    return {
      draft,
    };
  } catch {
    return {
      error: t.brandBrain.errors.failed,
    };
  }
}

export async function createBrandBrainProfileAction(
  _previousState: BrandProfileActionState,
  formData: FormData,
): Promise<BrandProfileActionState> {
  const generatedProfileData = new FormData();
  generatedProfileData.set("name", getOptionalString(formData, "brandName"));
  generatedProfileData.set(
    "audience",
    getOptionalString(formData, "audiencePainPoints"),
  );
  generatedProfileData.set(
    "toneTags",
    [
      getOptionalString(formData, "brandPersonality"),
      getOptionalString(formData, "communicationStyle"),
      getOptionalString(formData, "emotion"),
      getOptionalString(formData, "brandArchetype"),
    ]
      .filter(Boolean)
      .join("\n"),
  );
  generatedProfileData.set(
    "forbiddenWords",
    [
      getOptionalString(formData, "brandDont"),
      getOptionalString(formData, "forbiddenExpressions"),
    ]
      .filter(Boolean)
      .join("\n"),
  );
  generatedProfileData.set(
    "requiredWords",
    [
      getOptionalString(formData, "brandDo"),
      getOptionalString(formData, "vocabulary"),
      getOptionalString(formData, "typicalCta"),
      getOptionalString(formData, "brandKeywords"),
    ]
      .filter(Boolean)
      .join("\n"),
  );
  generatedProfileData.set("exampleCopy", formatBrandBrainExample(formData));

  const parsed = parseBrandProfileFormData(generatedProfileData);

  if (!parsed.ok) {
    return {
      errors: parsed.errors,
      message: "Please check the generated Brand Brain fields.",
    };
  }

  const result = await createBrandProfileForCurrentUser(parsed.data);

  if (!result.ok) {
    return {
      message: result.message,
    };
  }

  redirect("/profiles");
}

export async function updateBrandProfileAction(
  brandProfileId: string,
  _previousState: BrandProfileActionState,
  formData: FormData,
): Promise<BrandProfileActionState> {
  const parsed = parseBrandProfileFormData(formData);

  if (!parsed.ok) {
    return {
      errors: parsed.errors,
      message: "Please check the brand profile fields.",
    };
  }

  const userProfile = await getCurrentUserProfile();
  const result = await prisma.brandProfile.updateMany({
    where: {
      id: brandProfileId,
      userId: userProfile.id,
    },
    data: parsed.data,
  });

  if (result.count === 0) {
    return {
      message: "No editable brand profile was found.",
    };
  }

  revalidatePath("/profiles");
  revalidatePath(`/profiles/${brandProfileId}`);
  redirect("/profiles");
}

export async function deleteBrandProfileAction(
  brandProfileId: string,
): Promise<void> {
  const userProfile = await getCurrentUserProfile();

  await prisma.brandProfile.deleteMany({
    where: {
      id: brandProfileId,
      userId: userProfile.id,
    },
  });

  revalidatePath("/profiles");
  redirect("/profiles");
}
