"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User, Package, LogOut, ChevronDown, Loader2 } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import type { User as UserType } from "@/types/Types";

interface Props {
  user: UserType;
}

export default function UserDropdown({ user }: Props) {
  const { logoutUser, isLoading } = useLogout();

  async function handleLogout() {
    await logoutUser("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border px-3 py-2 hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <User size={18} />
          </div>

          <div className="hidden lg:block text-left">
            <p className="text-xs text-slate-500">Hello</p>

            <p className="font-medium">{user.fullName}</p>
          </div>

          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile/addresses">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/orders">
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            "Logout"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
