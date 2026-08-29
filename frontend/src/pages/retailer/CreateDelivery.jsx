
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

function CreateDelivery() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    item_description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      /*
       * API connection will be added after
       * the frontend form is confirmed working.
       */

      console.log("Delivery submitted:", formData);

      // Temporary success behaviour
      navigate("/retailer/dashboard");
    } catch (error) {
      console.error("Create delivery error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to create delivery. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="retailer">
      <div className="mx-auto w-full max-w-3xl">

        {/* Back link */}
        <Link
          to="/retailer/dashboard"
          className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to dashboard
        </Link>

        {/* Page heading */}
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-500">
            Retailer
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            New Delivery
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Create a delivery request for your customer.
          </p>
        </div>

        {/* Form card */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Customer information */}
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Customer Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the details of the person receiving the delivery.
              </p>
            </div>

            {/* Customer name + phone */}
            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="customer_name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Customer Name
                </label>

                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Ali Hassan"
                  required
                  className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="customer_phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Customer Phone
                </label>

                <input
                  id="customer_phone"
                  name="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="e.g. 0712 345 678"
                  required
                  autoComplete="tel"
                  className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:text-sm"
                />
              </div>

            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="customer_address"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Delivery Address
              </label>

              <textarea
                id="customer_address"
                name="customer_address"
                value={formData.customer_address}
                onChange={handleChange}
                placeholder="Enter the customer's delivery address"
                rows="4"
                required
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:text-sm"
              />
            </div>

            {/* Item */}
            <div>
              <label
                htmlFor="item_description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Item Description
              </label>

              <textarea
                id="item_description"
                name="item_description"
                value={formData.item_description}
                onChange={handleChange}
                placeholder="Describe the item being delivered"
                rows="4"
                required
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <Link
                to="/retailer/dashboard"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Delivery"}
              </button>

            </div>

          </form>
        </div>

        {/* Help text */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          After creating the request, a dispatcher will assign a rider
          to the delivery.
        </p>

      </div>
    </Layout>
  );
}

export default CreateDelivery;

