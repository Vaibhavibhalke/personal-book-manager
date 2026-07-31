"use client";

import { FormEvent, useState } from "react";
import type { Book, BookStatus } from "@/types";
import { BOOK_STATUS_LABELS } from "@/types";

interface BookFormProps {
  onSubmit: (data: {
    title: string;
    author: string;
    tags: string;
    status: BookStatus;
  }) => Promise<void>;
  initialBook?: Book | null;
  onCancel?: () => void;
}

export default function BookForm({
  onSubmit,
  initialBook,
  onCancel,
}: BookFormProps) {
  const [title, setTitle] = useState(initialBook?.title ?? "");
  const [author, setAuthor] = useState(initialBook?.author ?? "");
  const [tags, setTags] = useState(initialBook?.tags.join(", ") ?? "");
  const [status, setStatus] = useState<BookStatus>(
    initialBook?.status ?? "want-to-read"
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, author, tags, status });
      if (!initialBook) {
        setTitle("");
        setAuthor("");
        setTags("");
        setStatus("want-to-read");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 font-serif text-lg font-semibold text-stone-800">
        {initialBook ? "Edit book" : "Add a new book"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-stone-700">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="Book title"
          />
        </div>
        <div>
          <label htmlFor="author" className="mb-1 block text-sm font-medium text-stone-700">
            Author
          </label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="Author name"
          />
        </div>
        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium text-stone-700">
            Tags
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="fiction, classic (comma separated)"
          />
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-stone-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookStatus)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          >
            {(Object.keys(BOOK_STATUS_LABELS) as BookStatus[]).map((key) => (
              <option key={key} value={key}>
                {BOOK_STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800 disabled:opacity-60"
        >
          {loading ? "Saving..." : initialBook ? "Update book" : "Add book"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
