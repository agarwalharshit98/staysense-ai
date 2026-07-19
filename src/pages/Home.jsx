import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

function Home({ darkMode, setDarkMode }) {
  return (
    <div className={`min-h-screen ${darkMode ? "bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_50%),linear-gradient(135deg,#020617_0%,#0f172a_100%)]" : "bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.16),_transparent_50%),linear-gradient(135deg,#f8fffe_0%,#f1f5f9_100%)]"}`}>
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Hero />

        <section className="px-2 py-8 sm:px-0">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium uppercase tracking-[0.3em] ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}>Core capabilities</p>
              <h2 className={`mt-2 text-2xl font-semibold sm:text-3xl ${darkMode ? "text-white" : "text-slate-900"}`}>Built for modern hospitality teams</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Sentiment Analysis" description="Classify reviews as Positive, Neutral, or Negative with elegant clarity." />
            <Card title="Theme Detection" description="Spot food, host, cleanliness, location, and value themes instantly." />
            <Card title="AI Responses" description="Generate polished response suggestions that sound human and premium." />
          </div>
        </section>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default Home;