export const ADD_PROJECT = "ADD_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";
export const GEOLOCATION_ERROR = "GEOLOCATION_ERROR";
export const UPDATE_TASK_DATA = "UPDATE_TASK_DATA";

export const addProject = (projectData) => async (dispatch) => {
  try {
    if (!projectData?.indirizzo?.trim()) {
      throw new Error("Indirizzo mancante nel progetto");
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(projectData.indirizzo)}&key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }`
    );

    const data = await response.json();

    if (data.status === "OK" && data.results[0]?.geometry?.location) {
      const { lat, lng } = data.results[0].geometry.location;
      const newProject = {
        ...projectData,
        lat,
        lng,
        id: Date.now(),
        phases: {},
      };

      dispatch({ type: ADD_PROJECT, payload: newProject });
    } else {
      dispatch({ type: GEOLOCATION_ERROR, payload: "Indirizzo non valido" });
    }
  } catch (error) {
    dispatch({ type: GEOLOCATION_ERROR, payload: error.message });
  }
};

export const deleteProject = (projectId) => ({
  type: DELETE_PROJECT,
  payload: projectId,
});

export const updateTaskData = (projectId, phaseKey, taskId, data) => ({
  type: UPDATE_TASK_DATA,
  payload: { projectId, phaseKey, taskId, data },
});
