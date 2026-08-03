import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="page-bg flex min-h-full">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_30%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-amber-50">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">
              Personal Library
            </p>
            <h1 className="mt-6 max-w-md font-serif text-5xl font-semibold leading-tight">
              Every great story deserves a place on your shelf.
            </h1>
            <p className="mt-5 max-w-sm text-lg text-amber-100/85">
              Organize your reading life with clarity, warmth, and a dashboard
              that feels made just for you.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Track", value: "Statuses" },
              { label: "Tag", value: "Genres" },
              { label: "Grow", value: "Your list" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-wider text-amber-200/70">
                  {item.label}
                </p>
                <p className="mt-1 font-serif text-xl">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
