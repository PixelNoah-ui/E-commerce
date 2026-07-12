import { buildApiUrl } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const logoutUrl = buildApiUrl("/auth/logout");
  const cookieHeader = request.headers.get("cookie") ?? "";

  const response = await fetch(logoutUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  // Forward Set-Cookie header from backend so browser clears cookie
  const setCookie = response.headers.get("set-cookie");
  const body = await response.text();
  const headers = new Headers();
  if (setCookie) headers.set("Set-Cookie", setCookie);
  headers.set("Content-Type", "application/json");

  return new Response(body, {
    status: response.status,
    headers,
  });
}

// Keep GET for browser-link logout if needed, perform POST proxy then redirect
export async function GET(request: Request) {
  const resp = await POST(request);
  // For GET we redirect to /auth after clearing cookie
  const headers = new Headers(resp.headers);
  headers.set("Location", "/auth");
  return new Response(null, { status: 307, headers });
}
