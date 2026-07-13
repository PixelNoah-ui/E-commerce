"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useAddress } from "@/hooks/useAddress";

export default function Footer() {
  const { data: address, isLoading } = useAddress();

  const phone = address?.phone ?? "+251 911 123 456";
  const email = address?.email ?? "support@pixelshop.com";
  const location = address?.location ?? "Jimma, Ethiopia";

  return (
    <footer className="bg-[#0c0c0c] text-slate-300 pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
        {/* MAIN GRID */}
        <div className="grid gap-4 lg:grid-cols-4 pb-16 border-b border-slate-800">
          {/* LOGO + INFO */}
          <div className="space-y-6">
            <div className="inline-flex w-full items-center gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-full border-2 border-primary bg-white overflow-hidden">
                <Image
                  src="/icons/logo.svg"
                  alt="PixelShop Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">PixelShop</p>
                <p className="text-sm text-slate-500">
                  Buy, sell & rent electronics across Dubai and Ethiopia.
                </p>
              </div>
            </div>

            <p className="max-w-sm leading-7 text-slate-400">
              PixelShop connects businesses and consumers with premium
              electronics and equipment across Dubai and Ethiopia. Discover
              laptops, phones, cameras, and smart accessories with fast support
              from our Dubai store.
            </p>

            {/* CONTACT INFO */}
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{isLoading ? "Loading..." : phone}</span>
              </p>

              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{isLoading ? "Loading..." : email}</span>
              </p>

              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>{isLoading ? "Loading..." : location}</span>
              </p>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-white text-lg font-semibold">Company</h4>
            <div className="mt-3 h-1.5 w-12 rounded-full bg-primary" />

            <ul className="mt-6 space-y-4 text-sm text-slate-400">
              {[
                { label: "Home", href: "/" },
                { label: "Equipments", href: "/equipments" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-white text-lg font-semibold">Shop</h4>
            <div className="mt-3 h-1.5 w-12 rounded-full bg-primary" />

            <ul className="mt-6 space-y-4 text-sm text-slate-400">
              {[
                "Smartphones",
                "Laptops",
                "Smartwatches",
                "Audio & Headphones",
                "Accessories",
              ].map((label) => (
                <li key={label}>
                  <Link
                    href={`/electronics/${label
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-white text-lg font-semibold">Support</h4>
            <div className="mt-3 h-1.5 w-12 rounded-full bg-primary" />

            <ul className="mt-6 space-y-4 text-sm text-slate-400">
              {[
                { label: "Term of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className=" flex flex-col gap-4 border-t border-slate-800 pt-8 pb-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PixelShop. All rights reserved.</p>
          <p>Designed for modern electronics buyers and sellers in Ethiopia.</p>
        </div>

        {/* DEVELOPER CREDIT (FIXED) */}
        <div className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-600">
          <p>
            Built by{" "}
            <span className="text-slate-400 font-medium">PixelNoah</span>
            {" · "}
            <a href="tel:+251911477218" className="hover:text-primary">
              0911 477 218
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
