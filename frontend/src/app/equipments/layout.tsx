"use client";

import { Suspense } from "react";
import SearchFilterLayout from "./SearchFilter";
import LoadingSkeleton from "./laodingSkeleton";

export default function Layout({ children }: { children: React.ReactNode }) {
  const uniqueCategories = [
    { name: "Smartphones", slug: "smartphones" },
    { name: "Laptops", slug: "laptops" },
    { name: "Televisions", slug: "televisions" },
    { name: "Refrigerators", slug: "refrigerators" },
    { name: "Washing Machines", slug: "washing-machines" },
    { name: "Air Conditioners", slug: "air-conditioners" },
    { name: "Audio & Speakers", slug: "audio-speakers" },
    { name: "Accessories", slug: "accessories" },
  ];

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SearchFilterLayout collections={uniqueCategories}>
        {children}
      </SearchFilterLayout>
    </Suspense>
  );
}
