"use client";

import { Coffee } from "lucide-react";
import Link from "next/link";

export default function Header() {

  return (
    <>
      <header className="flex items-center justify-between h-20 px-4 md:px-20 w-full bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[var(--kira-border)]/50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Coffee className="w-8 h-8 text-[var(--kira-green)]" />
          <span className="text-[28px] font-bold text-[var(--kira-text)]">KIRA</span>
          <span className="text-[28px] font-light text-[var(--kira-text)]">Cafe</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            <a href="/#menu" className="text-[15px] font-medium text-[var(--kira-text-secondary)] hover:text-[var(--kira-green)] transition-colors">
              Menu
            </a>
            <a href="/#about" className="text-[15px] font-medium text-[var(--kira-text-secondary)] hover:text-[var(--kira-green)] transition-colors">
              About
            </a>
            <a href="/#locations" className="text-[15px] font-medium text-[var(--kira-text-secondary)] hover:text-[var(--kira-green)] transition-colors">
              Locations
            </a>
          </div>

          <Link href="/order" className="hidden md:flex bg-[var(--kira-green)] text-white text-[15px] font-semibold py-2.5 px-6 rounded-full hover:bg-[#004d40] transition-colors">
            Order Now
          </Link>
        </nav>
      </header>
    </>
  );
}
