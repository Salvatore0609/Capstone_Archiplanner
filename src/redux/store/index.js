import projectsReducer from "../reducers/projectsReducer";
import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "../reducers/calendarReducer";
import loginNormalReducer from "../reducers/LoginNormalReducer";
import loginGoogleReducer from "../reducers/LoginGoogleReducer";
import stepDataReducer from "../reducers/stepDataReducer";
import { notificationReducer } from "../reducers/NotificationReducer";

const preloadedState = {
  projects: JSON.parse(localStorage.getItem("projects")) || [],
};

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    calendar: calendarReducer,
    loginNormal: loginNormalReducer,
    loginGoogle: loginGoogleReducer,
    stepData: stepDataReducer,
    notifications: notificationReducer,
  },
  preloadedState,
});
