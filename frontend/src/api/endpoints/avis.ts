import axios from 'axios';

const API_URL = 'http://localhost:3001';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Ajout de l'intercepteur pour le token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AvisData {
  rating: number | null;
  comment: string;
}

export const createAvis = async (data: AvisData) => {
  const response = await axiosInstance.post('/avis', data);
  return response.data;
};
