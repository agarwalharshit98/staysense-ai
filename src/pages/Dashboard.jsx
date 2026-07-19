import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/ui/Loader";
import Toast from "../components/ui/Toast";
import AiReviewAssistant from "../components/AiReviewAssistant";
import { api } from "../services/api";

function Dashboard({ darkMode, setDarkMode }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    guestName: '',
    rating: 5,
    text: '',
    sentiment: 'positive',
    themes: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [reviewsData, statsData] = await Promise.all([
        api.getReviews(),
        api.getStats()
      ]);

      setReviews(reviewsData.data);
      setStats(statsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        themes: checked
          ? [...prev.themes, value]
          : prev.themes.filter(theme => theme !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      if (editingId) {
        // Update existing review
        await api.updateReview(editingId, {
          guestName: formData.guestName,
          rating: parseInt(formData.rating, 10),
          text: formData.text,
          sentiment: formData.sentiment,
          themes: formData.themes
        });
      } else {
        // Create new review
        await api.createReview({
          guestName: formData.guestName,
          rating: parseInt(formData.rating, 10),
          text: formData.text,
          sentiment: formData.sentiment,
          themes: formData.themes
        });
      }

      setFormData({
        guestName: '',
        rating: 5,
        text: '',
        sentiment: 'positive',
        themes: []
      });
      setEditingId(null);
      setShowForm(false);

      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setFormData({
      guestName: review.guestName,
      rating: review.rating,
      text: review.text,
      sentiment: review.sentiment,
      themes: review.themes || []
    });
    setEditingId(review._id || review.id);
    setShowForm(true);
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.deleteReview(id);
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      guestName: '',
      rating: 5,
      text: '',
      sentiment: 'positive',
      themes: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className={`mt-8 rounded-[2rem] border p-6 shadow-[0_0_80px_rgba(0,0,0,0.2)] sm:p-8 ${darkMode ? "border-white/10 bg-slate-900/70" : "border-emerald-100 bg-white/80"}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? "text-emerald-300" : "text-emerald-600"}`}>Live intelligence</p>
              <h1 className={`mt-2 text-3xl font-semibold sm:text-4xl ${darkMode ? "text-white" : "text-slate-900"}`}>StaySense AI dashboard</h1>
              <p className={`mt-3 max-w-2xl text-base leading-7 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Review performance, sentiment health, and recent conversations in one refined workspace.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className={`rounded-full border px-4 py-2 text-sm ${darkMode ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                Updated in real time
              </div>
              <button
                onClick={() => {
                  if (editingId) {
                    handleCancelEdit();
                  } else {
                    setShowForm(!showForm);
                  }
                }}
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
              >
                {editingId ? '✕ Cancel Edit' : '+ Add Review'}
              </button>
            </div>
          </div>

          {showForm && (
            <div className={`mt-8 rounded-2xl border p-6 ${darkMode ? "border-emerald-400/20 bg-slate-800/50" : "border-emerald-100 bg-emerald-50/30"}`}>
              <h2 className={`mb-6 text-xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{editingId ? '✎ Edit Review' : 'Add New Review'}</h2>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Guest Name</label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleFormChange}
                    placeholder="Enter guest name"
                    required
                    className={`mt-2 w-full rounded-lg border px-4 py-2 transition ${darkMode ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none" : "border-emerald-200 bg-white text-slate-900 placeholder-slate-500 focus:border-emerald-400 focus:outline-none"}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Rating (1-5)</label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleFormChange}
                      className={`mt-2 w-full rounded-lg border px-4 py-2 transition ${darkMode ? "border-slate-600 bg-slate-700 text-white focus:border-emerald-400 focus:outline-none" : "border-emerald-200 bg-white text-slate-900 focus:border-emerald-400 focus:outline-none"}`}
                    >
                      <option value="1">1 ⭐</option>
                      <option value="2">2 ⭐</option>
                      <option value="3">3 ⭐</option>
                      <option value="4">4 ⭐</option>
                      <option value="5">5 ⭐</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Sentiment</label>
                    <select
                      name="sentiment"
                      value={formData.sentiment}
                      onChange={handleFormChange}
                      className={`mt-2 w-full rounded-lg border px-4 py-2 transition ${darkMode ? "border-slate-600 bg-slate-700 text-white focus:border-emerald-400 focus:outline-none" : "border-emerald-200 bg-white text-slate-900 focus:border-emerald-400 focus:outline-none"}`}
                    >
                      <option value="positive">Positive</option>
                      <option value="neutral">Neutral</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Review Text</label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleFormChange}
                    placeholder="Write the review..."
                    required
                    rows="4"
                    className={`mt-2 w-full rounded-lg border px-4 py-2 transition ${darkMode ? "border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none" : "border-emerald-200 bg-white text-slate-900 placeholder-slate-500 focus:border-emerald-400 focus:outline-none"}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Themes</label>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {['food', 'host', 'cleanliness', 'location', 'value'].map(theme => (
                      <label key={theme} className={`flex items-center gap-2 rounded-lg border px-4 py-2 cursor-pointer transition ${formData.themes.includes(theme) ? (darkMode ? "border-emerald-400 bg-emerald-400/10" : "border-emerald-400 bg-emerald-50") : (darkMode ? "border-slate-600 hover:border-slate-500" : "border-emerald-200 hover:border-emerald-300")}`}>
                        <input
                          type="checkbox"
                          name="themes"
                          value={theme}
                          checked={formData.themes.includes(theme)}
                          onChange={handleFormChange}
                          className="rounded"
                        />
                        <span className={`text-sm font-medium capitalize ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{theme}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : (editingId ? 'Update Review' : 'Submit Review')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className={`flex-1 rounded-lg border px-4 py-2 font-semibold transition ${darkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-emerald-200 text-slate-700 hover:bg-emerald-50"}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && <div className="mt-6"><Toast message={`Error: ${error}`} /></div>}

          {loading ? (
            <div className="mt-8"><Loader /></div>
          ) : (
            <>
              {stats && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className={`rounded-2xl border p-5 ${darkMode ? "border-white/10 bg-slate-800/80" : "border-emerald-100 bg-slate-50"}`}>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total Reviews</p>
                    <p className={`mt-3 text-3xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{stats.totalReviews}</p>
                  </div>
                  <div className={`rounded-2xl border p-5 ${darkMode ? "border-white/10 bg-slate-800/80" : "border-emerald-100 bg-slate-50"}`}>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Average Rating</p>
                    <p className={`mt-3 text-3xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{stats.averageRating}/5</p>
                  </div>
                  <div className={`rounded-2xl border p-5 ${darkMode ? "border-white/10 bg-slate-800/80" : "border-emerald-100 bg-slate-50"}`}>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Positive</p>
                    <p className={`mt-3 text-3xl font-semibold text-emerald-400`}>{stats.sentimentCounts.positive}</p>
                  </div>
                  <div className={`rounded-2xl border p-5 ${darkMode ? "border-white/10 bg-slate-800/80" : "border-emerald-100 bg-slate-50"}`}>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Negative</p>
                    <p className={`mt-3 text-3xl font-semibold text-orange-400`}>{stats.sentimentCounts.negative}</p>
                  </div>
                </div>
              )}

              <AiReviewAssistant darkMode={darkMode} />

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Recent reviews</h2>
                  <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{reviews.length} items</span>
                </div>

                <div className="grid gap-4">
                  {reviews.map((review) => (
                    <div key={review._id || review.id} className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 ${darkMode ? "border-white/10 bg-slate-800/70" : "border-emerald-100 bg-slate-50"}`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <p className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{review.guestName}</p>
                          <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{review.text}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${review.sentiment === "positive" ? "bg-emerald-500/15 text-emerald-300" : review.sentiment === "negative" ? "bg-orange-500/15 text-orange-300" : "bg-slate-500/20 text-slate-300"}`}>
                            {review.sentiment}
                          </span>
                          <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>★ {review.rating}/5</span>
                        </div>
                      </div>
                      <div className={`mt-4 flex flex-wrap items-center gap-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <span>{review.date ? new Date(review.date).toLocaleDateString() : "N/A"}</span>
                        {review.themes?.length > 0 && (
                          <>
                            <span>•</span>
                            {review.themes.map((theme) => (
                              <span key={theme} className={`rounded-full px-2.5 py-1 text-xs ${darkMode ? "bg-slate-700 text-slate-300" : "bg-emerald-50 text-emerald-700"}`}>
                                {theme}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id || review.id)}
                          className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                        >
                          ✕ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default Dashboard;