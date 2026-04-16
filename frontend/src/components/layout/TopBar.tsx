"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAddress } from "@/hooks/useAddress";

export default function TopBar() {
  const { data: address, isLoading } = useAddress();

  const phone = address?.phone ?? "+251 911477215";
  const email = address?.email ?? "noreply@company.com";
  const location = address?.location ?? "Jimma, Ethiopia";

  return (
    <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20 text-sm py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* LEFT - Contact Info */}
        <div className="flex items-center gap-3 md:gap-5 text-muted-foreground">
          {/* Phone */}
          <div className="flex items-center gap-1.5 group">
            <Phone
              size={15}
              className="text-primary group-hover:scale-110 transition-transform"
            />
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <span className="hover:text-primary transition font-medium">
                {phone}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-4 w-px bg-primary/30" />

          {/* Email */}
          <div className="hidden md:flex items-center gap-1.5 group">
            <Mail
              size={15}
              className="text-primary group-hover:scale-110 transition-transform"
            />
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <span className="hover:text-primary transition font-medium">
                {email}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block h-4 w-px bg-primary/30" />

          {/* Working Hours */}
          <div className="hidden lg:flex items-center gap-1.5">
            <Clock size={15} className="text-primary" />
            <span className="font-medium">Mon-Sat: 8:00 AM - 9:00 PM</span>
          </div>
        </div>

        {/* RIGHT - Location & Social */}
        <div className="flex items-center gap-4">
          {/* Location */}
          <div className="flex items-center gap-1.5 group">
            <MapPin
              size={15}
              className="text-primary group-hover:scale-110 transition-transform"
            />
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <span className="hover:text-primary transition font-medium cursor-pointer">
                {location}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-primary/30 hidden sm:block" />

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <Link
              href="https://www.tiktok.com/@abduljelilm?_r=1&_t=ZS-95a47ZI2Ath"
              target="_blank"
              className="p-1.5 rounded-full hover:bg-primary/10 transition-colors group"
            >
              <Image
                src="/icons/tiktok.svg"
                alt="TikTok"
                width={14}
                height={14}
                className="group-hover:scale-110 transition-transform"
              />
            </Link>
            <Link
              href="https://t.me/Abduljelilshemsu"
              target="_blank"
              className="p-1.5 rounded-full hover:bg-primary/10 transition-colors group"
            >
              <Image
                src="/icons/telegram.svg"
                alt="Telegram"
                width={14}
                height={14}
                className="group-hover:scale-110 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
