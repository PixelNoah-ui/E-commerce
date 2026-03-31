"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface NoProductsFoundProps {
  title?: string;
  description?: string;
  backHref?: string;
}

export default function NoProductsFound({
  title = "No Products Found",
  description = "We couldn’t find any products in this category. Try exploring other categories or adjust your filters.",
  backHref = "/electronics",
}: NoProductsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {/* Icon with animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-muted p-6 rounded-full shadow-md"
      >
        <SearchX className="w-12 h-12 text-primary" />
      </motion.div>

      {/* Title */}
      <h2 className="mt-6 text-2xl md:text-3xl font-bold">{title}</h2>

      {/* Description */}
      <p className="mt-3 text-muted-foreground max-w-md">{description}</p>

      {/* Actions */}
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <Button asChild className="rounded-full px-6">
          <Link href={backHref}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Shop
          </Link>
        </Button>

        <Button variant="outline" className="rounded-full px-6">
          Browse Categories
        </Button>
      </div>
    </div>
  );
}
