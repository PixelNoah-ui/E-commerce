const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (API_URL.includes("/api/v1")) {
    return `${API_URL}${normalizedPath}`;
  }

  return `${API_URL}/api/v1${normalizedPath}`;
}

export async function loginUser(payload: { email: string; password: string }) {
  const res = await fetch(buildApiUrl("/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function googleLogin(credential: string) {
  const res = await fetch(buildApiUrl("/auth/google"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credential,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Google Login Failed");
  }

  return data;
}

export async function logout() {
  const res = await fetch(buildApiUrl("/auth/logout"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Logout failed");
  return data;
}
