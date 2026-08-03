import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="page-bg flex min-h-full">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-900 to-orange-900" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),transparent_28%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-amber-50">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">
              Start Fresh
            </p>
            <h1 className="mt-6 max-w-md font-serif text-5xl font-semibold leading-tight">
              Build a reading space you&apos;ll actually want to open.
            </h1>
            <p className="mt-5 max-w-sm text-lg text-amber-100/85">
              Save books, track progress, and filter your collection without
              the clutter.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
            <p className="font-serif text-2xl">&ldquo;Simple can be harder than complex.&rdquo;</p>
            <p className="mt-3 text-sm text-amber-100/75">
              A quiet, elegant tool for readers who care about the details.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
