const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('staysense_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Get all reviews with optional filters
  getReviews: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_BASE_URL}/reviews${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  // Get single review by ID
  getReview: async (id) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch review');
    return response.json();
  },

  // Create new review
  createReview: async (reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return response;
  },

  // Search reviews
  searchReviews: async (query) => {
    const response = await fetch(`${API_BASE_URL}/reviews/search?q=${encodeURIComponent(query)}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to search reviews');
    return response.json();
  },

  // Get review statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/stats`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },

  // Add response to review
  addResponse: async (id, responseText) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ response: responseText }),
    });
    if (!response.ok) throw new Error('Failed to add response');
    return response.json();
  },

  generateAiSummary: async (reviewText, variant = 'balanced') => {
    const response = await fetch(`${API_BASE_URL}/ai/summarise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ reviewText, variant }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Failed to generate AI summary');
    return payload;
  },
};
