"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/auth";
import AccountTabs from "@/components/profile/AccountTabs";
import { Card } from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string | null;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(buildApiUrl("/auth/me"), {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth");
            return;
          }
          throw new Error("Failed to load profile");
        }

        const data = await res.json();
        setUser(data?.data?.user ?? null);
      } catch (error) {
        console.error("Error loading user:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-1/4" />
          <div className="h-64 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <Card className="p-8 text-center">
          <p className="text-slate-600">Unable to load profile</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <p className="text-slate-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <AccountTabs user={user} />
    </main>
  );
}
