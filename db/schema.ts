import { relations, sql } from "drizzle-orm";
import {
  check,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  // Synced from neon_auth."user" via sync_user_from_neon_auth_trigger.
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const guestbookMessages = pgTable(
  "guestbook_messages",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: varchar("body", { length: 500 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("guestbook_messages_body_length", sql`char_length(${table.body}) >= 1`),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  guestbookMessages: many(guestbookMessages),
}));

export const guestbookMessagesRelations = relations(
  guestbookMessages,
  ({ one }) => ({
    user: one(users, {
      fields: [guestbookMessages.userId],
      references: [users.id],
    }),
  }),
);
