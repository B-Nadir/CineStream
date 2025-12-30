const API_BASE = "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}

/* AUTH */
export function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function getMe() {
  return request("/auth/me");
}

/* WATCHLIST */
export function addToWatchlist(payload) {
  return request("/watchlist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function removeFromWatchlist(id, type) {
  return request(`/watchlist/${id}/${type}`, {
    method: "DELETE",
  });
}

export function getWatchlist() {
  return request("/watchlist");
}

/* MOVIES / SERIES */
export function getMovies(params) {
  const q = new URLSearchParams(params).toString();
  return request(`/movies?${q}`);
}

export function getSeries(params) {
  const q = new URLSearchParams(params).toString();
  return request(`/series?${q}`);
}

export function getMovieDetail(id) {
  return request(`/movies/${id}`);
}

export function getSeriesDetail(id) {
  return request(`/series/${id}`);
}

export function getSearchResults(type, query) {
  return request(`/search?type=${type}&query=${encodeURIComponent(query)}`);
}

export function getHome() {
  return request("/home");
}

export function getToken() {
  return localStorage.getItem("token");
}
