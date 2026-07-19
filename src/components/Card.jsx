function Card({ title, description }) {
  return (
    <div className="group rounded-2xl border border-emerald-400/20 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:shadow-[0_0_45px_rgba(249,115,22,0.18)]">
      <div className="mb-4 h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </div>
  );
}

export default Card;