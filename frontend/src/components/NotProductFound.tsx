"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";

interface NoProductsFoundProps {
  title?: string;
  message?: string;
  clearUrl?: string;
}

export default function NoProductsFound({
  title = "No Products Found",
  message = "Try adjusting your filters or browse other categories.",
  clearUrl = "/equipments",
}: NoProductsFoundProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-4 text-center">
      {/* Icon */}
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-primary/10 blur-md" />
        <div className="relative rounded-full bg-zinc-900 p-4 border border-zinc-800">
          <Search className="h-8 w-8 text-zinc-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      {/* Message */}
      <p className="text-sm text-zinc-400 max-w-sm">{message}</p>

      {/* Button */}
      <Button
        onClick={() => router.push(clearUrl)}
        variant="outline"
        size="sm"
        className="rounded-full border-zinc-700 bg-zinc-900 px-6 py-2 text-sm text-white hover:bg-zinc-800 hover:text-primary transition"
      >
        <FilterX className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );
}
