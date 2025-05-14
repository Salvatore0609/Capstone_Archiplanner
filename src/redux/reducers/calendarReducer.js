import { FETCH_CALENDAR_EVENTS, ADD_CALENDAR_EVENT, DELETE_CALENDAR_EVENT, CALENDAR_ERROR, UPDATE_CALENDAR_EVENT } from "../action/calendarActions";

const initialState = {
  events: [],
  error: null,
  loading: false,
};

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CALENDAR_EVENTS:
      return { ...state, events: action.payload, loading: false, error: null };

    case ADD_CALENDAR_EVENT:
      return { ...state, events: [...state.events, action.payload], loading: false };

    case DELETE_CALENDAR_EVENT:
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
        loading: false,
      };

    case UPDATE_CALENDAR_EVENT:
      return {
        ...state,
        events: state.events.map((event) => (event.id === action.payload.id ? action.payload : event)),
        loading: false,
      };

    case CALENDAR_ERROR:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default calendarReducer;
