import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { getRiderDeliveries, pickUpDelivery, confirmDelivery } from "../../services/deliveries";

function RiderDashboard() {
  const [deliveries, setDeliveries] = useState([]);

  const loadDeliveries = () => {
    getRiderDeliveries().then(setDeliveries);
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handlePickUp = async (id) => {
    try {
      await pickUpDelivery(id);
      loadDeliveries();
    } catch (error) {
      console.error("Pick up error:", error);
      alert(error.response?.data?.detail || "Unable to mark as picked up.");
    }
  };

  const handleConfirm = async (id) => {
    const code = prompt("Enter/scan the confirmation code:");
    if (!code) return;

    try {
      await confirmDelivery(id, code);
      loadDeliveries();
    } catch (error) {
      console.error("Confirm error:", error);
      alert(error.response?.data?.detail || "Unable to confirm delivery.");
    }
  };

  const assignedCount = deliveries.filter((d) => d.status === "assigned").length;
  const pickedUpCount = deliveries.filter((d) => d.status === "picked_up").length;
  const deliveredCount = deliveries.filter((d) => d.status === "delivered").length;

  return (
    <Layout role="rider">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-sm font-medium text-slate-500">
            On the road
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            My Deliveries
          </h2>

          <p className="mt-2 text-slate-500">
            View your assigned deliveries and update their status.
          </p>
        </div>

        {/* Rider stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Assigned
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {assignedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Picked Up
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {pickedUpCount}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-1">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {deliveredCount}
            </p>
          </div>
        </div>

        {/* Delivery cards */}
        <div className="mt-8 space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Delivery #{delivery.id}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {delivery.customer_name}
                    </h3>
                  </div>

                  <StatusBadge status={delivery.status} />
                </div>

                <div className="grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {delivery.customer_phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Address
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {delivery.customer_address}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Item
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {delivery.item_description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {delivery.status === "assigned" && (
                    <button
                      onClick={() => handlePickUp(delivery.id)}
                      className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Mark as Picked Up
                    </button>
                  )}

                  {delivery.status === "picked_up" && (
                    <button
                      onClick={() => handleConfirm(delivery.id)}
                      className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Mark as Delivered
                    </button>
                  )}

                  <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default RiderDashboard;