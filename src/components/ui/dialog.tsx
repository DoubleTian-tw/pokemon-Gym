"use client";

import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/75 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

interface DialogContentProps extends ComponentProps<
  typeof DialogPrimitive.Content
> {
  variant?: "sheet" | "modal";
  preventMobileAutoFocus?: boolean;
}

function DialogContent({
  className,
  children,
  variant = "sheet",
  preventMobileAutoFocus = variant === "sheet",
  onOpenAutoFocus,
  ...props
}: DialogContentProps) {
  const handleOpenAutoFocus = (event: Event) => {
    onOpenAutoFocus?.(event);
    if (
      preventMobileAutoFocus &&
      !event.defaultPrevented &&
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      event.preventDefault();
    }
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        onOpenAutoFocus={handleOpenAutoFocus}
        className={cn(
          "glass-sheet fixed z-50 flex w-full max-w-[540px] flex-col overflow-hidden text-[var(--ink-primary)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          variant === "sheet"
            ? "inset-x-0 bottom-0 mx-auto max-h-[85dvh] rounded-t-[24px] rounded-b-none px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[24px] sm:p-4 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0"
            : "top-1/2 left-1/2 max-h-[85dvh] -translate-x-1/2 -translate-y-1/2 rounded-[24px] p-4",
          className,
        )}
        {...props}
      >
        {variant === "sheet" ? (
          <div
            aria-hidden="true"
            className="mx-auto mb-3 h-1 w-9 shrink-0 rounded-full bg-white/25 sm:hidden"
          />
        ) : null}
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex items-start justify-between gap-2", className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-base font-bold tracking-[-0.01em] text-[var(--ink-primary)]",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-[13px] text-[var(--ink-secondary)]", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
