import { MarkupType } from "@prisma/client";

export function calculateRetailPrice(
  baseCostCents: number,
  markupType: MarkupType | "PERCENTAGE" | "FIXED",
  markupValue: number
) {
  if (baseCostCents < 0) throw new Error("Base cost cannot be negative.");
  if (markupValue < 0) throw new Error("Markup cannot be negative.");

  if (markupType === "FIXED") return baseCostCents + markupValue;
  return Math.round(baseCostCents * (1 + markupValue / 100));
}

export function calculatePlatformProfit(retailPriceCents: number, baseCostCents: number) {
  return Math.max(0, retailPriceCents - baseCostCents);
}

export function validateVariantPrice(baseCostCents: number, retailPriceCents: number) {
  return retailPriceCents >= baseCostCents && retailPriceCents > 0;
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}
