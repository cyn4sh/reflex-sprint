import StatusBadge from "./StatusBadge";

function DeliveryCard({ delivery, action }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Delivery #{delivery.id}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {delivery.customer_name}
          </h3>
        </div>

        <StatusBadge status={delivery.status} />
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex gap-3">
          <span className="w-5 text-slate-400">☎</span>
          <span className="text-slate-600">
            {delivery.customer_phone}
          </span>
        </div>

        <div className="flex gap-3">
          <span className="w-5 text-slate-400">⌖</span>
          <span className="text-slate-600">
            {delivery.customer_address}
          </span>
        </div>

        <div className="flex gap-3">
          <span className="w-5 text-slate-400">▣</span>
          <span className="text-slate-600">
            {delivery.item_description}
          </span>
        </div>
      </div>

      {action && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          {action}
        </div>
      )}
    </div>
  );
}

export default DeliveryCard;