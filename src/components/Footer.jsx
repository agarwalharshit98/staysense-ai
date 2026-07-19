function Footer({ darkMode }) {
  return (
    <footer className={`mt-16 border-t px-6 py-8 text-center sm:px-8 ${darkMode ? "border-white/10 bg-slate-950/90 text-slate-400" : "border-emerald-100 bg-slate-50 text-slate-600"}`}>
      <p className="text-sm">© 2026 StaySense AI</p>
      <p className="mt-1 text-sm">Built by Harshit Agarwal</p>
    </footer>
  );
}

export default Footer;