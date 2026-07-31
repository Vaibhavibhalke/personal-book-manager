"use client";

import { useMemo, useState } from "react";
import type { Book, BookStatus, User } from "@/types";
import Navbar from "./Navbar";
import StatsCards from "./StatsCards";
import FilterBar from "./FilterBar";
import BookForm from "./BookForm";
import BookCard from "./BookCard";

interface DashboardProps {
  user: User;
  initialBooks: Book[];
}

export default function Dashboard({ user, initialBooks }: DashboardProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [error, setError] = useState("");

  async function refreshBooks() {
    setError("");
    try {
      const res = await fetch("/api/books");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to load books");
        return;
      }

      setBooks(data.books);
    } catch {
      setError("Failed to load books");
    }
  }

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    books.forEach((book) => book.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (statusFilter && book.status !== statusFilter) return false;
      if (tagFilter && !book.tags.includes(tagFilter)) return false;
      return true;
    });
  }, [books, statusFilter, tagFilter]);

  async function handleAddOrUpdate(data: {
    title: string;
    author: string;
    tags: string;
    status: BookStatus;
  }) {
    const url = editingBook ? `/api/books/${editingBook._id}` : "/api/books";
    const method = editingBook ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to save book");
      return;
    }

    setEditingBook(null);
    await refreshBooks();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this book from your collection?")) return;

    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete book");
      return;
    }

    if (editingBook?._id === id) setEditingBook(null);
    await refreshBooks();
  }

  async function handleStatusChange(id: string, status: BookStatus) {
    const res = await fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setError("Failed to update status");
      return;
    }

    await refreshBooks();
  }

  return (
    <div className="min-h-full bg-stone-50">
      <Navbar user={user} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold text-stone-800">
            Your Reading Shelf
          </h1>
          <p className="mt-1 text-stone-500">
            Track what you want to read, what you&apos;re reading, and what
            you&apos;ve finished.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <StatsCards books={books} />

        <div className="mt-8 space-y-6">
          <BookForm
            key={editingBook?._id ?? "new"}
            onSubmit={handleAddOrUpdate}
            initialBook={editingBook}
            onCancel={editingBook ? () => setEditingBook(null) : undefined}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-xl font-semibold text-stone-800">
              Your Books
            </h2>
            <FilterBar
              statusFilter={statusFilter}
              tagFilter={tagFilter}
              allTags={allTags}
              onStatusChange={setStatusFilter}
              onTagChange={setTagFilter}
              onClear={() => {
                setStatusFilter("");
                setTagFilter("");
              }}
            />
          </div>

          {filteredBooks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
              <span className="text-4xl" aria-hidden="true">
                📖
              </span>
              <p className="mt-3 font-medium text-stone-700">
                {books.length === 0 ? "No books yet" : "No books match your filters"}
              </p>
              <p className="mt-1 text-sm text-stone-500">
                {books.length === 0
                  ? "Add your first book above to start building your collection."
                  : "Try adjusting your filters to see more books."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onEdit={setEditingBook}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
