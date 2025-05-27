export const FETCH_NOTIFICATIONS_REQUEST = "FETCH_NOTIFICATIONS_REQUEST";
export const FETCH_NOTIFICATIONS_SUCCESS = "FETCH_NOTIFICATIONS_SUCCESS";
export const FETCH_NOTIFICATIONS_FAILURE = "FETCH_NOTIFICATIONS_FAILURE";

export const FETCH_UNREAD_COUNT_REQUEST = "FETCH_UNREAD_COUNT_REQUEST";
export const FETCH_UNREAD_COUNT_SUCCESS = "FETCH_UNREAD_COUNT_SUCCESS";
export const FETCH_UNREAD_COUNT_FAILURE = "FETCH_UNREAD_COUNT_FAILURE";

export const MARK_AS_READ_REQUEST = "MARK_AS_READ_REQUEST";
export const MARK_AS_READ_SUCCESS = "MARK_AS_READ_SUCCESS";
export const MARK_AS_READ_FAILURE = "MARK_AS_READ_FAILURE";

import { getToken } from "../utils/authUtils";
/* Fetch di tutte le notifiche (letto + non letto).*/
export const fetchNotifications = () => async (dispatch) => {
  dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
  try {
    const token = getToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) throw new Error("Errore nel caricamento delle notifiche");

    const data = await res.json();
    dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_NOTIFICATIONS_FAILURE,
      payload: error.message || "Fetch notifiche fallito",
    });
  }
};

/*Fetch del conteggio delle notifiche NON lette. 
(Il backend espone GET /notifications/unread, che ritorna array di NotificationResponse) */
export const fetchUnreadNotificationsCount = () => async (dispatch) => {
  dispatch({ type: FETCH_UNREAD_COUNT_REQUEST });
  try {
    const token = getToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/unread`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) throw new Error("Errore nel conteggio notifiche non lette");

    const data = await res.json(); // array di NotificationResponseDTO non lette
    dispatch({
      type: FETCH_UNREAD_COUNT_SUCCESS,
      payload: data.length,
    });
  } catch (error) {
    dispatch({
      type: FETCH_UNREAD_COUNT_FAILURE,
      payload: error.message || "Fetch count notifiche non lette fallito",
    });
  }
};

/* Segna una notifica come letta: PUT /notifications/{id}/read */
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  dispatch({ type: MARK_AS_READ_REQUEST, payload: notificationId });
  try {
    const token = getToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) throw new Error("Errore nel marcare come lette");

    dispatch({ type: MARK_AS_READ_SUCCESS, payload: notificationId });
    // Dopo aver segnato come letta, rifaccio il fetch del conteggio non lette
    dispatch(fetchUnreadNotificationsCount());
  } catch (error) {
    dispatch({
      type: MARK_AS_READ_FAILURE,
      payload: error.message || "Mark as read fallito",
    });
  }
};
