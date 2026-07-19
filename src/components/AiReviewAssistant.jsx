import { useState } from "react";
import Loader from "./ui/Loader";
import Toast from "./ui/Toast";
import { api } from "../services/api";

function AiReviewAssistant({ darkMode }) {
  const [reviewText, setReviewText] = useState("");
  const [variant, setVariant] = useState("balanced");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const promptVariants = [
    { id: "balanced", label: "Balanced" },
    { id: "concise", label: "Concise" },
    { id: "insightful", label: "Insightful" }
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!reviewText.trim()) {
      setError("Please enter a review to summarise.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.generateAiSummary(reviewText, variant);
      setResult(response.data);
    } catch (err) {
      setError(err.message || "The AI assistant could not respond right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-8 rounded-2xl border p-6 ${darkMode ? "border-emerald-400/20 bg-slate-800/70" : "border-emerald-100 bg-emerald-50/40"}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}>AI review assistant</p>
          <h2 className={`mt-2 text-2xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Summarise guest feedback and draft a reply</h2>
          <p className={`mt-2 max-w-2xl text-sm leading-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Paste a guest review and let the AI turn it into a concise summary plus a polished host response.
          </p>
        </div>
        <div className={`rounded-full border px-3 py-1 text-sm ${darkMode ? "border-slate-600 text-slate-300" : "border-emerald-200 text-emerald-700"}`}>
          Uses your configured AI provider
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className={`mb-2 block text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Review text</label>
          <textarea
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            rows="5"
            placeholder="Example: The host was friendly and the apartment was spotless. The location was perfect for exploring the city."
            className={`w-full rounded-xl border px-4 py-3 transition ${darkMode ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none" : "border-emerald-200 bg-white text-slate-900 placeholder-slate-500 focus:border-emerald-400 focus:outline-none"}`}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Prompt style</label>
            <select
              value={variant}
              onChange={(event) => setVariant(event.target.value)}
              className={`rounded-lg border px-3 py-2 ${darkMode ? "border-slate-600 bg-slate-700 text-white" : "border-emerald-200 bg-white text-slate-900"}`}
            >
              {promptVariants.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate AI Insight"}
          </button>
        </div>
      </form>

      {loading && (
        <div className="mt-6 flex justify-center">
          <Loader />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <Toast message={error} />
        </div>
      )}

      {result && (
        <div className={`mt-6 rounded-xl border p-4 ${darkMode ? "border-slate-600 bg-slate-900/70" : "border-emerald-100 bg-white"}`}>
          <div className="space-y-3">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}>Summary</p>
              <p className={`mt-2 text-sm leading-6 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{result.summary}</p>
            </div>
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}>Suggested reply</p>
              <p className={`mt-2 text-sm leading-6 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{result.suggestedReply}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiReviewAssistant;
