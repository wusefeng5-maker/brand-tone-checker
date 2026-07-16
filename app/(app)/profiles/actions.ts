"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  canCreateBrandProfile,
  parseBrandProfileFormData,
  type BrandProfileFormErrors,
  type PlanName,
} from "@/lib/brand-profile-rules";

export type BrandProfileActionState = {
  message?: string;
  errors?: BrandProfileFormErrors;
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
      message: "Free users can create only 1 brand profile.",
    };
  }

  await prisma.brandProfile.create({
    data: {
      ...parsed.data,
      userId: userProfile.id,
    },
  });

  revalidatePath("/profiles");
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
