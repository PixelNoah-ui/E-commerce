"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import MobileNavbar from "./MobileNav";
import dynamic from "next/dynamic";
import { buildApiUrl } from "@/lib/auth";
import { logout as apiLogout } from "@/app/(api)/auth";

const CartSheet = dynamic(() => import("@/components/cart/CartSheet"), {
  ssr: false,
});

export default function MainNav() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(buildApiUrl("/auth/me"), {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        setAuthenticated(res.ok);
      } catch {
        setAuthenticated(false);
      }
    };

    void checkAuth();
  }, []);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore
    }
    setAuthenticated(false);
    router.push("/auth");
    router.refresh();
  };

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "Equipments", href: "/equipments" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    ...(authenticated ? [{ title: "My Orders", href: "/orders" }] : []),
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
          {authenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:bg-primary hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:bg-primary hover:text-white"
            >
              Sign in
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <CartSheet />
          <MobileNavbar />
        </div>
      </div>
    </div>
  );
}
