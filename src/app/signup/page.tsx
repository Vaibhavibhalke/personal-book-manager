import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <AuthForm mode="signup" />
    </div>
  );
}
