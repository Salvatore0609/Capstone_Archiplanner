// src/redux/actions/LoginActions.js
import { saveToken } from "../utils/authUtils";

// REGISTER ACTIONS
export const REGISTER_REQUEST = "auth/REGISTER_REQUEST";
export const REGISTER_SUCCESS = "auth/REGISTER_SUCCESS";
export const REGISTER_FAILURE = "auth/REGISTER_FAILURE";

export const registerRequest = () => ({ type: REGISTER_REQUEST });
export const registerSuccess = (userData) => ({ type: REGISTER_SUCCESS, payload: userData });
export const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const registerUser = (formData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/utenti/register`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registrazione fallita");
    }

    dispatch(registerSuccess(data));
    return data;
  } catch (error) {
    dispatch(registerFailure(error.message));
    throw error;
  }
};

// LOGIN ACTIONS (esistente)
export const LOGIN_NORMAL_REQUEST = "auth/LOGIN_NORMAL_REQUEST";
export const LOGIN_NORMAL_SUCCESS = "auth/LOGIN_NORMAL_SUCCESS";
export const LOGIN_NORMAL_FAILURE = "auth/LOGIN_NORMAL_FAILURE";
export const LOGOUT_NORMAL = "auth/LOGOUT_NORMAL";

export const loginNormalRequest = () => ({ type: LOGIN_NORMAL_REQUEST });
export const loginNormalSuccess = (userData) => ({ type: LOGIN_NORMAL_SUCCESS, payload: userData });
export const loginNormalFailure = (error) => ({ type: LOGIN_NORMAL_FAILURE, payload: error });
export const logoutNormal = () => ({ type: LOGOUT_NORMAL });

export const loginUser = (username, password, navigate) => async (dispatch) => {
  dispatch(loginNormalRequest());
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/utenti/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Login failed");
    }

    const data = await response.json();
    saveToken(data.token);
    dispatch(loginNormalSuccess(data));
    navigate("/login-success");
  } catch (error) {
    dispatch(loginNormalFailure(error.message));
    alert(error.message);
  }
};

// GOOGLE LOGIN ACTIONS
export const LOGIN_GOOGLE_REQUEST = "auth/LOGIN_GOOGLE_REQUEST";
export const LOGIN_GOOGLE_SUCCESS = "auth/LOGIN_GOOGLE_SUCCESS";
export const LOGIN_GOOGLE_FAILURE = "auth/LOGIN_GOOGLE_FAILURE";
export const LOGOUT_GOOGLE = "auth/LOGOUT_GOOGLE";

export const loginGoogleRequest = () => ({ type: LOGIN_GOOGLE_REQUEST });
export const loginGoogleSuccess = (userData) => ({
  type: LOGIN_GOOGLE_SUCCESS,
  userData: {
    token: userData.token,
    userData: {
      ...userData.userData,
      avatar: userData.avatar,
    },
  },
});
export const loginGoogleFailure = (error) => ({ type: LOGIN_GOOGLE_FAILURE, payload: error });
export const logoutGoogle = () => ({ type: LOGOUT_GOOGLE });

export const loginWithGoogle = () => () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google?prompt=consent`;
};
