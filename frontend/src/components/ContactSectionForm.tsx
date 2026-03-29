"use client";

import { useForm } from "react-hook-form";
import { Mail, MapPin, Phone, Globe, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactSectionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("FORM DATA:", data);
  };

  return (
    <section className="w-full bg-muted py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2">
        {/* ================= LEFT PANEL ================= */}
        <div className="bg-primary text-primary-foreground p-10 flex flex-col justify-between relative">
          {/* Title */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-1">
                <div className="w-6 h-[2px] bg-white" />
                <div className="w-3 h-[2px] bg-white" />
              </div>
              <h3 className="text-xl text-white font-semibold">
                Contact Details
              </h3>
            </div>

            {/* Items */}
            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-4">
                <MapPin className="text-white" />
                <div className="text-white">
                  <p className="text-sm ">Head Office</p>
                  <p className="font-semibold">Jimma, Ethiopia</p>
                </div>
              </div>

              <div className="h-px bg-white/30" />

              {/* Phone */}
              <div className="flex gap-4">
                <Phone className="text-white" />
                <div className="text-white">
                  <p className="text-sm ">For Support</p>
                  <p className="font-semibold">+251 911 234 567</p>
                </div>
              </div>

              <div className="h-px bg-white/30" />

              {/* Hours */}
              <div className="flex gap-4">
                <Globe className="text-white" />
                <div className="text-white">
                  <p className="text-sm ">Work Hours</p>
                  <p className="font-semibold">Mon - Sat 8am to 6pm</p>
                </div>
              </div>

              <div className="h-px bg-white/30" />

              {/* Email */}
              <div className="flex gap-4">
                <Mail className="text-white" />
                <div className="text-white">
                  <p className="text-sm ">Email Us</p>
                  <p className="font-semibold">support@abdielectronics.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* bottom stripe */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,white,white_4px,transparent_4px,transparent_8px)] opacity-30" />
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="bg-background p-10">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Send a Message
          </h2>

          {/* small lines */}
          <div className="flex gap-2 mb-6">
            <div className="w-10 h-[2px] bg-primary" />
            <div className="w-5 h-[2px] bg-primary" />
          </div>

          <p className="text-muted-foreground mb-8">
            Your email address will not be published. Required fields are marked
            with *
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Row */}
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
                  placeholder="Email"
                  className="rounded-none"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <Input
                className="rounded-none"
                placeholder="Subject"
                {...register("subject", { required: "Subject is required" })}
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
                {...register("message", { required: "Message is required" })}
              />
              {errors.message && (
                <p className="text-sm text-destructive mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="rounded-none px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90"
            >
              SEND MESSAGE
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
