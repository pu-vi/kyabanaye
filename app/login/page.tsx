"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { user, dbUser, signInWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Redirect to home if already logged in
  useEffect(() => {
    if (user && dbUser) {
      router.replace("/");
    }
  }, [user, dbUser, router]);

  const handleLogin = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to authenticate with Google. Please try again.";
      setError(errorMessage);
      setSigningIn(false);
    }
  };

  const showLoading = authLoading || signingIn;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/60 p-8 sm:p-12 shadow-xl text-center space-y-8">
        <div className="space-y-4">
          {/* Logo instead of hardcoded app name */}
          <img
            src="/logo.png"
            alt="Plate Slate"
            className="mx-auto h-20 sm:h-24 w-auto object-contain animate-fade-in"
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Welcome to Plate Slate
          </h1>
          <p className="text-sm font-semibold text-emerald-600">
            Socho kam, khao zyada
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-600 text-left">
            {error}
          </div>
        )}

        {showLoading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-400 animate-pulse">
              Signing in...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FcGoogle size={20} />
              <span>Sign in with Google</span>
            </button>

            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[280px] mx-auto">
              Syncs your recipes, meal planners, and shopping list across all your devices securely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
