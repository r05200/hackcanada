const BASE_URL = 'http://localhost:5000'; // TODO: update with actual backend URL

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }
  return response.json();
}

export const authApi = {
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
};

export const reportsApi = {
  create: (data) => request('/challenges', { method: 'POST', body: data }),
  getAll: () => request('/challenges'),
  getById: (id) => request(`/challenges/${id}`),
};

export const usersApi = {
  getProfile: (id) => request(`/users/${id}`),
  getLeaderboard: () => request('/leaderboard'),
};

export const eventsApi = {
  getAll: () => request('/events'),
};
