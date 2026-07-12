"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/hooks/useAddresses";
import { toast } from "sonner";

const emptyForm = {
  fullName: "",
  phone: "",
  country: "",
  city: "",
  state: "",
  address: "",
  postalCode: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === editingId) ?? null,
    [addresses, editingId],
  );

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
      if (editingId) {
        await updateAddress.mutateAsync({
          addressId: editingId,
          payload: { ...form },
        });
        toast.success("Address updated");
      } else {
        await createAddress.mutateAsync(form);
        toast.success("Address added");
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save address",
      );
    }
  };

  const removeAddress = async (addressId: string) => {
    try {
      await deleteAddress.mutateAsync(addressId);
      toast.success("Address removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove address",
      );
    }
  };

  const markDefault = async (addressId: string) => {
    try {
      await setDefaultAddress.mutateAsync(addressId);
      toast.success("Default address updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update default address",
      );
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit address" : "Add address"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
              placeholder="State"
              value={form.state}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, state: e.target.value }))
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                }
              />
              Make this my default address
            </label>
            <div className="flex gap-2">
              <Button
                onClick={submit}
                disabled={createAddress.isPending || updateAddress.isPending}
              >
                {editingId ? "Save changes" : "Save address"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? <div>Loading...</div> : null}
            {!isLoading && addresses.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No addresses yet.
              </div>
            ) : null}
            {addresses.map((address) => (
              <div key={address.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.country}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.phone}
                    </p>
                    {address.isDefault ? (
                      <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(address.id);
                        setForm({
                          fullName: address.fullName,
                          phone: address.phone || "",
                          country: address.country,
                          city: address.city,
                          state: address.state || "",
                          address: address.address,
                          postalCode: address.postalCode || "",
                          isDefault: address.isDefault,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markDefault(address.id)}
                    >
                      Default
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAddress(address.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
