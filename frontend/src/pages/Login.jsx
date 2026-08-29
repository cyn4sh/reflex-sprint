import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const data = await login(
        formData.username,
        formData.password
      );

      /*
       * For now, use the role returned by the backend.
       * If the backend does not return a role yet,
       * we temporarily send the user to the retailer dashboard.
       */

      const role = data?.user?.role || data?.role;

      if (role === "dispatcher") {
        navigate("/dispatcher/dashboard");
      } else if (role === "rider") {
        navigate("/rider/dashboard");
      } else {
        navigate("/retailer/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to sign in. Please check your username and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen w-full bg-slate-50">
     <div className="flex min-h-screen flex-col lg:flex-row">

        {/* Left side */}
        <div className="hidden w-1/2 bg-slate-900 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-900">
                R
              </div>

              <span className="text-xl font-bold text-white">
                Reflex
              </span>
            </div>

            <div className="mt-24 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Delivery Management
              </p>

              <h1 className="mt-4 text-5xl font-bold leading-tight text-white">
                Deliveries,
                <br />
                without the guesswork.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Manage delivery requests, assign riders and track
                every delivery from pickup to completion.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Reflex Delivery Management System
          </p>
        </div>

        {/* Right side */}
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:min-h-screen lg:w-1/2 lg:px-10 lg:py-12">
        <div className="w-full max-w-md">
            {/* Mobile logo */}
<div className="mb-8 flex items-center justify-center gap-3 sm:mb-10 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
                R
              </div>

              <span className="text-xl font-bold text-slate-900">
                Reflex
              </span>
            </div>

<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Welcome back
                </p>

<h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Sign in
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to manage your Reflex deliveries.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              <form
  onSubmit={handleSubmit}
  className="mt-6 space-y-5 sm:mt-8"
>
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                    className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-[48px] w-full rounded-xl bg-slate-900 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Secure delivery management for Kenyan retailers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;