"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="border-b border-slate-200">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="shrink-0 text-base font-semibold text-slate-900 sm:text-lg"
        >
          Hireon
        </a>

        {!isLoaded ? null : isSignedIn ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/dashboard"
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900 hover:underline"
            >
              Dashboard
            </a>
            <UserButton />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-[11px] leading-4 text-slate-500 sm:block sm:max-w-[240px]">
              Genom att fortsätta godkänner du våra{" "}
              <a href="/terms" className="underline hover:text-slate-900">
                användarvillkor
              </a>{" "}
              och vår{" "}
              <a href="/privacy" className="underline hover:text-slate-900">
                integritetspolicy
              </a>
              .
            </div>

            <SignInButton mode="modal">
              <button className="whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                Logga in
              </button>
            </SignInButton>
          </div>
        )}
      </div>

      {!isLoaded || isSignedIn ? null : (
        <div className="border-t border-slate-100 px-4 py-2 sm:hidden">
          <p className="text-[11px] leading-4 text-slate-500">
            Genom att fortsätta godkänner du våra{" "}
            <a href="/terms" className="underline hover:text-slate-900">
              användarvillkor
            </a>{" "}
            och vår{" "}
            <a href="/privacy" className="underline hover:text-slate-900">
              integritetspolicy
            </a>
            .
          </p>
        </div>
      )}
    </nav>
  );
}