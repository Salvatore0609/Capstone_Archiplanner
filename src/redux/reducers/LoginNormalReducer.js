import {
  LOGIN_NORMAL_REQUEST,
  LOGIN_NORMAL_SUCCESS,
  LOGIN_NORMAL_FAILURE,
  LOGOUT_NORMAL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
} from "../action/LoginActions";
import { getToken, clearNormalUserData, saveNormalUserData } from "../utils/authUtils";

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

export default function LoginNormalReducer(state = initialState, action) {
  switch (action.type) {
    // REGISTRAZIONE
    case REGISTER_REQUEST:
      return { ...state, registerLoading: true, registerError: null };

    case REGISTER_SUCCESS:
      return {
        ...state,
        registerLoading: false,
        registeredUser: action.payload,
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        registerLoading: false,
        registerError: action.payload,
      };

    // LOGIN NORMALE
    case LOGIN_NORMAL_REQUEST:
      return { ...state, loginLoading: true, loginError: null };

    case LOGIN_NORMAL_SUCCESS:
      saveNormalUserData({ ...action.payload });
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loginLoading: false,
      };

    case LOGIN_NORMAL_FAILURE:
      return {
        ...state,
        loginLoading: false,
        loginError: action.payload,
        isAuthenticated: false,
      };

    // FETCH PROFILO
    case FETCH_PROFILE_REQUEST:
      return { ...state, loginLoading: true, error: null };

    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        user: {
          ...action.payload,
          token: getToken(),
        },
        loginLoading: false,
        isAuthenticated: true,
      };

    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        loginLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    // ─────────────────────────────────────────────────────────────────────────────
    // UPDATE PROFILE (Normale)
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateError: null,
      };

    case UPDATE_PROFILE_SUCCESS:
      saveNormalUserData(action.payload);
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

    // LOGOUT
    case LOGOUT_NORMAL:
      clearNormalUserData();
      return {
        ...initialState,
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
