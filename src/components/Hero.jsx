import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 px-6 py-16 text-center shadow-[0_0_80px_rgba(16,185,129,0.18)] ring-1 ring-white/10 sm:px-10 lg:px-16">
        <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
          AI review intelligence for modern hospitality
        </div>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
          Turn guest feedback into premium hospitality decisions.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
          StaySense AI helps teams uncover sentiment, detect themes, and craft faster, sharper responses from every review.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/dashboard" className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-[0_0_35px_rgba(249,115,22,0.35)] transition hover:-translate-y-1 hover:bg-orange-400">
            Launch dashboard
          </Link>
          <Link to="/about" className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-semibold text-slate-100 transition hover:-translate-y-1 hover:bg-white/20">
            Explore platform
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;