export type BookStatus = "want-to-read" | "reading" | "completed";

export interface Book {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  "want-to-read": "Want to Read",
  reading: "Reading",
  completed: "Completed",
};

export const BOOK_STATUS_EMOJI: Record<BookStatus, string> = {
  "want-to-read": "📖",
  reading: "📘",
  completed: "✅",
};
