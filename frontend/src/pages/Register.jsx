import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import BrandMark from "../components/BrandMark";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await register(
      form.name,
      form.email,
      form.password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="app-theme">

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0c0a1f]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">

          <Link to="/" className="flex items-center gap-2">
            <BrandMark />

            <span className="text-lg font-extrabold tracking-tight text-white">
              VELOop<span className="text-yellow-300">.</span>
            </span>
          </Link>

          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-100/70 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
          >
            Back to home
          </Link>

        </div>
      </header>


      {/* Main */}
      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#15113a]/65 shadow-[0_32px_90px_-42px_rgba(0,0,0,0.85)] ring-1 ring-white/10 backdrop-blur-xl lg:grid-cols-[1fr_0.92fr]">


          {/* Left panel */}
          <div className="relative hidden min-h-[640px] overflow-hidden bg-gradient-to-br from-violet-950 via-[#11102e] to-fuchsia-950 p-9 text-white sm:p-11 lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">

              <div className="flex items-center gap-3">
                <BrandMark className="h-10 w-10" />

                <div>
                  <p className="text-lg font-extrabold">VELOop Rewards</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200/60">Play • Complete • Earn</p>
                </div>
              </div>

              <div className="mt-14 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-indigo-100/80">
                <span className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.8)]" />
                A fresh start, one activity at a time
              </div>
              <h1 className="mt-6 max-w-md text-4xl font-black leading-[1.08] tracking-tight xl:text-5xl">
                Your next reward <span className="bg-gradient-to-r from-yellow-200 via-pink-300 to-cyan-300 bg-clip-text text-transparent">starts here.</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-indigo-100/65">
                Create an account to discover activities, collect rewards and track everything in one wallet.
              </p>

            </div>


            <div className="relative rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-200/60">Everything you need to get started</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["01", "Join"],
                  ["02", "Explore"],
                  ["03", "Earn"],
                ].map(([number, label]) => (
                  <div key={number} className="rounded-xl bg-white/5 px-2 py-3">
                    <span className="text-xs font-black text-yellow-300">{number}</span>
                    <p className="mt-1 text-xs font-semibold text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>


          {/* Registration form */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-[410px]">

              <div className="mb-7">

                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow-300">
                  Free membership
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Create your account.
                </h2>

                <p className="mt-2 text-sm leading-6 text-indigo-100/60">
                  A few details, then you’re ready to explore VELOop.
                </p>

              </div>


              {/* Error */}
              {error && (
                <div role="alert" className="mb-6 rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}


              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-indigo-100/90"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/10 bg-[#0c0a1f]/65 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-indigo-200/35 focus:border-yellow-300/70 focus:ring-4 focus:ring-yellow-300/10"
                  />
                </div>


                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-indigo-100/90"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-[#0c0a1f]/65 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-indigo-200/35 focus:border-yellow-300/70 focus:ring-4 focus:ring-yellow-300/10"
                  />
                </div>


                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-indigo-100/90"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-[#0c0a1f]/65 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-indigo-200/35 focus:border-yellow-300/70 focus:ring-4 focus:ring-yellow-300/10"
                  />

                  <p className="mt-2 text-xs text-indigo-100/45">
                    Use at least 8 characters.
                  </p>
                </div>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-yellow-300 px-5 py-4 text-sm font-extrabold text-neutral-950 shadow-[0_5px_0_0_#b8890b,0_16px_35px_-16px_rgba(250,204,21,0.7)] transition hover:-translate-y-0.5 hover:bg-yellow-200 active:translate-y-1 active:shadow-[0_1px_0_0_#b8890b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>

              </form>


              {/* Login */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-[10px] font-bold tracking-[0.18em] text-indigo-200/35">
                  ALREADY A MEMBER?
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>


              <p className="text-center text-sm text-indigo-100/60">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-yellow-300 underline decoration-yellow-300/50 decoration-2 underline-offset-4 transition hover:text-yellow-200"
                >
                  Login
                </Link>
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Register;