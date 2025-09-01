// src/services/api.ts
import axios from 'axios';

// URL de base de l'API
const API_URL = 'http://localhost:5000';

// Configuration d'axios avec le token JWT s'il existe
const api = axios.create({
  baseURL: API_URL,
});

// Interception des requêtes pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
