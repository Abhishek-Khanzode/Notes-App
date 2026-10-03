import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors, e.g., redirect to login if 401
    if (error.response && error.response.status === 401) {
       // Optional: you can trigger a logout or window.location.href = '/login' if appropriate
    }
    return Promise.reject(error);
  }
);

export default api;
