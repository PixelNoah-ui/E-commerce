"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new account page
    router.replace("/profile/account");
  }, [router]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <div className="text-center">
        <p className="text-slate-600">Redirecting...</p>
      </div>
    </main>
  );
}
