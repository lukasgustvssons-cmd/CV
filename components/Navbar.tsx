"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <div className="text-lg font-semibold">TailorCV</div>

      <div className="flex flex-col items-end gap-2">
        {!isLoaded ? null : isSignedIn ? (
          <UserButton />
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
                Logga in
              </button>
            </SignInButton>

            <p className="max-w-[240px] text-right text-[11px] leading-4 text-slate-500">
              Genom att fortsätta godkänner du våra{" "}
              <a href="/terms" className="underline hover:text-slate-900">
                användarvillkor
              </a>{" "}
              och vår{" "}
              <a href="/privacy" className="underline hover:text-slate-900">
                integritetspolicy
              </a>.
            </p>
          </>
        )}
      </div>
    </nav>
  );
}