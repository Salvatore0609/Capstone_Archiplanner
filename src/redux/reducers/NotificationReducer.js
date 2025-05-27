import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  FETCH_UNREAD_COUNT_REQUEST,
  FETCH_UNREAD_COUNT_SUCCESS,
  FETCH_UNREAD_COUNT_FAILURE,
  MARK_AS_READ_REQUEST,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_FAILURE,
} from "../action/NotificationActions";

const initialState = {
  all: [], // array di NotificationResponse
  unreadCount: 0, // numero di notifiche non lette
  loading: false, // loading per fetchNotifications
  error: null,
  updating: false, // loading per markAsRead
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        all: action.payload,
      };
    case FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_UNREAD_COUNT_REQUEST:
      return {
        ...state,
        error: null,
      };
    case FETCH_UNREAD_COUNT_SUCCESS:
      return {
        ...state,
        unreadCount: action.payload,
      };
    case FETCH_UNREAD_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case MARK_AS_READ_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
      };
    case MARK_AS_READ_SUCCESS:
      return {
        ...state,
        updating: false,
        all: state.all.map((notif) => (notif.id === action.payload ? { ...notif, isRead: true } : notif)),
      };
    case MARK_AS_READ_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
