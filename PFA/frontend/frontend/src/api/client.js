const API_BASE_URL = "http://localhost:8080";

async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error("Erreur API : " + response.status);
  }

  const text = await response.text();


  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}


const apiClient = {
  get: apiGet,
};

export default apiClient;