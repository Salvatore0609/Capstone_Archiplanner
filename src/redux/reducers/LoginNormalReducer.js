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
} from "../action/LoginActions";

import { clearNormalUserData, getNormalUserData, getToken, saveNormalUserData } from "../utils/authUtils";

const initialState = {
  loading: false,
  user: getNormalUserData(),
  error: null,
  registeredUser: null,
  isAuthenticated: !!getToken(),
  loginLoading: false,
  registerLoading: false,
  loginError: null,
  registerError: null,
};

export default function LoginNormalReducer(state = initialState, action) {
  switch (action.type) {
    // --- REGISTRAZIONE ---
    case REGISTER_REQUEST:
      return {
        ...state,
        registerLoading: true,
        registerError: null,
      };

    case REGISTER_SUCCESS:
      saveNormalUserData(action.payload);
      return {
        ...state,
        registeredUser: action.payload,
        registerLoading: false,
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        registerLoading: false,
        registerError: action.payload,
      };

    // --- LOGIN ---
    case LOGIN_NORMAL_REQUEST:
      return {
        ...state,
        loginLoading: true,
        loginError: null,
      };

    case LOGIN_NORMAL_SUCCESS:
      saveNormalUserData(action.payload);
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
      };

    // --- FETCH PROFILO ---
    case FETCH_PROFILE_REQUEST:
      return {
        ...state,
        loginLoading: true,
        loginError: null,
      };

    case FETCH_PROFILE_SUCCESS: {
      const token = getToken();
      const fullUser = { token, ...action.payload };
      saveNormalUserData(fullUser);
      return {
        ...state,
        user: fullUser,
        loginLoading: false,
      };
    }

    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        loginLoading: false,
        loginError: action.payload,
      };

    // --- LOGOUT ---
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
