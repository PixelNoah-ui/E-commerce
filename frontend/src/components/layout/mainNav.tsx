"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

import Logo from "./Logo";
import MobileNavbar from "./MobileNav";

import { Button } from "@/components/ui/button";
import { User } from "@/types/Types";
import UserDropdown from "../UserDropdown";

const CartSheet = dynamic(() => import("@/components/cart/CartSheet"), {
  ssr: false,
});

interface MainNavProps {
  user: User | null;
}

export default function MainNav({ user }: MainNavProps) {
  const pathname = usePathname();

  const navItems = [
    { title: "Home", href: "/" },
    { title: "Electronics", href: "/electronics" },
    { title: "Equipments", href: "/equipments" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-primary"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right */}
        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <Link href="/contact">
            <Button variant="outline">Sell with us</Button>
          </Link>

          <CartSheet />

          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        {/* Tablet */}
        <div className="ml-auto hidden items-center gap-3 md:flex lg:hidden">
          <CartSheet />

          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link href="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="ml-auto lg:hidden">
          <MobileNavbar user={user} />
        </div>
      </div>
    </header>
  );
}
