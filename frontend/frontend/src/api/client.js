// src/api/client.js

// URL de base du backend Spring Boot
// Tu peux créer un fichier .env avec : VITE_API_BASE_URL=http://localhost:8080
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Construit l'URL complète vers le backend avec éventuels query params
function buildUrl(path, params) {
  // On sécurise la concaténation base + path
  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const url = new URL(base + cleanPath);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  return url.toString();
}

// Fonction générique pour les appels HTTP
async function request(method, path, data = null, config = {}) {
  const { headers = {}, params, ...restConfig } = config;

  const url = buildUrl(path, params);
  const isFormData = data instanceof FormData;

  const fetchOptions = {
    method,
    headers: {
      // Pour FormData, on laisse le navigateur mettre le bon Content-Type
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    ...restConfig,
  };

  if (method !== "GET" && method !== "HEAD") {
    fetchOptions.body = isFormData
      ? data
      : data != null
      ? JSON.stringify(data)
      : null;
  }

  const response = await fetch(url, fetchOptions);

  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    error.data = parsed;
    throw error;
  }

  // On imite Axios : on renvoie { data, status }
  return {
    data: parsed,
    status: response.status,
  };
}

// Objet client exposé (comme Axios)
const apiClient = {
  get: (path, config) => request("GET", path, null, config),
  post: (path, data, config) => request("POST", path, data, config),
  put: (path, data, config) => request("PUT", path, data, config),
  delete: (path, config) => request("DELETE", path, null, config),
};

export default apiClient;
