import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { getSessionFromRequest } from "@/lib/auth";
import type { BookStatus } from "@/types";

const VALID_STATUSES: BookStatus[] = ["want-to-read", "reading", "completed"];

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { title, author, tags, status } = await request.json();

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    const book = await Book.findOne({ _id: id, userId: session.userId });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (title !== undefined) book.title = title.trim();
    if (author !== undefined) book.author = author.trim();
    if (status !== undefined) book.status = status;
    if (tags !== undefined) {
      book.tags = Array.isArray(tags)
        ? tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean)
        : typeof tags === "string"
          ? tags
              .split(",")
              .map((t: string) => t.trim().toLowerCase())
              .filter(Boolean)
          : [];
    }

    await book.save();

    return NextResponse.json({
      book: {
        _id: book._id.toString(),
        title: book.title,
        author: book.author,
        tags: book.tags,
        status: book.status,
        createdAt: book.createdAt.toISOString(),
        updatedAt: book.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();

    const book = await Book.findOneAndDelete({
      _id: id,
      userId: session.userId,
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
