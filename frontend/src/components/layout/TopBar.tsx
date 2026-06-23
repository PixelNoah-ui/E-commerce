"use client";

import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAddress } from "@/hooks/useAddress";

export default function TopBar() {
  const { data: address, isLoading } = useAddress();

  const phone = address?.phone ?? "+971 55 153 2113";
  const location = address?.location ?? "Dubai, UAE";
  const tiktokHandle = "Meqdii TikTok";
  const tiktokUrl = "https://vt.tiktok.com/ZSQw1R4SV/";
  const tiktokUrl2 = "https://vt.tiktok.com/ZSQw11VDu/";
  const tiktokUrl3 = "https://vt.tiktok.com/ZSQTooR14/";

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

          {/* TikTok Account */}
          <div className=" lg:flex items-center gap-1.5">
            <Link
              href={tiktokUrl}
              target="_blank"
              className="flex items-center gap-1.5 group hover:text-primary transition"
            >
              <Image
                src="/icons/tiktok.svg"
                alt="TikTok"
                width={14}
                height={14}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="font-medium">TikTok: {tiktokHandle}</span>
            </Link>
          </div>
        </div>

        {/* RIGHT - Location & Social */}
        <div className="flex items-center gap-4">
          {/* Location */}
          <div className="hidden md:flex items-center gap-1.5 group">
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
              href={tiktokUrl2}
              target="_blank"
              className="p-1.5 rounded-full hover:bg-primary/10 transition-colors group"
            >
              <Image
                src="/icons/tiktok.svg"
                alt="TikTok2"
                width={14}
                height={14}
                className="group-hover:scale-110 transition-transform"
              />
            </Link>
            <Link
              href={tiktokUrl3}
              target="_blank"
              className="p-1.5 rounded-full hover:bg-primary/10 transition-colors group"
            >
              <Image
                src="/icons/tiktok.svg"
                alt="TikTok3"
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
