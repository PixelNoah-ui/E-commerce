"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import MobileNavbar from "./MobileNav";

export default function MainNav() {
  const pathname = usePathname(); // current route

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "Equipments", href: "/equipments" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <div className="w-full bg-white py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* LOGO */}
        <Logo />

        {/* NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => {
            const isActive = pathname === item.href; // check if current page
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/contact"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:bg-primary hover:text-white"
          >
            Sell with us
          </Link>
        </div>

        <MobileNavbar />
      </div>
    </div>
  );
}
