"use client";

import { Dispatch, SetStateAction } from "react";
import { Lang } from "@/lib/translations";

type NavbarProps = {
  lang: Lang;
  setLang: Dispatch<SetStateAction<Lang>>;
  nav: {
    features: string;
    howItWorks: string;
    pricing: string;
  };
};

export function Navbar({ lang, setLang, nav }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between p-6">
      <div className="font-semibold">TailorCV</div>

      <div className="flex gap-6">
        <a href="#features">{nav.features}</a>
        <a href="#how-it-works">{nav.howItWorks}</a>
        <a href="#pricing">{nav.pricing}</a>
      </div>

      <button
        onClick={() => setLang(lang === "en" ? "sv" : "en")}
        className="text-sm"
      >
        {lang === "en" ? "SV" : "EN"}
      </button>
    </nav>
  );
}