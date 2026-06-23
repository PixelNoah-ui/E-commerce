"use client";

import { useForm, Controller } from "react-hook-form";
import { MapPin, Phone, Globe, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useSendMessage from "@/hooks/useUser";
import { useAddress } from "@/hooks/useAddress";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function ContactSectionForm() {
  const { isPending, mutate: sendMessages } = useSendMessage();
  const { data: address, isLoading, isError } = useAddress();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    sendMessages(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <section className="w-full bg-muted py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2">
        {/* ================= LEFT PANEL ================= */}
        <div className="bg-primary text-primary-foreground p-10 flex flex-col justify-between relative">
          <div>
            {/* Title */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-1">
                <div className="w-6 h-[2px] bg-white" />
                <div className="w-3 h-[2px] bg-white" />
              </div>
              <h3 className="text-xl font-semibold">Contact Details</h3>
            </div>

            {/* Items */}
            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-4">
                <MapPin />
                <div>
                  <p className="text-sm">Head Office</p>
                  <div className="font-semibold">
                    {isLoading ? (
                      <div className="h-4 w-40 bg-white/30 animate-pulse rounded" />
                    ) : isError ? (
                      <span className="text-red-300">
                        Failed to load address
                      </span>
                    ) : (
                      address?.location || "Jimma, Ethiopia"
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/30" />

              {/* Phone */}
              <div className="flex gap-4">
                <Phone />
                <div>
                  <p className="text-sm">For Support</p>
                  <div className="font-semibold">
                    {isLoading ? (
                      <div className="h-4 w-32 bg-white/30 animate-pulse rounded" />
                    ) : isError ? (
                      <span className="text-red-300">Failed to load phone</span>
                    ) : (
                      address?.phone || "+251 911477218"
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/30" />

              {/* Work Hours */}
              <div className="flex gap-4">
                <Globe />
                <div>
                  <p className="text-sm">Work Hours</p>
                  <p className="font-semibold">Mon - Sat 8:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* bottom stripe */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,white,white_4px,transparent_4px,transparent_8px)] opacity-30" />
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="bg-background p-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Send a Message
          </h2>

          <div className="flex gap-2 mb-6">
            <div className="w-10 h-0.5 bg-primary" />
            <div className="w-5 h-0.5 bg-primary" />
          </div>

          <p className="text-muted-foreground mb-8">
            Have questions or want to discuss a bulk order? Send us a message
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name + Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Input
                  placeholder="Name"
                  {...register("name", { required: "Name is required" })}
                  className="rounded-none"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Phone Number"
                  className="rounded-none"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^(09\d{8}|\+2519\d{8})$/,
                      message:
                        "Enter valid Ethiopian phone (09XXXXXXXX or +2519XXXXXXXX)",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Input
                placeholder="Email"
                type="email"
                className="rounded-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <Controller
                control={control}
                name="subject"
                rules={{ required: "Subject is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="Bulk Buy">Bulk Buy</SelectItem>
                      <SelectItem value="Sell to Owners">
                        Sell to Owners
                      </SelectItem>
                      <SelectItem value="Support">General Support</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subject && (
                <p className="text-sm text-destructive mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Textarea
                className="rounded-none"
                placeholder="Message"
                rows={5}
                {...register("message", {
                  required: "Message is required",
                })}
              />
              {errors.message && (
                <p className="text-sm text-destructive mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending || isError}
              className="rounded-none px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  SEND MESSAGE
                  <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
