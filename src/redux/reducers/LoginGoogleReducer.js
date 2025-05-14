// loginGoogleReducer.js

import { LOGIN_GOOGLE_REQUEST, LOGIN_GOOGLE_SUCCESS, LOGIN_GOOGLE_FAILURE, LOGOUT_GOOGLE } from "../action/LoginActions";
import { getToken, getUserData } from "../utils/authUtils";

const initialState = {
  loading: false,
  user: getUserData() || {
    token: null,
    userData: {
      avatar: null,
    },
  },
  error: null,
  isAuthenticated: !!getToken(),
};

export default function loginGoogleReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_GOOGLE_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_GOOGLE_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case LOGIN_GOOGLE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT_GOOGLE: // Reset dello stato per il logout Google
      return {
        loading: false,
        user: null,
        error: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}
