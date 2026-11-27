import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UiPreviewShowcase } from "@/app/ui-preview/_components/ui-preview-showcase";

export const metadata: Metadata = {
  title: "UI Preview — Pokémon Gym",
  robots: { index: false, follow: false },
};

export default function UiPreviewPage() {
  if (process.env.VERCEL_ENV === "production") {
    notFound();
  }

  return <UiPreviewShowcase />;
}
