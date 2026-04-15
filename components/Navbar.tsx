"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <div className="text-lg font-semibold">TailorCV</div>

      <div className="flex items-center gap-4">
        {!isLoaded ? null : isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
              Logga in
            </button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}