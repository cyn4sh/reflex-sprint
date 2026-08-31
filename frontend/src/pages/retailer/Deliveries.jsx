import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { getDeliveries } from "../../services/deliveries";

function Deliveries() {
  const [filter, setFilter] = useState("all");
  const [deliveries, setDeliveries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getDeliveries().then(setDeliveries);
  }, []);

  const filteredDeliveries =
    filter === "all"
      ? deliveries
      : deliveries.filter((delivery) => delivery.status === filter);

  return (
    <Layout role="retailer">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Deliveries
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            My Deliveries
          </h2>

          <p className="mt-2 text-slate-500">
            Track all your delivery requests.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["pending", "Pending"],
            ["assigned", "Assigned"],
            ["picked_up", "Picked Up"],
            ["delivered", "Delivered"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                filter === value
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-6 space-y-4">
          {filteredDeliveries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="font-semibold text-slate-700">
                No deliveries found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                There are no deliveries with this status.
              </p>
            </div>
          ) : (
            filteredDeliveries.map((delivery) => {
              const isExpanded = expandedId === delivery.id;

              return (
                <div
                  key={delivery.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          #{delivery.id}
                        </span>

                        <StatusBadge status={delivery.status} />
                      </div>

                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {delivery.customer_name}
                      </h3>

                      <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-3">
                        <span>{delivery.customer_phone}</span>
                        <span>{delivery.customer_address}</span>
                        <span>{delivery.item_description}</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : delivery.id)
                      }
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-5 border-t border-slate-100 pt-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Confirmation code
                          </p>
                          <p className="mt-1 font-mono text-lg font-semibold text-slate-900">
                            {delivery.confirmation_code}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Share this with your rider to confirm delivery.
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Rider
                          </p>
                          <p className="mt-1 text-slate-700">
                            {delivery.rider ?? "Not yet assigned"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Deliveries;