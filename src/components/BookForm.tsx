"use client";

import { FormEvent, useState } from "react";
import type { Book, BookStatus } from "@/types";
import { BOOK_STATUS_EMOJI, BOOK_STATUS_LABELS } from "@/types";

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
    <form onSubmit={handleSubmit} className="glass-card-strong rounded-3xl p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700/80">
            {initialBook ? "Update entry" : "New addition"}
          </p>
          <h3 className="section-title mt-1 text-2xl font-semibold text-stone-900">
            {initialBook ? "Edit book" : "Add a new book"}
          </h3>
        </div>
        <div className="hidden rounded-2xl bg-amber-50 px-3 py-2 text-2xl sm:block">
          ✍️
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-stone-700">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field text-sm"
            placeholder="Book title"
          />
        </div>
        <div>
          <label htmlFor="author" className="mb-1.5 block text-sm font-semibold text-stone-700">
            Author
          </label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="input-field text-sm"
            placeholder="Author name"
          />
        </div>
        <div>
          <label htmlFor="tags" className="mb-1.5 block text-sm font-semibold text-stone-700">
            Tags
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input-field text-sm"
            placeholder="fiction, classic"
          />
        </div>
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-semibold text-stone-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookStatus)}
            className="input-field text-sm"
          >
            {(Object.keys(BOOK_STATUS_LABELS) as BookStatus[]).map((key) => (
              <option key={key} value={key}>
                {BOOK_STATUS_EMOJI[key]} {BOOK_STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="submit" disabled={loading} className="btn-primary text-sm">
          {loading ? "Saving..." : initialBook ? "Update book" : "Add to shelf"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary text-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
