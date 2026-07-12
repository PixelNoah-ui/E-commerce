import { cookies } from "next/headers";
import { buildApiUrl } from "@/lib/auth";

export async function getCurrentUserServer() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (!cookieHeader) return null;

  const res = await fetch(buildApiUrl("/auth/me"), {
    headers: {
      cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.data ?? null;
}
