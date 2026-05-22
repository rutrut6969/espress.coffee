const toneMap: Record<string, string> = {
  ACTIVE: "success",
  APPROVED: "success",
  DELIVERED: "success",
  PAID: "success",
  PUBLISHED: "success",
  SHIPPED: "success",
  AWAITING_ROASTER_SUPPLY: "warning",
  PENDING: "warning",
  PENDING_PAYMENT: "warning",
  READY_FOR_REPACKAGING: "warning",
  SUBMITTED: "warning",
  PREPARING: "work",
  READY_TO_SHIP: "work",
  REPACKAGED: "work",
  REPACKAGING: "work",
  ACCEPTED: "work",
  READY_FOR_TRANSFER: "work",
  CANCELED: "danger",
  FAILED: "danger",
  REFUNDED: "danger",
  REJECTED: "danger",
  SUSPENDED: "danger",
  ARCHIVED: "neutral",
  DRAFT: "neutral",
  HIDDEN: "neutral",
  INVITED: "neutral"
};

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toUpperCase();
  const tone = toneMap[normalized] ?? "neutral";
  return <span className={`status-badge status-badge-${tone}`}>{value.toLowerCase().replaceAll("_", " ")}</span>;
}
