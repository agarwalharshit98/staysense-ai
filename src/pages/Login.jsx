import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login({ darkMode, setDarkMode }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/" + mode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.errors?.join(" ") || "Authentication failed");
      }

      localStorage.setItem("staysense_token", data.token);
      localStorage.setItem("staysense_user", JSON.stringify(data.user));
      setMessage(mode === "login" ? "Welcome back!" : "Account created successfully.");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <section className={`mt-10 rounded-[2rem] border p-8 shadow-[0_0_60px_rgba(0,0,0,0.2)] sm:p-12 ${darkMode ? "border-white/10 bg-slate-900/70" : "border-emerald-100 bg-white/80"}`}>
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}>Secure access</p>
          <h1 className={`mt-4 text-3xl font-semibold sm:text-4xl ${darkMode ? "text-white" : "text-slate-900"}`}>{mode === "login" ? "Sign in to StaySense AI" : "Create your StaySense AI account"}</h1>
          <p className={`mt-4 max-w-2xl text-lg leading-8 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Use email and password authentication with JWT protection for your dashboard.
          </p>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-300"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-300"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
            <div>
              <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className={`w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? "border-white/10 bg-slate-950/70 text-white" : "border-emerald-100 bg-white text-slate-900"}`}
              />
            </div>
            <div>
              <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-700"}`}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength="8"
                className={`w-full rounded-2xl border px-4 py-3 outline-none ${darkMode ? "border-white/10 bg-slate-950/70 text-white" : "border-emerald-100 bg-white text-slate-900"}`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {message ? <p className={`mt-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{message}</p> : null}
        </section>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default Login;