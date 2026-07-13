"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/(api)/auth";

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logoutUser = async (redirectTo = "/auth") => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await logout();
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { logoutUser, isLoading };
}
