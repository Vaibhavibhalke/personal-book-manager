"use client";

import type { Book, BookStatus } from "@/types";
import { BOOK_STATUS_EMOJI, BOOK_STATUS_LABELS } from "@/types";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: BookStatus) => void;
}

export default function BookCard({
  book,
  onEdit,
  onDelete,
  onStatusChange,
}: BookCardProps) {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold text-stone-800 truncate">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-stone-500">by {book.author}</p>
        </div>
        <span
          className="shrink-0 text-xl"
          title={BOOK_STATUS_LABELS[book.status]}
          aria-label={BOOK_STATUS_LABELS[book.status]}
        >
          {BOOK_STATUS_EMOJI[book.status]}
        </span>
      </div>

      {book.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
        <select
          value={book.status}
          onChange={(e) =>
            onStatusChange(book._id, e.target.value as BookStatus)
          }
          className="rounded-lg border border-stone-200 px-2 py-1.5 text-xs text-stone-700 outline-none focus:border-amber-400"
          aria-label={`Change status for ${book.title}`}
        >
          {(Object.keys(BOOK_STATUS_LABELS) as BookStatus[]).map((key) => (
            <option key={key} value={key}>
              {BOOK_STATUS_LABELS[key]}
            </option>
          ))}
        </select>

        <button
          onClick={() => onEdit(book)}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book._id)}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
