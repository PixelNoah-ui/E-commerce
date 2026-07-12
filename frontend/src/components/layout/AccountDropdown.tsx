"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout as apiLogout } from "@/app/(api)/auth";
import { Button } from "@/components/ui/button";

interface AccountDropdownProps {
  userName: string;
}

export default function AccountDropdown({ userName }: AccountDropdownProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      router.push("/auth");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      label: "Profile",
      href: "/profile/account",
      icon: User,
    },
    {
      label: "My Orders",
      href: "/orders",
      icon: Package,
    },
    {
      label: "Addresses",
      href: "/profile/addresses",
      icon: MapPin,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Open account menu"
          className="h-11 w-11 rounded-full p-0 text-slate-700 hover:text-primary"
        >
          <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shadow-sm shadow-primary/10">
            <User size={18} className="text-primary" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="font-semibold text-sm truncate">{userName}</p>
        </div>

        <div className="py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.href} asChild className="rounded-xl">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Icon size={16} className="text-slate-500" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <LogOut size={16} />
            <span>{isLoading ? "Logging out..." : "Logout"}</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
