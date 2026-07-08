"use client";

import { googleLogin } from "@/app/(api)/auth";
import { useMutation } from "@tanstack/react-query";

export function useGoogleAuth() {
  return useMutation({
    mutationFn: googleLogin,
  });
}
