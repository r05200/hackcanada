import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:5001/api'; // Android emulator -> host machine
// For physical device, replace with your machine's local IP, e.g.:
// const BASE_URL = 'http://192.168.x.x:5001/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = await AsyncStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
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

export const usersApi = {
  getMe: () => request('/users/me'),
  getById: (id) => request(`/users/${id}`),
  getMyBadges: () => request('/users/me/badges'),
};

export const challengesApi = {
  getAll: () => request('/challenges/'),
  getById: (id) => request(`/challenges/${id}`),
  create: (data) => request('/challenges/', { method: 'POST', body: data }),
  submit: (id, data) => request(`/challenges/${id}/submit`, { method: 'POST', body: data }),
};

export const eventsApi = {
  getAll: (neighborhood) => {
    const query = neighborhood ? `?neighborhood=${encodeURIComponent(neighborhood)}` : '';
    return request(`/events/${query}`);
  },
  getById: (id) => request(`/events/${id}`),
  create: (data) => request('/events/', { method: 'POST', body: data }),
  checkin: (id) => request(`/events/${id}/checkin`, { method: 'POST' }),
};

export const leaderboardApi = {
  getGlobal: (limit = 20) => request(`/leaderboard/?limit=${limit}`),
  getByNeighborhood: (neighborhood, limit = 20) =>
    request(`/leaderboard/neighborhood/${encodeURIComponent(neighborhood)}?limit=${limit}`),
};
