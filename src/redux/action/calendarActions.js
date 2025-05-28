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

// Post evento (aggiornato per gestire toGoogle)
export const addCalendarEvent =
  (eventData, toGoogle = false) =>
  async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      // Costruisco l’URL base
      const baseUrl = `${import.meta.env.VITE_API_URL}/calendar-event`;
      const url = new URL(baseUrl);

      // Se toGoogle=true, aggiungo ?toGoogle=true
      if (toGoogle) {
        url.searchParams.append("toGoogle", "true");
      }

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Errore nell'inserimento evento: ${errorText}`);
      }

      const saved = await res.json();
      dispatch({ type: ADD_CALENDAR_EVENT, payload: saved });
    } catch (err) {
      dispatch({ type: CALENDAR_ERROR, payload: err.message });
    }
  };

// Delete evento (esempio di estensione per Google)
export const deleteCalendarEvent =
  (eventId, deleteGoogle = false, googleEventId = null) =>
  async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      let urlStr = `${import.meta.env.VITE_API_URL}/calendar-event/${eventId}`;

      // Se deleteGoogle=true e ho googleEventId, aggiungo i parametri
      if (deleteGoogle && googleEventId) {
        const url = new URL(urlStr);
        url.searchParams.append("deleteGoogle", "true");
        url.searchParams.append("googleEventId", googleEventId);
        urlStr = url.toString();
      }

      const res = await fetch(urlStr, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Errore durante l'eliminazione evento: ${errorText}`);
      }

      dispatch({
        type: DELETE_CALENDAR_EVENT,
        payload: eventId,
      });
    } catch (error) {
      console.error("Errore durante l'eliminazione evento calendario:", error);
      dispatch({ type: CALENDAR_ERROR, payload: error.message });
    }
  };

// Put (update) evento (esempio di estensione per Google)
export const updateCalendarEvent =
  (eventId, updatedData, updateGoogle = false, googleEventId = null) =>
  async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = `${import.meta.env.VITE_API_URL}/calendar-event/${eventId}`;
      const url = new URL(baseUrl);

      // Se updateGoogle=true e ho googleEventId, aggiungo i parametri
      if (updateGoogle && googleEventId) {
        url.searchParams.append("updateGoogle", "true");
        url.searchParams.append("googleEventId", googleEventId);
      }

      const res = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Errore durante l'aggiornamento evento: ${errorText}`);
      }

      const updatedEvent = await res.json();
      dispatch({ type: UPDATE_CALENDAR_EVENT, payload: updatedEvent });
    } catch (err) {
      dispatch({ type: CALENDAR_ERROR, payload: err.message });
    }
  };
