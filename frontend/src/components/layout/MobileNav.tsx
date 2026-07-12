"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { logout as apiLogout } from "@/app/(api)/auth";
import { Button } from "@/components/ui/button";
import { User } from "@/types/Types";

interface MobileNavbarProps {
  user: User | null;
}

export default function MobileNavbar({ user }: MobileNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const authenticated = !!user;

  const mainMenuItems = [
    { title: "Home", href: "/" },
    { title: "Electronics", href: "/electronics" },
    { title: "Equipments", href: "/equipments" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  const accountMenuItems = [
    {
      title: "Profile",
      href: "/profile/address",
    },
    {
      title: "My Orders",
      href: "/orders",
    },
    {
      title: "Settings",
      href: "/profile/settings",
    },
  ];

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await apiLogout();

      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="rounded-lg p-2 transition hover:bg-slate-100">
            <Menu size={24} className="text-slate-700" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-[85%] max-w-sm flex-col p-0"
        >
          {/* Header */}
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/icons/logo.svg"
                    alt="Meqdii Electronics"
                    width={34}
                    height={34}
                  />

                  <span className="font-bold text-primary">MEQDII</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
          </div>

          {/* Logged in user */}
          {authenticated && (
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Signed in as
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {user.fullName}
              </p>

              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>
          )}

          {/* Menu */}
          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col border-b border-slate-100">
              {mainMenuItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={`border-b border-slate-100 px-6 py-4 text-sm font-medium transition ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>

            {/* Account */}
            {authenticated && (
              <>
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    My Account
                  </p>
                </div>

                <nav className="flex flex-col border-b border-slate-100">
                  {accountMenuItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={`border-b border-slate-100 px-6 py-4 text-sm transition ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </>
            )}

            {/* Contact */}
            <SheetClose asChild>
              <Link
                href="/contact"
                className="block border-b border-slate-100 px-6 py-4 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-primary"
              >
                Contact Us
              </Link>
            </SheetClose>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-4">
            {authenticated ? (
              <Button
                variant="destructive"
                className="w-full"
                disabled={isLoading}
                onClick={handleLogout}
              >
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            ) : (
              <SheetClose asChild>
                <Link href="/auth">
                  <Button className="w-full">Sign In</Button>
                </Link>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
