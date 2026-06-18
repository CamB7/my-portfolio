import { desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { guestbookMessages, users } from "../../../db/schema";
import type { GuestbookMessage } from "./types";

export async function getGuestbookMessages(): Promise<GuestbookMessage[]> {
  const rows = await db
    .select({
      id: guestbookMessages.id,
      body: guestbookMessages.body,
      createdAt: guestbookMessages.createdAt,
      userId: guestbookMessages.userId,
      userName: users.name,
      userImage: users.image,
    })
    .from(guestbookMessages)
    .innerJoin(users, eq(guestbookMessages.userId, users.id))
    .orderBy(desc(guestbookMessages.createdAt));

  return rows.map((row) => ({
    id: row.id,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    userId: row.userId,
    userName: row.userName,
    userImage: row.userImage,
  }));
}
