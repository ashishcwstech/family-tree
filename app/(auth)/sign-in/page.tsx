"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SignupForm = z.infer<typeof signInSchema>;

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 chars"),
});

export default function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignupForm) => {
    console.log("Signup Data:", data);
    router.push("/family/dashboard");
  };

  return (
    <div className="text-on-background min-h-screen flex items-center justify-center p-4 sm:p-6 bg-surface relative">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-20 blur-sm scale-105"
            src="/images/tree.png"
          />
        </div>
        <main className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-on-background mb-2">
              The Ancestral Tapestry
            </h1>

            <p className="text-on-surface-variant font-medium tracking-wide text-xs sm:text-sm opacity-80">
              PREMIUM GENEALOGY ARCHIVE
            </p>
          </div>

          <div className="glass-panel rounded-xl p-5 sm:p-6 md:p-8 shadow-lg ghost-border">
            <div className="mb-6 sm:mb-8">
              <h2 className="font-headline text-lg sm:text-xl font-bold text-on-background mb-1">
                Welcome Back
              </h2>
              <p className="text-on-surface-variant text-xs sm:text-sm">
                Continue your family's story.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant ml-1">
                  Email Address
                </label>
                <input
                  className="w-full h-11 sm:h-12 px-4 rounded-lg bg-surface-container-low focus:ring-2 focus:ring-primary text-sm"
                  placeholder="name@example.com"
                  type="email"
                  {...register("email")}
                />
                <p className="text-red-500 text-sm">
                  {errors.email?.message}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Password
                  </label>
                  <a className="text-xs font-semibold text-primary hover:text-primary-dim cursor-pointer">
                    Forgot?
                  </a>
                </div>
                <input
                  className="w-full h-11 sm:h-12 px-4 rounded-lg bg-surface-container-low focus:ring-2 focus:ring-primary text-sm"
                  placeholder="••••••••"
                  type="password"
                  {...register("password")}
                />
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              </div>

              <button className="w-full h-12 sm:h-14 primary text-on-primary font-bold rounded-lg flex items-center justify-center gap-2 
                      transition-all duration-300 ease-out 
                      hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-[0.98]">
                Sign In
                <span className="material-symbols-outlined text-lg sm:text-xl transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </form>

            <div className="relative my-6 sm:my-8 flex items-center">
              <div className="flex-grow border-t border-outline-variant/20"></div>
              <span className="mx-3 text-[10px] sm:text-xs font-semibold text-outline-variant uppercase">
                Or continue with
              </span>
              <div className="flex-grow border-t border-outline-variant/20"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button className="h-11 sm:h-12 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low flex items-center justify-center gap-2 text-sm font-semibold">
                <img
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  src="/google-logo.png"
                />
                Google
              </button>

              <button className="h-11 sm:h-12 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low flex items-center justify-center gap-2 text-sm font-semibold">
                <img
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  src="/icloud.png"
                />
                iCloud
              </button>
            </div>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-on-surface-variant text-xs sm:text-sm">
              New here?
              <Link   href="/sign-up" className="text-primary font-bold ml-1 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </main>
    </div>
  );
}
