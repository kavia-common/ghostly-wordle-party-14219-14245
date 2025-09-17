//
// Minimal API client wrapping fetch to talk to backend REST endpoints.
// Uses same-origin credentials for cookie-based auth sessions.
//
const API_BASE = process.env.REACT_APP_API_BASE || "/api";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  };
  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, opts);
  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    const text = await res.text().catch(() => "");
    data = text || null;
  }
  if (!res.ok) {
    const err = new Error((data && data.detail) || "Request failed");
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export const authApi = {
  /** Login with username and password */
  login: (username, password) =>
    request("/auth/login/", { method: "POST", body: { username, password } }),

  /** Register a new user */
  register: ({ username, email, password }) =>
    request("/auth/register/", {
      method: "POST",
      body: { username, email, password },
    }),

  /** Logout current session */
  logout: () => request("/auth/logout/", { method: "POST" }),

  /** Request password reset token via email */
  requestPasswordReset: (email) =>
    request("/auth/password-reset/", { method: "POST", body: { email } }),

  /** Confirm password reset with uid, token and new_password */
  confirmPasswordReset: ({ uid, token, new_password }) =>
    request("/auth/password-reset-confirm/", {
      method: "POST",
      body: { uid, token, new_password },
    }),
};

// PUBLIC_INTERFACE
export const userApi = {
  /** Get current user profile + stats */
  me: () => request("/me/", { method: "GET" }),
  /** Get recent game history */
  history: (limit = 20) => request(`/me/history/?limit=${limit}`, { method: "GET" }),
};

// PUBLIC_INTERFACE
export const gameApi = {
  /** Get current active game, 200 or 204 */
  current: () => request("/game/current/", { method: "GET" }),
  /** Start a new game */
  newGame: (max_attempts = 6) =>
    request("/game/new/", { method: "POST", body: { max_attempts } }),
  /** Submit a guess, optionally with game_id param */
  guess: ({ guess, game_id }) => {
    const q = game_id ? `?game_id=${encodeURIComponent(game_id)}` : "";
    return request(`/game/guess/${q}`, { method: "POST", body: { guess } });
  },
  /** Reveal word for given game */
  reveal: (game_id) =>
    request(`/game/reveal/?game_id=${encodeURIComponent(game_id)}`, { method: "GET" }),
};

// PUBLIC_INTERFACE
export const leaderboardApi = {
  /** Get leaderboard by type: streak | win_rate | fastest | best_attempts */
  list: (type, limit = 20) =>
    request(`/leaderboard/?type=${encodeURIComponent(type)}&limit=${encodeURIComponent(limit)}`, {
      method: "GET",
    }),
};

// PUBLIC_INTERFACE
export const effectsApi = {
  /** Request backend to generate effect payload; optional to check consistency */
  trigger: (effect, context = {}) =>
    request("/effects/trigger/", { method: "POST", body: { effect, context } }),
};
