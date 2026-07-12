import { Suspense } from "react";
import CheckoutSuccessContent from "./CheckoutSuccessContent";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Loading order details...
          </p>
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
