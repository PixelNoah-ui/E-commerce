"use client";

import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 
    bg-gradient-to-br from-background via-muted/40 to-background"
    >
      {/* 🔥 soft gradient glow blobs */}
      <div className="absolute w-[600px] h-[600px] bg-primary/20 blur-[140px] rounded-full top-[-200px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full bottom-[-200px] right-[-150px]" />

      {/* subtle grid texture (pro look) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-xl space-y-8"
      >
        {/* 404 */}
        <h1
          className="text-[120px] md:text-[170px] font-black leading-none 
        bg-gradient-to-b from-foreground to-muted-foreground 
        bg-clip-text text-transparent"
        >
          404
        </h1>

        {/* text */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page not found
          </h2>

          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>
        </div>

        {/* buttons */}
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
            className="rounded-none px-12 md:px-16 hover:cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
