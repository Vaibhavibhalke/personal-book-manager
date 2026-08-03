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
    <div className="page-bg min-h-full">
      <Navbar user={user} />

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="animate-float-in mb-8 overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-r from-stone-900 via-amber-900 to-orange-900 p-8 text-white shadow-2xl shadow-stone-900/20">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/80">
              Dashboard
            </p>
            <h1 className="section-title mt-3 text-4xl font-semibold sm:text-5xl">
              Your Reading Shelf
            </h1>
            <p className="mt-3 text-base text-amber-100/85 sm:text-lg">
              Welcome back, {user.name.split(" ")[0]}. Track what you want to
              read, what you&apos;re reading, and what you&apos;ve finished.
            </p>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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

          <div className="glass-card rounded-3xl p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                  Collection
                </p>
                <h2 className="section-title mt-1 text-2xl font-semibold text-stone-900">
                  Your Books
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  {filteredBooks.length} of {books.length} books shown
                </p>
              </div>
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
              <div className="mt-6 rounded-[1.75rem] border border-dashed border-stone-300/80 bg-white/60 py-16 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-4xl">
                  📖
                </div>
                <p className="mt-4 font-serif text-xl font-semibold text-stone-800">
                  {books.length === 0 ? "Your shelf is waiting" : "No books match your filters"}
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  {books.length === 0
                    ? "Add your first book above to start building your collection."
                    : "Try adjusting your filters to see more books."}
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredBooks.map((book, index) => (
                  <div
                    key={book._id}
                    className="animate-float-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <BookCard
                      book={book}
                      onEdit={setEditingBook}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
