// Badge colors for order statuses, shared by the customer and admin order pages
export const orderStatusStyles: Record<string, string> = {
  "Awaiting Payment":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  Ordered:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  "In Progress": "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  Delivered:
    "bg-stone-200 text-stone-800 dark:bg-stone-700/60 dark:text-stone-200",
  Canceled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
};

export const defaultStatusStyle = "bg-surface-muted text-muted";
