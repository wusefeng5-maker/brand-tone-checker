"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateToneCheck } from "@/lib/ai/tone-check";
import type { ToneCheckResult } from "@/lib/ai/types";
import { buildCheckCreateData } from "@/lib/check-history";

export type CheckToneActionState = {
  error?: string;
  result?: ToneCheckResult;
  checkId?: string;
};

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function toFriendlyError(error: unknown) {
  if (!(error instanceof Error)) {
    return "Tone check failed. Please try again.";
  }

  if (error.message.includes("invalid JSON")) {
    return "AI returned a response we could not parse. Please try again.";
  }

  if (error.message.includes("OPENAI_COMPATIBLE")) {
    return "AI provider is not configured. Please check the required environment variables.";
  }

  if (error.message.includes("AI provider request failed")) {
    return "AI provider request failed. Please try again later.";
  }

  return "Tone check failed. Please try again.";
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

export async function checkToneAction(
  _previousState: CheckToneActionState,
  formData: FormData,
): Promise<CheckToneActionState> {
  const { userId } = await auth.protect();
  const brandProfileId = getRequiredString(formData, "brandProfileId");
  const inputText = getRequiredString(formData, "inputText");

  if (!brandProfileId) {
    return {
      error: "Please select a brand profile.",
    };
  }

  if (!inputText) {
    return {
      error: "Please enter copy to check.",
    };
  }

  const userProfile = await prisma.userProfile.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!userProfile) {
    return {
      error: "Please create a brand profile first.",
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
      error: "Brand profile was not found.",
    };
  }

  try {
    const result = await generateToneCheck({
      brandProfile,
      inputText,
    });
    const aiContext = getAiCallLogContext();
    const check = await prisma.check.create({
      data: {
        ...buildCheckCreateData({
          userId: userProfile.id,
          brandProfileId: brandProfile.id,
          inputText,
          result,
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
      result,
      checkId: check.id,
    };
  } catch (error) {
    console.error("Tone Check Error:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }

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
    } catch (logError) {
      console.error("Tone Check Error:", logError);
      if (logError instanceof Error) {
        console.error(logError.stack);
      }
    }

    return {
      error: toFriendlyError(error),
    };
  }
}
