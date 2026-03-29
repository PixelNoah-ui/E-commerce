"use client";

import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ErrorPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-6">
      <div className="absolute w-150 h-150 bg-destructive/20 blur-[160px] rounded-full -top-50" />
      <div className="absolute w-150 h-150 bg-purple-500/10 blur-[140px] rounded-full -bottom-50 -right-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-xl space-y-8"
      >
        <AlertTriangle className="w-28 h-28 text-destructive mx-auto" />

        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Something went wrong
          </h2>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            An unexpected error occurred. Please try again
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="rounded-none px-12 md:px-16">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="rounded-none px-12 md:px-16 text-black hover:cursor-pointer border-white/20"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
