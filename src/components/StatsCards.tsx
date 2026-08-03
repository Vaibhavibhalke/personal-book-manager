import type { Book, BookStatus } from "@/types";
import { BOOK_STATUS_EMOJI, BOOK_STATUS_LABELS } from "@/types";

interface StatsCardsProps {
  books: Book[];
}

const cardStyles: Record<
  string,
  { gradient: string; glow: string; accent: string }
> = {
  "Total Books": {
    gradient: "from-stone-900 to-stone-700",
    glow: "shadow-stone-900/20",
    accent: "text-amber-300",
  },
  [BOOK_STATUS_LABELS["want-to-read"]]: {
    gradient: "from-blue-600 to-indigo-700",
    glow: "shadow-blue-900/20",
    accent: "text-blue-100",
  },
  [BOOK_STATUS_LABELS.reading]: {
    gradient: "from-amber-500 to-orange-700",
    glow: "shadow-amber-900/20",
    accent: "text-amber-100",
  },
  [BOOK_STATUS_LABELS.completed]: {
    gradient: "from-emerald-600 to-teal-700",
    glow: "shadow-emerald-900/20",
    accent: "text-emerald-100",
  },
};

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
      {stats.map((stat, index) => {
        const style = cardStyles[stat.label];
        return (
          <div
            key={stat.label}
            className={`animate-float-in relative overflow-hidden rounded-3xl bg-gradient-to-br ${style.gradient} p-5 text-white shadow-xl ${style.glow}`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${style.accent}`}>
                  {stat.label}
                </span>
                <span className="text-2xl" aria-hidden="true">
                  {stat.emoji}
                </span>
              </div>
              <p className="mt-4 font-serif text-4xl font-semibold">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
