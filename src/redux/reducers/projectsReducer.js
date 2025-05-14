import { ADD_PROJECT, DELETE_PROJECT, GEOLOCATION_ERROR, UPDATE_TASK_DATA } from "../action/projectsActions";

// Carica lo stato iniziale dal localStorage
const loadInitialState = () => {
  try {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Errore nel caricamento dal localStorage:", error);
    return [];
  }
};

const initialState = loadInitialState();

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PROJECT:
      try {
        const projectWithPhases = {
          ...action.payload,
          phases: action.payload.phases || {},
        };
        const newState = [...state, projectWithPhases];
        localStorage.setItem("projects", JSON.stringify(newState));
        return newState;
      } catch (error) {
        console.error("Errore nel salvataggio:", error);
        return state; // Ritorna lo stato invariato in caso di errore
      }

    //

    case UPDATE_TASK_DATA: {
      const { projectId, phaseKey, taskId, data } = action.payload;

      try {
        const updatedState = state.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              phases: {
                ...project.phases,
                [phaseKey]: {
                  ...(project.phases?.[phaseKey] || {}), // Inizializza se non esiste
                  [taskId]: {
                    ...(project.phases?.[phaseKey]?.[taskId] || {}),
                    ...data,
                  },
                },
              },
            };
          }
          return project;
        });

        localStorage.setItem("projects", JSON.stringify(updatedState));
        return updatedState;
      } catch (error) {
        console.error("Errore nell'aggiornamento task:", error);
        return state;
      }
    }

    //

    case DELETE_PROJECT:
      try {
        const filteredProjects = state.filter((project) => project.id !== action.payload);
        localStorage.setItem("projects", JSON.stringify(filteredProjects));
        return filteredProjects;
      } catch (error) {
        console.error("Errore durante l'eliminazione:", error);
        return state;
      }

    case GEOLOCATION_ERROR:
      console.warn("Errore geolocalizzazione:", action.payload);
      return state;

    default:
      return state;
  }
};

export default projectsReducer;
