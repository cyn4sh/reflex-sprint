import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";

function RetailerDashboard() {
  const stats = [
    {
      label: "Total Deliveries",
      value: "24",
      description: "All requests",
    },
    {
      label: "Pending",
      value: "5",
      description: "Awaiting assignment",
    },
    {
      label: "In Transit",
      value: "8",
      description: "Currently moving",
    },
    {
      label: "Delivered",
      value: "11",
      description: "Successfully completed",
    },
  ];

  const recentDeliveries = [
    {
      id: 1024,
      customer_name: "Ali Hassan",
      customer_phone: "0712 345 678",
      customer_address: "Kilifi Town",
      item_description: "Samsung TV",
      status: "picked_up",
    },
    {
      id: 1023,
      customer_name: "Fatuma Said",
      customer_phone: "0701 222 333",
      customer_address: "Mtwapa",
      item_description: "Pharmacy supplies",
      status: "assigned",
    },
    {
      id: 1022,
      customer_name: "Mohamed Salim",
      customer_phone: "0722 111 444",
      customer_address: "Bamburi",
      item_description: "Laptop accessories",
      status: "delivered",
    },
  ];

  return (
    <Layout role="retailer">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Overview
            </p>

<h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Retailer Dashboard
            </h2>

            <p className="mt-2 text-slate-500">
              Keep track of every delivery request from one place.
            </p>
          </div>

          <Link
            to="/retailer/deliveries/new"
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:w-auto"
          >
            <span className="mr-2 text-lg">+</span>
            New Delivery
          </Link>
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

        {/* Recent deliveries */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Recent Deliveries
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Your latest delivery requests
              </p>
            </div>

            <Link
              to="/retailer/deliveries"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              View all →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    #{delivery.id} · {delivery.customer_name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {delivery.item_description} ·{" "}
                    {delivery.customer_address}
                  </p>
                </div>

<div className="self-start sm:self-auto">
  <StatusBadge status={delivery.status} />
</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RetailerDashboard;