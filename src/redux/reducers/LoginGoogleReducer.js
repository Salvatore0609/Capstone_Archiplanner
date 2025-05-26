import {
  LOGIN_GOOGLE_REQUEST,
  LOGIN_GOOGLE_SUCCESS,
  LOGIN_GOOGLE_FAILURE,
  LOGOUT_GOOGLE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "../action/LoginActions";
import { getToken, saveUserData, clearUserData } from "../utils/authUtils";

const initialState = {
  loading: false,
  user: null,
  error: null,
  isAuthenticated: !!getToken(),
  loginLoading: false,
  registerLoading: false,
  updateLoading: false,
  updateError: null,
};

export default function loginGoogleReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_GOOGLE_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_GOOGLE_SUCCESS:
      saveUserData(action.payload);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };

    case LOGIN_GOOGLE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT_GOOGLE:
      clearUserData();
      return {
        ...initialState,
        isAuthenticated: false,
      };

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE PROFILE (Google)
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null,
      };

    case UPDATE_PROFILE_SUCCESS:
      // Salvo i nuovi dati utente (incluso avatar, ecc.)
      saveUserData(action.payload);
      return {
        ...state,
        user: action.payload,
        updateLoading: false,
      };

    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateError: action.payload,
      };
    // ─────────────────────────────────────────────────────────────────────────────

    default:
      return state;
  }
}
