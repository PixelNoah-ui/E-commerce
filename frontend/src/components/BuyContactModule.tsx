"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Phone, MapPin } from "lucide-react";

export default function BuyContactModule() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* BUTTON */}
      <DialogTrigger asChild>
        <Button className="w-full py-5 rounded-none mt-4">Buy Now</Button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="max-w-sm p-6">
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
            <span className="font-medium leading-relaxed">Jimma, Ethiopia</span>
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-medium">+251 911 234 567</span>
          </div>
        </div>

        {/* ACTION */}
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
