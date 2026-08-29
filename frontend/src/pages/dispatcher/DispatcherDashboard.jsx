import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { getDispatcherDeliveries } from "../../services/deliveries";

function DispatcherDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getDispatcherDeliveries().then(setRequests);
  }, []);

  const stats = [
    {
      label: "Open Requests",
      value: requests.filter((r) => r.status === "pending").length,
      description: "Waiting for assignment",
    },
    {
      label: "Assigned",
      value: requests.filter((r) => r.status === "assigned").length,
      description: "Currently assigned",
    },
    {
      label: "In Transit",
      value: requests.filter((r) => r.status === "picked_up").length,
      description: "Riders on delivery",
    },
    {
      label: "Delivered",
      value: requests.filter((r) => r.status === "delivered").length,
      description: "Completed deliveries",
    },
  ];

  return (
    <Layout role="dispatcher">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Operations
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Dispatcher Dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            Monitor requests and keep deliveries moving.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Requests */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5">
            <h3 className="font-semibold text-slate-900">
              Delivery Requests
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Requests requiring dispatcher attention
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-slate-900">
                      #{request.id}
                    </p>

                    <StatusBadge status={request.status} />
                  </div>

                  <p className="mt-2 font-medium text-slate-700">
                    {request.customer_name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {request.item_description} ·{" "}
                    {request.customer_address}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  {request.status === "pending" ? (
                    <Link
                      to={`/dispatcher/deliveries/${request.id}/assign`}
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Assign Rider
                    </Link>
                  ) : (
                    <Link
                      to={`/dispatcher/deliveries/${request.id}`}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DispatcherDashboard;