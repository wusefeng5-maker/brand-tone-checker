"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function deleteCheckAction(checkId: string): Promise<void> {
  const { userId } = await auth.protect();

  await prisma.check.deleteMany({
    where: {
      id: checkId,
      user: {
        clerkUserId: userId,
      },
    },
  });

  revalidatePath("/checks");
}
