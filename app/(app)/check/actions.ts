"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateToneCheck } from "@/lib/ai/tone-check";
import type { ToneCheckResult } from "@/lib/ai/types";
import { buildCheckCreateData } from "@/lib/check-history";
import { getDictionary } from "@/lib/i18n/server";

export type CheckToneActionState = {
  error?: string;
  result?: ToneCheckResult;
  checkId?: string;
};

const MAX_COPY_LENGTH = 5000;

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getContextValue(formData: FormData, key: string, customKey: string) {
  const value = getRequiredString(formData, key);
  const customValue = getRequiredString(formData, customKey);

  if (value === "custom") {
    return customValue;
  }

  return value;
}

function toFriendlyError(
  error: unknown,
  labels: Awaited<ReturnType<typeof getDictionary>>["t"]["check"]["errors"],
) {
  if (!(error instanceof Error)) {
    return labels.failed;
  }

  if (error.message.includes("invalid JSON")) {
    return labels.invalidJson;
  }

  if (error.message.includes("OPENAI_COMPATIBLE")) {
    return labels.provider;
  }

  if (error.message.includes("AI provider request failed")) {
    return labels.failed;
  }

  return labels.failed;
}

function getAiCallLogContext() {
  return {
    provider: process.env.AI_PROVIDER ?? "openai-compatible",
    model: process.env.OPENAI_COMPATIBLE_MODEL ?? "unknown",
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.slice(0, 1000);
  }

  return "Unknown tone check error.";
}

function isBrandBrainReady(brandProfile: {
  audience: string | null;
  exampleCopy: string | null;
  toneTags: string[];
}) {
  return Boolean(
    brandProfile.audience?.trim() &&
      brandProfile.exampleCopy?.trim() &&
      brandProfile.toneTags.length > 0,
  );
}

export async function checkToneAction(
  _previousState: CheckToneActionState,
  formData: FormData,
): Promise<CheckToneActionState> {
  const { userId } = await auth.protect();
  const [{ t }, clerkUser] = await Promise.all([getDictionary(), currentUser()]);
  const brandProfileId = getRequiredString(formData, "brandProfileId");
  const inputText = getRequiredString(formData, "inputText");
  const baseContext = {
    platform: getContextValue(formData, "platform", "customPlatform"),
    audience: getContextValue(formData, "contextAudience", "customAudience"),
    goal: getContextValue(formData, "goal", "customGoal"),
    language: getContextValue(formData, "language", "customLanguage"),
  };
  const reviewer =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.username ||
    t.common.currentUser;

  if (!brandProfileId) {
    return {
      error: t.check.errors.selectBrand,
    };
  }

  if (!inputText) {
    return {
      error: t.check.errors.enterCopy,
    };
  }

  if (inputText.length > MAX_COPY_LENGTH) {
    return {
      error: t.check.errors.copyTooLong,
    };
  }

  if (
    !baseContext.platform ||
    !baseContext.audience ||
    !baseContext.goal ||
    !baseContext.language
  ) {
    return {
      error: t.check.errors.completeContext,
    };
  }

  const userProfile = await prisma.userProfile.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!userProfile) {
    return {
      error: t.check.errors.noProfile,
    };
  }

  const brandProfile = await prisma.brandProfile.findFirst({
    where: {
      id: brandProfileId,
      userId: userProfile.id,
    },
  });

  if (!brandProfile) {
    return {
      error: t.check.errors.notFound,
    };
  }

  if (!isBrandBrainReady(brandProfile)) {
    return {
      error: t.check.errors.incompleteBrand,
    };
  }

  try {
    const context = {
      ...baseContext,
      brand: brandProfile.name,
      reviewer,
      time: new Date().toISOString(),
    };
    const result = await generateToneCheck({
      brandProfile,
      context,
      inputText,
    });
    const resultWithContext = {
      ...result,
      context,
    };
    const aiContext = getAiCallLogContext();
    const check = await prisma.check.create({
      data: {
        ...buildCheckCreateData({
          userId: userProfile.id,
          brandProfileId: brandProfile.id,
          inputText,
          result: resultWithContext,
        }),
        aiCallLogs: {
          create: {
            userId: userProfile.id,
            provider: aiContext.provider,
            model: aiContext.model,
            status: "SUCCESS",
          },
        },
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/checks");

    return {
      result: resultWithContext,
      checkId: check.id,
    };
  } catch (error) {
    try {
      const aiContext = getAiCallLogContext();
      await prisma.aiCallLog.create({
        data: {
          userId: userProfile.id,
          provider: aiContext.provider,
          model: aiContext.model,
          status: "FAILED",
          errorMessage: getErrorMessage(error),
        },
      });
    } catch {
      // Keep the user-facing failure path stable even if logging fails.
    }

    return {
      error: toFriendlyError(error, t.check.errors),
    };
  }
}
