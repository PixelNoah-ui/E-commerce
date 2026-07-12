export function buildApiUrl(path: string) {
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  ).replace(/\/$/, "");

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (API_URL.includes("/api/v1")) {
    return `${API_URL}${normalizedPath}`;
  }

  return `${API_URL}/api/v1${normalizedPath}`;
}

export async function getCurrentUser() {
  const res = await fetch(buildApiUrl("/auth/me"), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data?.data?.user ?? null;
}
