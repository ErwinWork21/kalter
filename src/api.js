// Lightweight API adapter. If window.USE_API === true, calls backend PHP endpoints.
// Otherwise falls back to localStorage (so your original logic remains working during dev).
const API_BASE = window.API_BASE || ''; // set to full domain if needed, e.g. '/backend/api.php'

async function callApi(action, payload = {}) {
  if (!window.USE_API) {
    // fallback indicator for localStorage usage
    return { success: false, fallback: true };
  }
  const url = API_BASE + '/api.php?action=' + encodeURIComponent(action);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export const api = {
  async register(user) {
    return callApi('register', user);
  },
  async login({email, password}) {
    return callApi('login', { email, password });
  },
  async saveUser(user) {
    return callApi('saveUser', { user });
  },
  async getUser(email) {
    return callApi('getUser', { email });
  },
  async saveCalculation(email, savedData) {
    return callApi('saveCalculation', { email, savedData });
  },
  async getSavedData(email) {
    return callApi('getSavedData', { email });
  }
};
