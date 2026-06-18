export type GuestbookMessage = {
  id: number;
  body: string;
  createdAt: string;
  userId: string;
  userName: string;
  userImage: string | null;
};

export type PostGuestbookMessageResult =
  | { success: true; message: GuestbookMessage }
  | { success: false; error: string };
