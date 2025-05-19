import {
  ADD_PROJECT_SUCCESS,
  FETCH_PROJECTS_SUCCESS,
  DELETE_PROJECT_SUCCESS,
  UPDATE_TASK_DATA,
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_FAILURE,
  ADD_PROJECT_REQUEST,
  ADD_PROJECT_FAILURE,
  DELETE_PROJECT_REQUEST,
  DELETE_PROJECT_FAILURE,
} from "../action/projectsActions";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    // CASI DI CARICAMENTO
    case FETCH_PROJECTS_REQUEST:
    case ADD_PROJECT_REQUEST:
    case DELETE_PROJECT_REQUEST:
      return { ...state, loading: true, error: null };

    // CASI DI SUCCESSO
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        items: action.payload,
        loading: false,
      };

    case ADD_PROJECT_SUCCESS:
      return {
        ...state,
        items: [action.payload, ...state.items],
        loading: false,
      };

    case DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        items: state.items.filter((project) => project.id !== action.payload),
        loading: false,
      };

    // CASI D'ERRORE
    case FETCH_PROJECTS_FAILURE:
    case ADD_PROJECT_FAILURE:
    case DELETE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // AGGIORNAMENTO TASK
    case UPDATE_TASK_DATA: {
      const { projectId, phaseKey, taskId, data } = action.payload;

      return {
        ...state,
        items: state.items.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              phases: {
                ...project.phases,
                [phaseKey]: {
                  ...project.phases[phaseKey],
                  [taskId]: {
                    ...project.phases[phaseKey][taskId],
                    ...data,
                  },
                },
              },
            };
          }
          return project;
        }),
      };
    }

    default:
      return state;
  }
};

export default projectsReducer;
