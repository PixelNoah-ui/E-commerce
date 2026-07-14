"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ShieldCheck, ShoppingBag, Truck, MapPin } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddresses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
  type CheckoutOrder,
  type CheckoutInitResponse,
} from "@/lib/checkout";
import { toast } from "sonner";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const { data: savedAddresses = [] } = useAddresses();
  const latestSavedAddress = useMemo(() => {
    return (
      [...savedAddresses]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .shift() ?? null
    );
  }, [savedAddresses]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [useManualAddress, setUseManualAddress] = useState(true);
  const [hasInitializedSavedAddress, setHasInitializedSavedAddress] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      country: "Ethiopia",
      city: "",
      address: "",
      postalCode: "",
      orderNotes: "",
    },
  });

  // Auto-fill when a recent saved address exists
  useEffect(() => {
    if (savedAddresses.length === 0) {
      setUseManualAddress(true);
      setSelectedAddressId(null);
      setHasInitializedSavedAddress(false);
      return;
    }

    if (!hasInitializedSavedAddress) {
      setUseManualAddress(false);
      setSelectedAddressId(latestSavedAddress?.id ?? null);
      setHasInitializedSavedAddress(true);
    }
  }, [savedAddresses.length, latestSavedAddress, hasInitializedSavedAddress]);

  useEffect(() => {
    if (!latestSavedAddress || useManualAddress) return;

    const addressToUse =
      savedAddresses.find((addr) => addr.id === selectedAddressId) ||
      latestSavedAddress;

    if (!addressToUse) return;

    setSelectedAddressId(addressToUse.id);
    reset({
      fullName: addressToUse.fullName,
      phone: addressToUse.phone ?? "",
      country: addressToUse.country,
      city: addressToUse.city,
      address: addressToUse.address,
      postalCode: addressToUse.postalCode ?? "",
      orderNotes: "",
    });
  }, [
    latestSavedAddress,
    savedAddresses,
    selectedAddressId,
    useManualAddress,
    reset,
  ]);

  const watchedCountry = watch("country");

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = Number((subtotal * 0.07).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));
  const isOrderReady = items.length > 0 && isValid;

  // Check if no addresses exist and redirect
  useEffect(() => {
    if (savedAddresses.length === 0 && !useManualAddress) {
      setUseManualAddress(true);
    }
  }, [savedAddresses]);

  // Show warning if no addresses and direct user to add one
  const hasNoSavedAddresses = savedAddresses.length === 0;

  // If no items, show empty cart
  if (!items.length) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Add a few products to your cart and come back here when you are ready
          to continue.
        </p>
        <Link
          href="/electronics"
          className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  // Show recommendation to add address if none exist
  if (hasNoSavedAddresses && useManualAddress) {
    // Still allow manual entry but show helpful message
  }

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);
    setError("");

    const orderPayload: CheckoutOrder = {
      customer: values,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        lineTotal: item.price * item.quantity,
      })),
      subtotal,
      shipping,
      tax,
      total,
      placedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(buildApiUrl("/checkout/initialize"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data: CheckoutInitResponse = await response.json();

      if (response.status === 401) {
        router.push("/auth?redirect=/checkout");
        return;
      }

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data?.message || "Unable to place your order right now.",
        );
      }

      if (data?.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
        return;
      }

      router.push("/checkout/success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to place your order right now.",
      );
      setIsPlacingOrder(false);
    }
  };
  if (!items.length) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Add a few products to your cart and come back here when you are ready
          to continue.
        </p>
        <Link
          href="/electronics"
          className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Secure Checkout
          </p>
          <h1 className="text-3xl font-semibold">Complete your order</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer information</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Address Selection */}
              {savedAddresses.length > 0 && (
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                      Use latest saved address
                    </h3>
                    <button
                      type="button"
                      onClick={() => setUseManualAddress((value) => !value)}
                      className="text-xs text-primary hover:underline"
                    >
                      {useManualAddress
                        ? "Use saved address"
                        : "Edit address manually"}
                    </button>
                  </div>

                  {!useManualAddress && (
                    <Select
                      value={selectedAddressId || ""}
                      onValueChange={setSelectedAddressId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a saved address" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedAddresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span>
                                {addr.fullName} - {addr.address}, {addr.city}
                                {addr.isDefault && " (Default)"}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {!useManualAddress && savedAddresses.length === 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                      No saved addresses found.{" "}
                      <Link
                        href="/profile/addresses"
                        className="font-semibold underline"
                      >
                        Add one now
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form
                id="checkout-form"
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="fullName">
                      Full name
                    </label>
                    <Input id="fullName" {...register("fullName")} />
                    {errors.fullName ? (
                      <p className="text-sm text-destructive">
                        {errors.fullName.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="phone">
                      Phone
                    </label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone ? (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="country">
                      Country
                    </label>
                    <Select
                      value={watchedCountry}
                      onValueChange={(value) => setValue("country", value)}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Sudan">Sudan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.country ? (
                      <p className="text-sm text-destructive">
                        {errors.country.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="city">
                      City
                    </label>
                    <Input id="city" {...register("city")} />
                    {errors.city ? (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium" htmlFor="address">
                      Address
                    </label>
                    <Input id="address" {...register("address")} />
                    {errors.address ? (
                      <p className="text-sm text-destructive">
                        {errors.address.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="postalCode">
                      Postal code
                    </label>
                    <Input id="postalCode" {...register("postalCode")} />
                    {errors.postalCode ? (
                      <p className="text-sm text-destructive">
                        {errors.postalCode.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="orderNotes">
                      Order notes (optional)
                    </label>
                    <Textarea id="orderNotes" {...register("orderNotes")} />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 space-y-3 overflow-y-auto pr-2 sm:max-h-105">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : null}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)} ETB
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background p-4">
                <Truck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Fast delivery across Ethiopia
                  </p>
                  <p>
                    We confirm your order quickly and share tracking details
                    after payment confirmation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Protected checkout
                  </p>
                  <p>
                    Only signed-in users can place an order. Your session is
                    verified before checkout.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} ETB</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              <span>{shipping.toFixed(2)} ETB</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Estimated tax</span>
              <span>{tax.toFixed(2)} ETB</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)} ETB</span>
            </div>

            {error ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button
              className="w-full"
              form="checkout-form"
              type="submit"
              disabled={!isOrderReady || isPlacingOrder}
            >
              {isPlacingOrder ? "Placing order..." : "Place order"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By placing this order, you agree to our terms and conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
