"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const initial = user.name.trim().charAt(0).toUpperCase();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-800 text-xl shadow-md shadow-amber-900/15 transition group-hover:scale-105">
            📚
          </div>
          <div>
            <span className="section-title block text-lg font-semibold text-stone-900 transition group-hover:text-amber-900">
              Book Manager
            </span>
            <span className="text-xs uppercase tracking-[0.22em] text-stone-400">
              Your reading shelf
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden items-center gap-3 rounded-full border border-stone-200/80 bg-white/80 px-3 py-1.5 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-sm font-bold text-white">
              {initial}
            </div>
            <span className="text-sm text-stone-600">
              <span className="font-semibold text-stone-800">{user.name}</span>
            </span>
          </div>
          <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
