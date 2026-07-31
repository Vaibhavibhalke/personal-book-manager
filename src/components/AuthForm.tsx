"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const body = isSignup ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="text-4xl" aria-hidden="true">
          📚
        </span>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-stone-800">
          {isSignup ? "Create your shelf" : "Welcome back"}
        </h1>
        <p className="mt-2 text-stone-500">
          {isSignup
            ? "Start tracking the books that matter to you."
            : "Sign in to continue your reading journey."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isSignup && (
          <div className="mb-4">
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Your name"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-stone-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-700 px-4 py-2.5 font-medium text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-medium text-amber-800 hover:text-amber-900"
        >
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
