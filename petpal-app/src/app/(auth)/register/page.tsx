"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

type Role = "owner" | "provider";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole: Role = searchParams.get("role") === "provider" ? "provider" : "owner";

  const [role, setRole] = useState<Role>(defaultRole);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    localStorage.setItem("petpal_auth", JSON.stringify({ role, name: form.name || form.email.split("@")[0] }));
    router.push(role === "provider" ? "/provider" : "/dashboard");
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 sm:p-10 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-500 text-sm mt-1">Join PetPal AI and connect with great carers</p>
      </div>

      {/* Role Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => setRole("owner")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            role === "owner"
              ? "bg-white text-amber-500 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🐶 Pet Owner
        </button>
        <button
          type="button"
          onClick={() => setRole("provider")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            role === "provider"
              ? "bg-white text-amber-500 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🏠 Care Provider
        </button>
      </div>

      {role === "provider" && (
        <div className="bg-amber-50 text-amber-700 text-xs px-4 py-3 rounded-xl mb-5 border border-amber-100">
          As a care provider you&apos;ll complete identity verification and property photos after sign-up.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Min. 8 characters"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
          />
        </div>

        {/* Password strength indicator */}
        {form.password && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    form.password.length >= n * 3
                      ? form.password.length >= 12 ? "bg-green-400" : "bg-amber-400"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">
              {form.password.length < 8
                ? "Too short"
                : form.password.length < 12
                ? "Good password"
                : "Strong password"}
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 pt-1">
          <input
            id="terms"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
          />
          <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
            I agree to PetPal AI&apos;s{" "}
            <Link href="#" className="text-amber-500 hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="text-amber-500 hover:underline">Privacy Policy</Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creating account…
            </>
          ) : (
            `Create ${role === "owner" ? "Pet Owner" : "Provider"} Account`
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">or sign up with</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-amber-500 font-semibold hover:text-amber-600">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-50 to-white flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold text-amber-500">PetPal AI</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <Suspense fallback={<div className="text-gray-400 text-sm">Loading…</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
