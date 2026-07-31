import mongoose, { Schema, models } from "mongoose";
import type { BookStatus } from "@/types";

export interface IBook {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["want-to-read", "reading", "completed"],
      default: "want-to-read",
    },
  },
  { timestamps: true }
);

BookSchema.index({ userId: 1, status: 1 });
BookSchema.index({ userId: 1, tags: 1 });

export const Book = models.Book ?? mongoose.model<IBook>("Book", BookSchema);
