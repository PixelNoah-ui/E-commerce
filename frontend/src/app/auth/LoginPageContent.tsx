"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GoogleLoginButton from "@/components/googleloginButton";

export default function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/";

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="space-y-6 p-8">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShoppingBag className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Sign in with your email and password to continue shopping.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-center text-sm text-muted-foreground">
              Sign in with Google to continue shopping.
            </p>
            <GoogleLoginButton redirectTarget={redirectTarget} />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              href="/contact"
              className="font-medium text-primary hover:underline"
            >
              Contact support
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
