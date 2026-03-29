"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function MobileNavbar() {
  const pathname = usePathname();

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "Equipments", href: "/equipments" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <div className="lg:hidden">
      <Sheet>
        {/* MENU BUTTON */}
        <SheetTrigger asChild>
          <button className="p-2">
            <Menu size={30} className="text-primary" />
          </button>
        </SheetTrigger>

        {/* DRAWER */}
        <SheetContent side="right" className="w-[85%] max-w-sm p-0">
          {/* HEADER / LOGO */}
          <div className="px-6 py-6 border-b border-border">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/icons/logo.svg"
                    alt="Abdi Electronics"
                    width={40}
                    height={40}
                  />
                  <span className="text-sm font-bold text-primary">
                    ABDI ELECTRONICS
                  </span>
                </Link>
              </SheetTitle>
            </SheetHeader>
          </div>

          {/* NAV LINKS */}
          <nav className="flex flex-col">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-6 py-5 text-lg font-medium border-b border-border transition-colors ${
                      isActive
                        ? "text-primary font-semibold bg-muted/20"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    {item.title}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
