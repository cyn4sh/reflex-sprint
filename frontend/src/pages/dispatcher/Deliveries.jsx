import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { getDispatcherDeliveries } from "../../services/deliveries";

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    getDispatcherDeliveries().then(setDeliveries);
  }, []);

  return (
    <Layout role="dispatcher">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Operations
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Delivery Requests
          </h2>

          <p className="mt-2 text-slate-500">
            Manage assignments and monitor delivery progress.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Delivery
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Rider
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {deliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-5">
                      <span className="font-semibold text-slate-900">
                        #{delivery.id}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-sm font-medium text-slate-700">
                      {delivery.customer_name}
                    </td>

                    <td className="px-5 py-5 text-sm text-slate-500">
                      {delivery.customer_address}
                    </td>

                    <td className="px-5 py-5 text-sm text-slate-500">
                      {delivery.rider ? `Rider #${delivery.rider}` : "Not assigned"}
                    </td>

                    <td className="px-5 py-5">
                      <StatusBadge status={delivery.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Deliveries;