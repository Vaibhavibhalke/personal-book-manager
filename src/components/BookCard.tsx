"use client";

import type { Book, BookStatus } from "@/types";
import { BOOK_STATUS_EMOJI, BOOK_STATUS_LABELS } from "@/types";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: BookStatus) => void;
}

const statusStyles: Record<BookStatus, string> = {
  "want-to-read": "status-want",
  reading: "status-reading",
  completed: "status-completed",
};

const spineColors: Record<BookStatus, string> = {
  "want-to-read": "from-blue-500 to-indigo-600",
  reading: "from-amber-500 to-orange-600",
  completed: "from-emerald-500 to-teal-600",
};

export default function BookCard({
  book,
  onEdit,
  onDelete,
  onStatusChange,
}: BookCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-lg shadow-stone-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10">
      <div
        className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-b ${spineColors[book.status]}`}
      />

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles[book.status]}`}
            >
              {BOOK_STATUS_EMOJI[book.status]} {BOOK_STATUS_LABELS[book.status]}
            </span>
            <h3 className="section-title mt-3 truncate text-xl font-semibold text-stone-900">
              {book.title}
            </h3>
            <p className="mt-1 text-sm text-stone-500">by {book.author}</p>
          </div>
        </div>

        {book.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-900"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
          <select
            value={book.status}
            onChange={(e) =>
              onStatusChange(book._id, e.target.value as BookStatus)
            }
            className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-700 outline-none focus:border-amber-400"
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
            className="rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
