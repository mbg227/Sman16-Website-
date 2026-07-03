import { STATUS_LABEL, STATUS_STYLE, cn } from "@/lib/utils";

export default function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-xs font-semibold border",
        STATUS_STYLE[status] || STATUS_STYLE.menunggu
      )}
    >
      {STATUS_LABEL[status] || "Menunggu"}
    </span>
  );
}
