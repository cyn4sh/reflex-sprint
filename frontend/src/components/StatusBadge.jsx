function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    assigned: "bg-blue-50 text-blue-700 ring-blue-200",
    picked_up: "bg-violet-50 text-violet-700 ring-violet-200",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
  };

  const labels = {
    pending: "Pending",
    assigned: "Assigned",
    picked_up: "Picked Up",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${
        styles[status] || "bg-slate-50 text-slate-600 ring-slate-200"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export default StatusBadge;