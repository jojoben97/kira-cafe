"use client";

import { ArrowRight } from "lucide-react";
import DrinkCard from "./DrinkCard";

const featuredDrinks = [
  {
    name: "Caramel Latte",
    description: "Espresso, steamed milk, caramel",
    price: "$4.50",
    image: "https://images.unsplash.com/photo-1613980355287-c78745d4dca2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTExNDd8&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Matcha Oat",
    description: "Premium matcha, oat milk, vanilla",
    price: "$5.00",
    image: "https://images.unsplash.com/photo-1569784603252-c4c962da5b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTExNDd8&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Iced Americano",
    description: "Double shot, cold water, ice",
    price: "$3.50",
    image: "https://images.unsplash.com/photo-1527156231393-7023794f363c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTExNDh8&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export default function FeaturedSection() {
  return (
    <section className="flex flex-col gap-12 bg-white py-20 px-20 w-full">
      {/* Section Header */}
      <div className="flex items-end justify-between w-full">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-[var(--kira-green)] tracking-[2px] uppercase">
            Popular Picks
          </span>
          <h2 className="text-[36px] font-semibold text-[var(--kira-text)]">
            Customer favorites
          </h2>
        </div>
        <a
          href="#menu"
          className="flex items-center gap-1.5 text-[15px] font-medium text-[var(--kira-green)] hover:opacity-80 transition-opacity"
        >
          View full menu
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Drinks Grid */}
      <div className="flex gap-6 w-full">
        {featuredDrinks.map((drink) => (
          <DrinkCard
            key={drink.name}
            name={drink.name}
            description={drink.description}
            price={drink.price}
            image={drink.image}
          />
        ))}
      </div>
    </section>
  );
}
