"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { useAddress } from "@/hooks/useAddress";

export default function TopBar() {
  const { data: address, isLoading } = useAddress();

  const phone = address?.phone ?? "+251 911477215";
  const email = address?.email ?? "noreply@company.com";
  const location = address?.location ?? "Jimma, Ethiopia";

  return (
    <div className="w-full bg-muted/40 border-b text-sm py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-4 text-muted-foreground">
          {/* Support */}
          <div className="flex items-center gap-2">
            <Image
              src="/icons/support.svg"
              alt="Support"
              width={16}
              height={16}
            />
            <span className="hidden sm:inline">Support</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-1">
            <Phone size={16} className="text-primary" />

            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <span>{phone}</span>
            )}
          </div>

          {/* Email */}
          <div className="hidden md:flex items-center gap-1">
            <Mail size={16} className="text-primary" />

            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <span className="hover:text-primary transition">{email}</span>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={16} className="text-primary" />

          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            <span className="hover:text-primary transition cursor-pointer">
              {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
