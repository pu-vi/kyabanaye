"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FiCalendar, FiBookOpen, FiShare2, FiArrowRight, FiArrowLeft } from "react-icons/fi";

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
      // On success, useEffect will handle redirection
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "Failed to authenticate with Google. Please try again."
      );
      setSigningIn(false);
    }
  };

  const showLoading = authLoading || signingIn;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 overflow-hidden">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white active:scale-95 border border-slate-200/80 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-sm"
        >
          <FiArrowLeft size={16} className="text-slate-500" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-100/40 blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-100/30 blur-3xl -z-10" />

      <div className="w-full max-w-5xl grid md:grid-cols-12 gap-8 items-center bg-white/70 backdrop-blur-md rounded-3xl border border-slate-100 p-6 md:p-12 shadow-2xl">
        {/* Branding & Features Section */}
        <div className="md:col-span-7 space-y-8 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-slate-200/60 pb-8 md:pb-0">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80">
              🍎 Kyabana Ye Meal Planner
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 leading-tight">
              What are we <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                eating today?
              </span>
            </h1>
            <p className="text-slate-600 text-base max-w-md">
              A premium, simple, and shared meal planning experience for families, couples, and health enthusiasts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm">
                <FiCalendar size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Weekly Organiser</h3>
                <p className="text-xs text-slate-500 max-w-sm">Plan your breakfast, lunch, snack, and dinner in seconds.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shadow-sm">
                <FiBookOpen size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Custom Recipe Vault</h3>
                <p className="text-xs text-slate-500 max-w-sm">Save your favorite dishes, ingredients list, and custom preparations.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                <FiShare2 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Shared Family Syncing</h3>
                <p className="text-xs text-slate-500 max-w-sm">Share meal calendars with partners so everyone is on the same page.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Form Section */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500">Sign in to sync your meal plans and dishes</p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 text-left">
              {error}
            </div>
          )}

          {showLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="relative w-16 h-16">
                {/* Glowing spinner ring */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin" />
              </div>
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Signing you in safely...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 rounded-2xl text-base font-semibold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <FcGoogle size={24} />
                <span>Continue with Google</span>
                <FiArrowRight size={18} className="text-slate-400 ml-auto" />
              </button>

              <p className="text-[11px] text-center text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                By logging in, you agree to store your profile email and name to sync your healthy eating scheduler.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
