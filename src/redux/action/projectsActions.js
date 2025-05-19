import { getToken } from "../utils/authUtils";

export const ADD_PROJECT_REQUEST = "ADD_PROJECT_REQUEST";
export const ADD_PROJECT_SUCCESS = "ADD_PROJECT_SUCCESS";
export const ADD_PROJECT_FAILURE = "ADD_PROJECT_FAILURE";
export const FETCH_PROJECTS_REQUEST = "FETCH_PROJECTS_REQUEST";
export const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";
export const FETCH_PROJECTS_FAILURE = "FETCH_PROJECTS_FAILURE";
export const DELETE_PROJECT_REQUEST = "DELETE_PROJECT_REQUEST";
export const DELETE_PROJECT_SUCCESS = "DELETE_PROJECT_SUCCESS";
export const DELETE_PROJECT_FAILURE = "DELETE_PROJECT_FAILURE";
export const UPDATE_TASK_DATA = "UPDATE_TASK_DATA";

// Action Creator per Aggiungere un Progetto
export const addProject = (projectData) => async (dispatch) => {
  dispatch({ type: ADD_PROJECT_REQUEST });
  try {
    const token = getToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Errore nella creazione del progetto");
    }

    const newProject = await res.json();

    dispatch({
      type: ADD_PROJECT_SUCCESS,
      payload: newProject,
    });

    dispatch(fetchProjects()); // Aggiorna la lista progetti

    return newProject;
  } catch (err) {
    dispatch({
      type: ADD_PROJECT_FAILURE,
      payload: err.message,
    });
    throw err;
  }
};

// Action Creator per Recuperare i Progetti
export const fetchProjects = () => async (dispatch) => {
  try {
    const token = getToken();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Verifica che la risposta sia un array
    if (!Array.isArray(data)) {
      throw new Error("Formato dati non valido");
    }

    //Salvo subito in localStorage, così al refresh del browser
    //posso ricostruire lo stato projects senza dover rifare la fetch
    localStorage.setItem("projects", JSON.stringify(data));

    dispatch({
      type: FETCH_PROJECTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Fetch projects error:", error);
    dispatch({
      type: FETCH_PROJECTS_FAILURE,
      payload: error.message,
    });
    return [];
  }
};

// Action Creator per Eliminare un Progetto
export const deleteProject = (id) => async (dispatch) => {
  dispatch({ type: DELETE_PROJECT_REQUEST });

  try {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Errore nell'eliminazione del progetto");
    }

    dispatch({
      type: DELETE_PROJECT_SUCCESS,
      payload: id,
    });

    dispatch(fetchProjects());
  } catch (error) {
    dispatch({
      type: DELETE_PROJECT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

export const updateTaskData = (projectId, phaseKey, taskId, data) => async (dispatch) => {
  try {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Errore nell'aggiornamento del task");
    }

    const updatedTask = await response.json();

    dispatch({
      type: UPDATE_TASK_DATA,
      payload: {
        projectId,
        phaseKey,
        taskId,
        data: updatedTask,
      },
    });
  } catch (error) {
    console.error("Update task error:", error);
    throw error;
  }
};
