import type { ComponentType } from "react";
import MainNav from "./mainNav";
import TopBar from "./TopBar";
import { getCurrentUserServer } from "@/lib/auth.server";

const MainNavTyped = MainNav as ComponentType<{
  authenticated: boolean;
  user: { fullName: string; email: string } | null;
}>;

export default async function Header() {
  const userData = await getCurrentUserServer();
  const currentUser = userData?.user ?? null;
  const authenticated = Boolean(currentUser);

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <TopBar />
      <MainNavTyped authenticated={authenticated} user={currentUser} />
    </div>
  );
}
