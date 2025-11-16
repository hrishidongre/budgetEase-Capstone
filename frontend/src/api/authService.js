import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send/receive cookies
});

export const authService = {

  // SIGNUP
  async signup(fullName, email, password) {
    try {
      const response = await apiClient.post('/auth/signup', {
        fullName,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  // LOGIN
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // LOGOUT
  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  // VERIFY TOKEN (Checks session)
  async verifyToken() {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch {
      return null; // user is not logged in
    }
  },
};
