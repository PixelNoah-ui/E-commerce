"use client";

import Link from "next/link";
import { useAddresses } from "@/hooks/useAddresses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

export default function AddressesTab() {
  const { data: addresses = [], isLoading } = useAddresses();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Saved Addresses</CardTitle>
        <Link href="/profile/addresses">
          <Button size="sm" variant="outline">
            <Plus size={16} className="mr-2" />
            Add Address
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="py-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-600 mb-4">No addresses yet</p>
            <Link href="/profile/addresses">
              <Button>Add Your First Address</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  addr.isDefault
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{addr.fullName}</h4>
                    {addr.isDefault && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{addr.phone}</p>
                  <p className="text-sm text-slate-600">
                    {addr.address}
                    {addr.state && `, ${addr.state}`}
                    {addr.city && `, ${addr.city}`}
                  </p>
                  {addr.postalCode && (
                    <p className="text-sm text-slate-600">{addr.postalCode}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {addresses.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <Link href="/profile/addresses" className="inline-block">
              <Button variant="outline">Manage All Addresses</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
