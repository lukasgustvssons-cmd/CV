"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
      <div className="font-semibold text-lg">TailorCV</div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
              Logga in
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}