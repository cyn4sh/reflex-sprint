import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { getDelivery, pickUpDelivery, confirmDelivery } from "../../services/deliveries";

function DeliveryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState("");

  const loadDelivery = () => {
    getDelivery(id).then(setDelivery);
  };

  useEffect(() => {
    loadDelivery();
  }, [id]);

  const handlePickUp = async () => {
    setError("");
    try {
      await pickUpDelivery(id);
      loadDelivery();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to mark as picked up.");
    }
  };

  const handleConfirm = async () => {
    setError("");
    const code = prompt("Enter/scan the confirmation code:");
    if (!code) return;

    try {
      await confirmDelivery(id, code);
      loadDelivery();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to confirm delivery.");
    }
  };

  if (!delivery) {
    return (
      <Layout role="rider">
        <div className="mx-auto max-w-3xl">
          <p className="text-slate-500">Loading delivery...</p>
        </div>
      </Layout>
    );
  }

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

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

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
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${delivery.status === "picked_up" || delivery.status === "delivered" ? "bg-emerald-100 text-emerald-700" : "bg-slate-900 text-white"}`}>
                {delivery.status === "picked_up" || delivery.status === "delivered" ? "✓" : "2"}
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
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${delivery.status === "delivered" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                {delivery.status === "delivered" ? "✓" : "3"}
              </div>

              <div>
                <p className={`font-semibold ${delivery.status === "delivered" ? "text-slate-800" : "text-slate-400"}`}>
                  Delivered
                </p>

                <p className="text-sm text-slate-400">
                  Confirm once the customer receives the item
                </p>
              </div>
            </div>
          </div>

          {delivery.status === "assigned" && (
            <button
              onClick={handlePickUp}
              className="mt-8 w-full rounded-xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Mark as Picked Up
            </button>
          )}

          {delivery.status === "picked_up" && (
            <button
              onClick={handleConfirm}
              className="mt-8 w-full rounded-xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default DeliveryDetails;