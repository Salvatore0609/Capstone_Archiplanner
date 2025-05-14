import projectsReducer from "../reducers/projectsReducer";
import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "../reducers/calendarReducer";
import loginNormalReducer from "../reducers/LoginNormalReducer";
import loginGoogleReducer from "../reducers/LoginGoogleReducer";

// se avessi altri reducer, li importerei qui e li combinerei:
// import otherReducer from "../reducers/otherReducer";

// Carica i progetti salvati all'avvio
const preloadedState = {
  projects: JSON.parse(localStorage.getItem("projects")) || [],
};

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    calendar: calendarReducer,
    loginNormal: loginNormalReducer,
    loginGoogle: loginGoogleReducer,
  },
  preloadedState,
});
