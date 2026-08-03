"use client";

import type { BookStatus } from "@/types";
import { BOOK_STATUS_EMOJI, BOOK_STATUS_LABELS } from "@/types";

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
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onStatusChange("")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            !statusFilter
              ? "bg-stone-900 text-white shadow-md"
              : "bg-white/80 text-stone-600 hover:bg-white"
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === s.value
                ? "bg-amber-700 text-white shadow-md shadow-amber-900/20"
                : "bg-white/80 text-stone-600 hover:bg-white"
            }`}
          >
            {BOOK_STATUS_EMOJI[s.value]} {s.label}
          </button>
        ))}
      </div>

      {allTags.length > 0 && (
        <select
          value={tagFilter}
          onChange={(e) => onTagChange(e.target.value)}
          className="rounded-full border border-stone-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-stone-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          aria-label="Filter by tag"
        >
          <option value="">All tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
      )}

      {hasFilters && (
        <button
          onClick={onClear}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-50"
        >
          Clear
        </button>
      )}
    </div>
  );
}
