"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateAddress,
  useLatestAddress,
  useUpdateAddress,
} from "@/hooks/useLatestAddress";
import { toast } from "sonner";

const emptyForm = {
  fullName: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  postalCode: "",
};

export default function AddressesPage() {
  const { latestAddress, isLoading: isLoadingAddress } = useLatestAddress();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();

  const [form, setForm] = useState(emptyForm);

  // Track the last address we've synced the form from. When it changes,
  // reset the form during render instead of in a useEffect.
  const [syncedAddress, setSyncedAddress] = useState(latestAddress);

  if (latestAddress !== syncedAddress) {
    setSyncedAddress(latestAddress);
    setForm(
      latestAddress
        ? {
            fullName: latestAddress.fullName,
            phone: latestAddress.phone || "",
            country: latestAddress.country,
            city: latestAddress.city,
            address: latestAddress.address,
            postalCode: latestAddress.postalCode || "",
          }
        : emptyForm,
    );
  }

  const isSaving = createAddress.isPending || updateAddress.isPending;

  const submit = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.country ||
      !form.city ||
      !form.address
    ) {
      toast.error("Please complete the required address fields");
      return;
    }

    try {
      if (latestAddress) {
        await updateAddress.mutateAsync({
          addressId: latestAddress.id,
          payload: {
            fullName: form.fullName,
            phone: form.phone,
            country: form.country,
            city: form.city,
            address: form.address,
            postalCode: form.postalCode || undefined,
          },
        });
        toast.success("Address updated");
      } else {
        await createAddress.mutateAsync({
          fullName: form.fullName,
          phone: form.phone,
          country: form.country,
          city: form.city,
          address: form.address,
          postalCode: form.postalCode || undefined,
        });
        toast.success("Address saved");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save address",
      );
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>My address</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoadingAddress ? (
            <div className="space-y-3 py-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              <Input
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              <Input
                placeholder="Country"
                value={form.country}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, country: e.target.value }))
                }
              />
              <Input
                placeholder="City"
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, city: e.target.value }))
                }
              />
              <Input
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
              />
              <Input
                placeholder="Postal code"
                value={form.postalCode}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, postalCode: e.target.value }))
                }
              />
            </>
          )}

          {!isLoadingAddress ? (
            <div className="flex items-center gap-2">
              <Button onClick={submit} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save address"
                )}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
