"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useAddress } from "@/hooks/useAddress";

export default function Footer() {
  const { data: address, isLoading } = useAddress();
  const phone = address?.phone ?? "+251 911 123 456";
  const email = address?.email ?? "support@abduelectronics.com";
  const location = address?.location ?? "Jimma, Ethiopia";

  return (
    <footer className="bg-[#0c0c0c] text-slate-300 pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-4 pb-16 border-b border-slate-800">
          <div className="space-y-6">
            <div className="">
              <div className="inline-flex items-center gap-3">
                <div className="h-16 w-16 flex items-center justify-center bg-white rounded-full border-2 border-primary overflow-hidden">
                  <Image
                    src="/icons/logo.svg"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">
                    Abdu Electronics
                  </p>
                  <p className="text-sm text-slate-500">
                    Buy, sell & rent electronics in Ethiopia.
                  </p>
                </div>
              </div>
            </div>
            <p className="max-w-sm leading-7 text-slate-400">
              Abdu Electronics connects businesses and consumers with premium
              electronics and equipment across Ethiopia. Discover laptops,
              phones, cameras, and smart accessories with fast support.
            </p>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>{isLoading ? "Loading..." : phone}</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>{isLoading ? "Loading..." : email}</span>
              </p>
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{isLoading ? "Loading..." : location}</span>
              </p>
            </div>
          </div>

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
                    href={`/electronics/${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Abdu Electronics. All rights reserved.
          </p>
          <p>Designed for modern electronics buyers and sellers in Ethiopia.</p>
        </div>
      </div>
    </footer>
  );
}
