"use client";

import SearchFilterLayout from "./SearchFilter";

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
    <SearchFilterLayout collections={uniqueCategories}>
      {children}
    </SearchFilterLayout>
  );
}
