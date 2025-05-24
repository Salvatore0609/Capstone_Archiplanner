import {
  FETCH_STEPDATA_REQUEST,
  FETCH_STEPDATA_SUCCESS,
  FETCH_STEPDATA_FAILURE,
  SAVE_STEPDATA_REQUEST,
  SAVE_STEPDATA_SUCCESS,
  SAVE_STEPDATA_FAILURE,
  DELETE_STEPDATA_REQUEST,
  DELETE_STEPDATA_SUCCESS,
  DELETE_STEPDATA_FAILURE,
} from "../action/stepDataActions";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const stepDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STEPDATA_REQUEST:
    case SAVE_STEPDATA_REQUEST:
    case DELETE_STEPDATA_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_STEPDATA_SUCCESS:
      return { ...state, items: action.payload, loading: false };

    case SAVE_STEPDATA_SUCCESS:
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? action.payload : item)),
        loading: false,
      };
    // NON aggiungiamo direttamente `action.payload` a items,
    // perché stiamo rifacendo `fetchStepDataByProject` subito dopo.

    case DELETE_STEPDATA_SUCCESS:
      return { ...state, loading: false };
    // Stessa logica: rifacciamo fetch per aggiornare items.

    case FETCH_STEPDATA_FAILURE:
    case SAVE_STEPDATA_FAILURE:
    case DELETE_STEPDATA_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default stepDataReducer;
