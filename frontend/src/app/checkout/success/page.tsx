import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-semibold">Order placed successfully</h1>
      <p className="mt-3 max-w-lg text-sm text-muted-foreground">
        Your order request has been received. Our team will contact you shortly
        with the next steps.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Back to home
      </Link>
    </main>
  );
}
