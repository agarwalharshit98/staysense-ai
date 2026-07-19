import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About({ darkMode, setDarkMode }) {
  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <section className={`mt-8 rounded-[2rem] border p-8 shadow-[0_0_60px_rgba(0,0,0,0.2)] sm:p-12 ${darkMode ? "border-white/10 bg-slate-900/70" : "border-emerald-100 bg-white/80"}`}>
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}>About StaySense AI</p>
          <h1 className={`mt-4 text-3xl font-semibold sm:text-4xl ${darkMode ? "text-white" : "text-slate-900"}`}>Clarity for every guest conversation.</h1>
          <p className={`mt-6 max-w-3xl text-lg leading-8 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            StaySense AI helps hospitality teams understand guest feedback using AI-powered sentiment analysis, theme detection, and response suggestions. It turns raw reviews into actionable insights without changing the underlying workflow.
          </p>
        </section>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default About;