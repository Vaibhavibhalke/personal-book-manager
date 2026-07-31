import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { getSessionFromRequest } from "@/lib/auth";
import type { BookStatus } from "@/types";

const VALID_STATUSES: BookStatus[] = ["want-to-read", "reading", "completed"];

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");

    await connectDB();

    const filter: Record<string, unknown> = {
      userId: session.userId,
    };

    if (status && VALID_STATUSES.includes(status as BookStatus)) {
      filter.status = status;
    }

    if (tag) {
      filter.tags = tag.toLowerCase();
    }

    const books = await Book.find(filter).sort({ updatedAt: -1 });

    return NextResponse.json({
      books: books.map((book) => ({
        _id: book._id.toString(),
        title: book.title,
        author: book.author,
        tags: book.tags,
        status: book.status,
        createdAt: book.createdAt.toISOString(),
        updatedAt: book.updatedAt.toISOString(),
      })),
      total: books.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, author, tags, status } = await request.json();

    if (!title?.trim() || !author?.trim()) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    const parsedTags = Array.isArray(tags)
      ? tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean)
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t: string) => t.trim().toLowerCase())
            .filter(Boolean)
        : [];

    const book = await Book.create({
      userId: session.userId,
      title: title.trim(),
      author: author.trim(),
      tags: parsedTags,
      status: status ?? "want-to-read",
    });

    return NextResponse.json(
      {
        book: {
          _id: book._id.toString(),
          title: book.title,
          author: book.author,
          tags: book.tags,
          status: book.status,
          createdAt: book.createdAt.toISOString(),
          updatedAt: book.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
