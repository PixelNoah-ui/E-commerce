"use client";

import * as React from "react";
import {
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuContent as DropdownMenuContentPrimitive,
  DropdownMenuItem as DropdownMenuItemPrimitive,
  DropdownMenuSeparator as DropdownMenuSeparatorPrimitive,
  DropdownMenuTrigger as DropdownMenuTriggerPrimitive,
} from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";

function DropdownMenu(
  props: React.ComponentProps<typeof DropdownMenuPrimitive>,
) {
  return <DropdownMenuPrimitive {...props} />;
}

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTriggerPrimitive>) {
  return (
    <DropdownMenuTriggerPrimitive
      {...props}
      className={cn("inline-flex items-center", className)}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuContentPrimitive>) {
  return (
    <DropdownMenuContentPrimitive
      align="end"
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-900 shadow-lg animate-in fade-in-0 zoom-in-95",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItemPrimitive>) {
  return (
    <DropdownMenuItemPrimitive
      className={cn(
        "flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 hover:bg-slate-100",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparatorPrimitive>) {
  return (
    <DropdownMenuSeparatorPrimitive
      className={cn("my-1 h-px bg-slate-200", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
