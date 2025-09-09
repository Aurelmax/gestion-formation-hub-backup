// src/services/api.ts
import axios from 'axios';

// URL de base de l'API - utilisation de la variable d'environnement
const API_URL = process.env.NEXT_PUBLIC_API_URL || (
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
);

// Configuration d'axios avec le token JWT s'il existe
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important pour les cookies de session
});

// Interception des requêtes pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  // Vérifier si on est côté client avant d'accéder à localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Gestion des erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion d'erreur plus robuste pour éviter les erreurs d'évaluation
    const errorMessage = error?.response?.data || error?.message || 'Erreur API inconnue';
    const statusCode = error?.response?.status || 'N/A';
    const url = error?.config?.url || 'N/A';
    
    // Éviter les logs côté serveur pour prévenir les problèmes d'hydratation
    if (typeof window !== 'undefined') {
      // Utiliser setTimeout pour éviter les problèmes d'hydratation
      setTimeout(() => {
        console.error(`Erreur API [${statusCode}] sur ${url}:`, errorMessage);
      }, 0);
    }
    return Promise.reject(error);
  }
);

export default api;
