import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout";

function AssignDelivery() {
  const { id } = useParams();

  const [selectedRider, setSelectedRider] = useState("");

  const riders = [
    {
      id: 1,
      name: "Ahmed Hassan",
      status: "Available",
    },
    {
      id: 2,
      name: "Mohamed Ali",
      status: "Available",
    },
    {
      id: 3,
      name: "Yusuf Omar",
      status: "On Delivery",
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Assign delivery:", {
      deliveryId: id,
      rider: selectedRider,
    });
  };

  return (
    <Layout role="dispatcher">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/dispatcher/dashboard"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to requests
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-500">
            Delivery #{id}
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Assign Rider
          </h2>

          <p className="mt-2 text-slate-500">
            Select an available rider for this delivery.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <label
            htmlFor="rider"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Select Rider
          </label>

          <select
            id="rider"
            value={selectedRider}
            onChange={(event) => setSelectedRider(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Choose a rider</option>

            {riders.map((rider) => (
              <option
                key={rider.id}
                value={rider.id}
                disabled={rider.status !== "Available"}
              >
                {rider.name} — {rider.status}
              </option>
            ))}
          </select>

          <div className="mt-8 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Delivery
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              Delivery #{id}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Assignment will be visible to the selected rider.
            </p>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/dispatcher/dashboard"
              className="rounded-xl px-5 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Assign Rider
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AssignDelivery;