import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import api from "../api/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!form.email.trim() || !form.password.trim()) {
    setError("Please enter email and password.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await api.post("/Auth/login", {
      email: form.email.trim(),
      password: form.password,
    });

    if (!res.data?.token) {
      throw new Error("Token was not returned by the server.");
    }

    localStorage.setItem("adminToken", res.data.token);
    localStorage.setItem("adminUser", JSON.stringify(res.data.user));

    navigate("/admin", { replace: true });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    if (error.response?.status === 401) {
      setError("Invalid email or password.");
    } else if (error.response?.status === 500) {
      setError("Server error occurred. Please check backend logs.");
    } else if (error.code === "ERR_NETWORK") {
      setError("Unable to connect to the backend server.");
    } else {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">

      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"></div>

      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="hidden flex-col justify-center bg-gradient-to-br from-emerald-600 to-cyan-700 p-12 lg:flex">

          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Sparkles size={34} />
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Portfolio CMS
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/90">
            Manage your projects, blogs, testimonials,
            contact messages and portfolio content
            from one secure dashboard.
          </p>

          <div className="mt-12 space-y-5">

            <div className="flex items-center gap-3">
              <ShieldCheck />
              Secure JWT Authentication
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck />
              Portfolio Content Management
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck />
              AI Portfolio Assistant
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-10 lg:p-14">

          <div className="mb-10">

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-emerald-400">
              Admin Panel
            </p>

            <h2 className="text-4xl font-bold">
              Welcome Back
            </h2>

            <p className="mt-3 text-slate-400">
              Sign in to manage your portfolio.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            <div className="relative mb-5">

              <Mail
                size={18}
                className="absolute left-4 top-4 text-slate-500"
              />

              <input
                type="email"
                required
                placeholder="Admin Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-12 pr-4 outline-none focus:border-emerald-400"
              />

            </div>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-4 text-slate-500"
              />

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-12 pr-12 outline-none focus:border-emerald-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            <div className="my-5 flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input type="checkbox" />
                Remember Me
              </label>

              <button
                type="button"
                className="text-sm text-emerald-400 hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 font-semibold transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Login"}
            </button>

          </form>

          <p className="mt-10 text-center text-sm text-slate-500">
            © 2026 Ahmad Portfolio CMS
          </p>

        </div>

      </div>

    </main>
  );
};

export default AdminLogin;