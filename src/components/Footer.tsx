"use client";

import { Coffee, Instagram, Twitter } from "lucide-react";

const footerLinks = {
  menu: {
    title: "Menu",
    links: ["Coffee", "Tea", "Smoothies", "Pastries"],
  },
  company: {
    title: "Company",
    links: ["About Us", "Locations", "Careers"],
  },
  support: {
    title: "Support",
    links: ["Help Center", "Contact", "Privacy Policy"],
  },
};

export default function Footer() {
  return (
    <footer className="flex flex-col gap-10 bg-[var(--kira-dark)] pt-[60px] pb-10 px-20 w-full">
      {/* Footer Main */}
      <div className="flex justify-between w-full">
        {/* Brand */}
        <div className="flex flex-col gap-4 w-[300px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Coffee className="w-7 h-7 text-[var(--kira-green)]" />
            <span className="text-[22px] font-bold text-white">KIRA Cafe</span>
          </div>
          <p className="text-[14px] text-[var(--kira-text-muted)] leading-[1.6]">
            Your perfect cup, ready when you are. Skip the line and order ahead for pickup.
          </p>
          {/* Socials */}
          <div className="flex gap-3">
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 bg-[var(--kira-footer-divider)] rounded-[10px] hover:bg-[var(--kira-green)] transition-colors"
            >
              <Instagram className="w-[18px] h-[18px] text-white" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 bg-[var(--kira-footer-divider)] rounded-[10px] hover:bg-[var(--kira-green)] transition-colors"
            >
              <Twitter className="w-[18px] h-[18px] text-white" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-20">
          {Object.values(footerLinks).map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h4 className="text-[14px] font-semibold text-white">{column.title}</h4>
              {column.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[14px] text-[var(--kira-text-muted)] hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[var(--kira-footer-divider)]" />

      {/* Footer Bottom */}
      <div className="flex items-center justify-between w-full">
        <span className="text-[13px] text-[var(--kira-text-secondary)]">
          © 2025 KIRA Cafe. All rights reserved.
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-white bg-[var(--kira-green)] py-1.5 px-3 rounded-md">
            KIRA Pay
          </span>
          <span className="text-[13px] text-[var(--kira-text-secondary)]">Accepted</span>
        </div>
      </div>
    </footer>
  );
}
