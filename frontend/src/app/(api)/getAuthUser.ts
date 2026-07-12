import { buildApiUrl } from "@/lib/auth";
import type { User } from "@/types/Types";
import { cookies } from "next/headers";
interface GetMeResponse {
  status: "success";
  data: User | null;
}
export async function getUser(): Promise<User | null> {
  const cookiesToken = await cookies();
  const res = await fetch(buildApiUrl("/auth/me"), {
    headers: {
      Cookie: `token=${cookiesToken.get("token")?.value || ""}`,
    },
    method: "GET",
    cache: "no-store",
  });

  const result: GetMeResponse = await res.json();

  return result.data;
}
