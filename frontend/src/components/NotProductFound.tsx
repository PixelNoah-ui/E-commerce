"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";

interface NoProductsFoundProps {
  message?: string;
  clearUrl?: string;
}

export default function NoProductsFound({
  message = "No products match your current filters. Try adjusting your search, price range, category, or other options.",
  clearUrl = "/shops",
}: NoProductsFoundProps) {
  const router = useRouter();

  const handleClear = () => {
    router.push(clearUrl);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-6 py-20 text-center">
      {/* Icon Container */}
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl animate-pulse-slow" />
        <div className="relative rounded-full bg-zinc-900 p-6 border border-zinc-800">
          <Search className="h-12 w-12 text-zinc-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
        No Products Found
      </h2>

      {/* Message */}
      <p className="max-w-lg text-lg text-zinc-400 leading-relaxed">
        {message}
      </p>

      {/* Action Button */}
      <Button
        onClick={handleClear}
        variant="outline"
        size="lg"
        className="group relative overflow-hidden rounded-full border-zinc-700 bg-zinc-900 px-10 py-6 text-base font-medium text-white hover:bg-zinc-800 hover:text-primary transition-all duration-300"
      >
        <span className="relative z-10 flex items-center gap-2">
          <FilterX className="h-5 w-5" />
          Clear Filters & Try Again
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Button>

      {/* Optional subtle hint */}
      <p className="text-sm text-zinc-500 mt-4">
        Try broadening your search or check back later for new stock.
      </p>
    </div>
  );
}
