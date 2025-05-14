export const FETCH_CALENDAR_EVENTS = "FETCH_CALENDAR_EVENTS";
export const ADD_CALENDAR_EVENT = "ADD_CALENDAR_EVENT";
export const DELETE_CALENDAR_EVENT = "DELETE_CALENDAR_EVENT";
export const UPDATE_CALENDAR_EVENT = "UPDATE_CALENDAR_EVENT";
export const CALENDAR_ERROR = "CALENDAR_ERROR";

// Get eventi
export const fetchCalendarEvents = () => async (dispatch) => {
  dispatch({ type: "FETCH_CALENDAR_EVENTS" });
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_URL}/calendar-event`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) throw new Error("Errore nel caricamento eventi");

    const data = await response.json();
    dispatch({ type: FETCH_CALENDAR_EVENTS, payload: data });
  } catch (error) {
    dispatch({ type: CALENDAR_ERROR, payload: error.message });
  }
};

// Post evento
export const addCalendarEvent = (eventData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/calendar-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) throw new Error("Errore nell'inserimento evento");

    const saved = await res.json();
    dispatch({ type: ADD_CALENDAR_EVENT, payload: saved });
  } catch (err) {
    dispatch({ type: CALENDAR_ERROR, payload: err.message });
  }
};

// Delete evento
export const deleteCalendarEvent = (eventId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/calendar-event/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) throw new Error("Errore durante l'eliminazione evento");

    dispatch({
      type: DELETE_CALENDAR_EVENT,
      payload: eventId,
    });
  } catch (error) {
    console.error("Errore durante l'eliminazione evento calendario:", error);
    dispatch({ type: CALENDAR_ERROR, payload: error.message });
  }
};

// Put (update) evento
export const updateCalendarEvent = (eventId, updatedData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/calendar-event/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Errore durante l'aggiornamento evento");

    const updatedEvent = await res.json();
    dispatch({ type: UPDATE_CALENDAR_EVENT, payload: updatedEvent });
  } catch (err) {
    dispatch({ type: CALENDAR_ERROR, payload: err.message });
  }
};
