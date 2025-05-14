// Funzione per ottenere il token
const KEY = "token";

export function getToken() {
  const token = localStorage.getItem(KEY);
  return token ? token : null;
}

// Funzione per salvare il token
export function saveToken(token) {
  localStorage.setItem(KEY, token);
}

// Funzione per rimuovere il token
export function removeToken() {
  localStorage.removeItem(KEY);
}

// -------------------- GOOGLE USER --------------------
export const saveUserData = (userData) => {
  localStorage.setItem("google_user_data", JSON.stringify(userData));
};

export const getUserData = () => {
  const data = localStorage.getItem("google_user_data");
  return data ? JSON.parse(data) : null;
};

export const clearUserData = () => {
  localStorage.removeItem("google_user_data");
};

// -------------------- NORMAL LOGIN USER --------------------
export const saveNormalUserData = (userData) => {
  localStorage.setItem("normal_user_data", JSON.stringify(userData));
};

export const getNormalUserData = () => {
  const data = localStorage.getItem("normal_user_data");
  return data ? JSON.parse(data) : null;
};

export const clearNormalUserData = () => {
  localStorage.removeItem("normal_user_data");
};
