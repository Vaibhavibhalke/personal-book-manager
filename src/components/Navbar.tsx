"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="group flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            📚
          </span>
          <span className="font-serif text-xl font-semibold text-stone-800 group-hover:text-amber-800 transition-colors">
            Personal Book Manager
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-stone-500 sm:inline">
            Hello, <span className="font-medium text-stone-700">{user.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
