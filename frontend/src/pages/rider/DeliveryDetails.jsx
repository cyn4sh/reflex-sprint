import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";

function DeliveryDetails() {
  const { id } = useParams();

  const delivery = {
    id,
    customer_name: "Ali Hassan",
    customer_phone: "0712 345 678",
    customer_address: "Kilifi Town",
    item_description: "Samsung TV",
    status: "assigned",
  };

  return (
    <Layout role="rider">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/rider/dashboard"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to my deliveries
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Delivery #{delivery.id}
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              {delivery.customer_name}
            </h2>
          </div>

          <StatusBadge status={delivery.status} />
        </div>

        {/* Customer information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Delivery Information
          </h3>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Customer
              </p>

              <p className="mt-1 text-slate-800">
                {delivery.customer_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Phone
              </p>

              <a
                href={`tel:${delivery.customer_phone}`}
                className="mt-1 block font-medium text-slate-800 underline"
              >
                {delivery.customer_phone}
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Delivery Address
              </p>

              <p className="mt-1 text-slate-800">
                {delivery.customer_address}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Item
              </p>

              <p className="mt-1 text-slate-800">
                {delivery.item_description}
              </p>
            </div>
          </div>
        </div>

        {/* Status progression */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Delivery Progress
          </h3>

          <div className="mt-6 space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                ✓
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Assigned
                </p>

                <p className="text-sm text-slate-400">
                  Delivery assigned to you
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                2
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Pick Up
                </p>

                <p className="text-sm text-slate-400">
                  Confirm when you've collected the item
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                3
              </div>

              <div>
                <p className="font-semibold text-slate-400">
                  Delivered
                </p>

                <p className="text-sm text-slate-400">
                  Confirm once the customer receives the item
                </p>
              </div>
            </div>
          </div>

          <button className="mt-8 w-full rounded-xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white hover:bg-slate-800">
            Mark as Picked Up
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default DeliveryDetails;