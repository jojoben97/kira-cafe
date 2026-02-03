"use client";

import Image from "next/image";

const stats = [
  { value: "2019", label: "Founded" },
  { value: "50K+", label: "Cups served" },
  { value: "4.9★", label: "Customer rating" },
];

export default function AboutSection() {
  return (
    <section id="about" className="flex items-center gap-20 bg-white py-[100px] px-20 w-full">
      {/* About Image */}
      <div className="relative w-[560px] h-[480px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex-shrink-0">
        <Image
          src="https://images.unsplash.com/photo-1769986824680-9dcce061dde2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0NDh8&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Barista crafting coffee"
          fill
          className="object-cover"
        />
      </div>

      {/* About Content */}
      <div className="flex flex-col gap-6 flex-1">
        <span className="text-[12px] font-semibold text-[var(--kira-green)] tracking-[2px] uppercase">
          Our Story
        </span>
        <h2 className="text-[40px] font-semibold text-[var(--kira-text)] leading-[1.2]">
          Crafted with passion,<br />served with love
        </h2>
        <p className="text-[17px] text-[var(--kira-text-secondary)] leading-[1.7] max-w-[480px]">
          KIRA Cafe was born from a simple belief: everyone deserves a perfectly crafted cup of coffee without the wait. We source our beans from sustainable farms, roast them in small batches, and train our baristas to bring out the best in every drink.
        </p>

        {/* Stats */}
        <div className="flex gap-12 mt-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-[36px] font-bold text-[var(--kira-green)]">{stat.value}</span>
              <span className="text-[14px] text-[var(--kira-text-muted)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
