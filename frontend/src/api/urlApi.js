import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export async function createShortUrl(originalUrl) {
  const response = await apiClient.post('/api/urls', { originalUrl });
  return response.data;
}

export async function getAllUrls() {
  const response = await apiClient.get('/api/urls');
  return response.data;
}

export async function getUrlByShortCode(shortCode) {
  const response = await apiClient.get(`/api/urls/${encodeURIComponent(shortCode)}`);
  return response.data;
}

export async function deleteUrl(id) {
  await apiClient.delete(`/api/urls/${id}`);
}

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the LinkFlow server. Please ensure the backend is running.';
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
}
