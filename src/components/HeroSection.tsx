"use client";

import { Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="flex items-center gap-[60px] h-[600px] px-20 w-full">
      {/* Hero Content */}
      <div className="flex flex-col gap-8 flex-1">
        {/* Badge */}
        <div className="flex items-center gap-2 bg-[var(--kira-green-light)] text-[var(--kira-green)] py-2 px-4 rounded-full w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[13px] font-medium">Pickup-only cafe ordering</span>
        </div>

        {/* Headline */}
        <h1 className="text-[56px] font-bold text-[var(--kira-text)] leading-[1.1]">
          Your perfect cup,<br />ready when you are.
        </h1>

        {/* Subline */}
        <p className="text-[20px] text-[var(--kira-text-secondary)] leading-[1.5]">
          Skip the line. Order ahead, customize your drink,<br />and pick up in minutes.
        </p>

        {/* CTA Group */}
        <div className="flex items-center gap-4">
          <Link href="/order" className="flex items-center gap-2.5 bg-[var(--kira-green)] text-white text-[16px] font-semibold py-[18px] px-9 rounded-full shadow-[0_4px_20px_rgba(45,90,61,0.25)] hover:opacity-90 transition-opacity">
            Start Ordering
          </Link>
          <button className="flex items-center gap-2 bg-transparent text-[var(--kira-text-secondary)] text-[16px] font-medium py-[18px] px-9 rounded-full border border-[var(--kira-border-light)] hover:border-[var(--kira-green)] hover:text-[var(--kira-green)] transition-colors">
            <MapPin className="w-4 h-4" />
            Find a location
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-[520px] h-[520px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <Image
          src="https://images.unsplash.com/photo-1648064803723-bdcc7b8d7dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTExMTB8&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Coffee being poured"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
