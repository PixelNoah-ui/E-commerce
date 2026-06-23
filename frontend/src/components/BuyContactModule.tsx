"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Phone, MapPin, MapMinus, Copy, Check } from "lucide-react";
import { useAddress } from "@/hooks/useAddress";
import { useTodayCoupon } from "@/hooks/useCoupon";

export default function BuyContactModule() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: address } = useAddress();
  const { data: coupon } = useTodayCoupon();

  const phone = address?.phone || "+251 911 234 567";
  const secondPhone = address?.secondPhone || null;
  const location = address?.address || "Jimma, Ethiopia";
  const subLocation = address?.location || "Jimma, Ethiopia";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* BUTTON */}
      <DialogTrigger asChild>
        <Button className="w-full py-5 rounded-none mt-2">Buy Now</Button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className=" p-6">
        <DialogTitle className="text-lg font-semibold mb-2">
          Contact to Buy
        </DialogTitle>

        <p className="text-sm text-muted-foreground mb-5">
          Visit or call us to complete your purchase.
        </p>

        {/* CONTACT */}
        <div className="space-y-3">
          {/* ADDRESS */}
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <span className="font-medium leading-relaxed">{location} </span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <MapMinus className="h-4 w-4 text-primary mt-0.5" />
            <span className="font-medium leading-relaxed">{subLocation} </span>
          </div>

          <div className="flex items-center gap-4 justify-between">
            {/* PHONE */}
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-medium">{phone}</span>
            </div>

            {/* SECOND PHONE */}
            {secondPhone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-medium">{secondPhone} </span>
              </div>
            )}
          </div>
        </div>

        {coupon && (
          <div className="mt-5 flex justify-center">
            <div className="flex items-center gap-3 px-5 py-2 border border-primary/30 bg-primary/5 rounded-full shadow-sm">
              <span className="text-xs font-medium text-muted-foreground">
                COUPON :
              </span>

              <span className="text-sm font-bold tracking-wider text-primary">
                {coupon.code}
              </span>
            </div>
          </div>
        )}
        <Button
          className="w-full mt-6 rounded-none"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
