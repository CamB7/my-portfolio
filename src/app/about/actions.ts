"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { guestbookMessages, users } from "../../../db/schema";
import { auth } from "@/lib/auth/server";
import type { PostGuestbookMessageResult } from "@/lib/guestbook/types";

const MAX_BODY_LENGTH = 500;

export async function postGuestbookMessage(
  body: string,
): Promise<PostGuestbookMessageResult> {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { success: false, error: "You must be signed in to post a message." };
  }

  const trimmed = body.trim();

  if (trimmed.length < 1) {
    return { success: false, error: "Message cannot be empty." };
  }

  if (trimmed.length > MAX_BODY_LENGTH) {
    return {
      success: false,
      error: `Message must be ${MAX_BODY_LENGTH} characters or fewer.`,
    };
  }

  const [inserted] = await db
    .insert(guestbookMessages)
    .values({
      userId: session.user.id,
      body: trimmed,
    })
    .returning({
      id: guestbookMessages.id,
      body: guestbookMessages.body,
      createdAt: guestbookMessages.createdAt,
      userId: guestbookMessages.userId,
    });

  const [author] = await db
    .select({
      name: users.name,
      image: users.image,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  revalidatePath("/about");

  return {
    success: true,
    message: {
      id: inserted.id,
      body: inserted.body,
      createdAt: inserted.createdAt.toISOString(),
      userId: inserted.userId,
      userName: author?.name ?? session.user.name,
      userImage: author?.image ?? session.user.image ?? null,
    },
  };
}
