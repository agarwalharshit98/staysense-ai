import { Link } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  const navLinkClass = darkMode
    ? "text-slate-300 transition hover:text-white"
    : "text-slate-600 transition hover:text-slate-900";

  return (
    <nav className={`mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between rounded-full border px-5 py-3 shadow-[0_0_40px_rgba(0,0,0,0.25)] backdrop-blur-xl ${darkMode ? "border-white/10 bg-slate-900/70" : "border-emerald-200 bg-white/80"}`}>
      <Link to="/" className={`text-lg font-semibold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
        <span className="mr-2 text-orange-500">◎</span>
        StaySense AI
      </Link>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <Link to="/" className={navLinkClass}>Home</Link>
        <Link to="/about" className={navLinkClass}>About</Link>
        <Link to="/dashboard" className={navLinkClass}>Dashboard</Link>
        <Link to="/login" className={navLinkClass}>Login</Link>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition hover:scale-105 ${darkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;