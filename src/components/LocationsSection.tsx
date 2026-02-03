"use client";

import { MapPin, Clock, Navigation } from "lucide-react";
import Image from "next/image";

const locations = [
  {
    name: "KIRA Main Street",
    address: "123 Main Street, Downtown",
    hours: "7:00 AM - 8:00 PM",
    image: "https://images.unsplash.com/photo-1671197346433-a0bb59327ac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0OTh8&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "KIRA Riverside",
    address: "456 River Walk, Waterfront",
    hours: "6:30 AM - 9:00 PM",
    image: "https://images.unsplash.com/photo-1760307145149-b3b17365ac6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0OTh8&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "KIRA Tech Park",
    address: "789 Innovation Blvd, Tech Park",
    hours: "6:00 AM - 7:00 PM",
    image: "https://images.unsplash.com/photo-1768578927231-6f5d42d8c647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0OTl8&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

interface LocationCardProps {
  name: string;
  address: string;
  hours: string;
  image: string;
}

function LocationCard({ name, address, hours, image }: LocationCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden flex-1">
      {/* Image */}
      <div className="relative w-full h-[180px]">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6">
        <h3 className="text-[20px] font-semibold text-[var(--kira-text)]">{name}</h3>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[var(--kira-text-muted)]" />
            <span className="text-[14px] text-[var(--kira-text-secondary)]">{address}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[var(--kira-text-muted)]" />
            <span className="text-[14px] text-[var(--kira-text-secondary)]">{hours}</span>
          </div>
        </div>

        {/* Directions Button */}
        <button className="flex items-center justify-center gap-2 h-11 w-full rounded-[10px] border border-[var(--kira-green)] text-[var(--kira-green)] text-[14px] font-semibold hover:bg-[var(--kira-green)] hover:text-white transition-colors">
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>
      </div>
    </div>
  );
}

export default function LocationsSection() {
  return (
    <section id="locations" className="flex flex-col gap-12 bg-[#F5F3F0] py-20 px-20 w-full">
      {/* Section Header */}
      <div className="flex items-end justify-between w-full">
        <div className="flex flex-col gap-3">
          <span className="text-[12px] font-semibold text-[var(--kira-green)] tracking-[2px] uppercase">
            Find Us
          </span>
          <h2 className="text-[40px] font-semibold text-[var(--kira-text)]">
            Our locations
          </h2>
          <p className="text-[18px] text-[var(--kira-text-secondary)]">
            Visit us at any of our convenient cafe locations
          </p>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="flex gap-6 w-full">
        {locations.map((location) => (
          <LocationCard key={location.name} {...location} />
        ))}
      </div>
    </section>
  );
}
