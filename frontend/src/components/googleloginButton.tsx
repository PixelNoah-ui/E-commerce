"use client";

import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useGoogleAuth } from "@/hooks/useGoogleLogin";

export default function GoogleLoginButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  const { mutate, isPending } = useGoogleAuth();

  return (
    <div className="w-full">
      <GoogleLogin
        theme="outline"
        size="large"
        shape="rectangular"
        text="continue_with"
        width="350"
        onSuccess={(credentialResponse) => {
          setError("");
          if (!credentialResponse.credential) return;

          mutate(credentialResponse.credential, {
            onSuccess: () => {
              router.push("/");
              router.refresh();
            },

            onError: (err) => {
              console.log(err);
              setError("Google sign-in failed. Please try again.");
            },
          });
        }}
        onError={() => {
          setError("Google sign-in failed. Please try again.");
        }}
      />

      {isPending && <p className="mt-3 text-center text-sm">Signing in...</p>}
      {error ? (
        <p className="mt-3 text-center text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
