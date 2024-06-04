const API_URL = "http://localhost:5000"; // Replace with your backend URL
import api from "./api";

export const register = async (email, password) => {
  try {
    const response = await api.post(`${API_URL}/register`, {
      email,
      password,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post(`${API_URL}/login`, { email, password });
    console.log(response);
    if (response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post(`${API_URL}/token`, {
      token: refreshToken,
    });
    if (response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data.accessToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

export const protectedAPI = async () => {
  try {
    const response = await api.get(`${API_URL}/protected`);
    return response.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
