import type { Book, BookStatus } from "@/types";
import { BOOK_STATUS_EMOJI, BOOK_STATUS_LABELS } from "@/types";

interface StatsCardsProps {
  books: Book[];
}

export default function StatsCards({ books }: StatsCardsProps) {
  const total = books.length;
  const byStatus = (status: BookStatus) =>
    books.filter((b) => b.status === status).length;

  const stats = [
    { label: "Total Books", value: total, emoji: "📚" },
    {
      label: BOOK_STATUS_LABELS["want-to-read"],
      value: byStatus("want-to-read"),
      emoji: BOOK_STATUS_EMOJI["want-to-read"],
    },
    {
      label: BOOK_STATUS_LABELS.reading,
      value: byStatus("reading"),
      emoji: BOOK_STATUS_EMOJI.reading,
    },
    {
      label: BOOK_STATUS_LABELS.completed,
      value: byStatus("completed"),
      emoji: BOOK_STATUS_EMOJI.completed,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-stone-500">
            <span aria-hidden="true">{stat.emoji}</span>
            <span className="text-sm">{stat.label}</span>
          </div>
          <p className="mt-2 font-serif text-3xl font-semibold text-stone-800">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
