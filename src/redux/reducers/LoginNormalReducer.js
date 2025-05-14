import {
  LOGIN_NORMAL_REQUEST,
  LOGIN_NORMAL_SUCCESS,
  LOGIN_NORMAL_FAILURE,
  LOGOUT_NORMAL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from "../action/LoginActions";
import { getToken } from "../utils/authUtils";

const initialState = {
  loading: false,
  user: null,
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
    // CASO REGISTRAZIONE
    case REGISTER_REQUEST:
      return {
        ...state,
        registerLoading: true,
        registerError: null,
      };

    case REGISTER_SUCCESS:
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

    // CASO LOGIN
    case LOGIN_NORMAL_REQUEST:
      return {
        ...state,
        loginLoading: true,
        loginError: null,
      };

    case LOGIN_NORMAL_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: {
          ...state.registeredUser,
          ...action.payload,
        },
        loginLoading: false,
      };

    case LOGIN_NORMAL_FAILURE:
      return {
        ...state,
        loginLoading: false,
        loginError: action.payload,
      };

    // CASO LOGOUT
    case LOGOUT_NORMAL:
      return {
        ...initialState,
        isAuthenticated: false,
      };

    default:
      return state;
  }
}
