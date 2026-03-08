import { login as apiLogin, register as apiRegister } from "../api/auth";

export async function login(email, password) {
  const res = await apiLogin({ email, password });
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
}

export async function register(data) {
  const res = await apiRegister(data);
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}

export function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}

export function getUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
