"use client";

import type { BookStatus } from "@/types";
import { BOOK_STATUS_LABELS } from "@/types";

interface FilterBarProps {
  statusFilter: string;
  tagFilter: string;
  allTags: string[];
  onStatusChange: (status: string) => void;
  onTagChange: (tag: string) => void;
  onClear: () => void;
}

const statuses: { value: BookStatus; label: string }[] = [
  { value: "want-to-read", label: BOOK_STATUS_LABELS["want-to-read"] },
  { value: "reading", label: BOOK_STATUS_LABELS.reading },
  { value: "completed", label: BOOK_STATUS_LABELS.completed },
];

export default function FilterBar({
  statusFilter,
  tagFilter,
  allTags,
  onStatusChange,
  onTagChange,
  onClear,
}: FilterBarProps) {
  const hasFilters = statusFilter || tagFilter;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        value={tagFilter}
        onChange={(e) => onTagChange(e.target.value)}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        aria-label="Filter by tag"
      >
        <option value="">All tags</option>
        {allTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={onClear}
          className="text-sm font-medium text-amber-800 hover:text-amber-900"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
