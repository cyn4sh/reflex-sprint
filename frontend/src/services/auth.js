import api from "./api";

export const loginUser = async (username, password) => {
  const response = await api.post("/token/", {
    username,
    password,
  });

  const { access, refresh } = response.data;

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  return response.data;
};

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");

  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const response = await api.post("/token/refresh/", {
    refresh,
  });

  localStorage.setItem("access_token", response.data.access);

  return response.data.access;
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("access_token"));
};