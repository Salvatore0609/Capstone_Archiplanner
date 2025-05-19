// src/redux/action/stepDataActions.js

import { getToken } from "../utils/authUtils";

// Azione per leggere tutti gli StepData di un project
export const FETCH_STEPDATA_REQUEST = "FETCH_STEPDATA_REQUEST";
export const FETCH_STEPDATA_SUCCESS = "FETCH_STEPDATA_SUCCESS";
export const FETCH_STEPDATA_FAILURE = "FETCH_STEPDATA_FAILURE";

// Azione per salvare/modificare un singolo StepData (JSON)
export const SAVE_STEPDATA_REQUEST = "SAVE_STEPDATA_REQUEST";
export const SAVE_STEPDATA_SUCCESS = "SAVE_STEPDATA_SUCCESS";
export const SAVE_STEPDATA_FAILURE = "SAVE_STEPDATA_FAILURE";

// Azione per eliminare uno StepData
export const DELETE_STEPDATA_REQUEST = "DELETE_STEPDATA_REQUEST";
export const DELETE_STEPDATA_SUCCESS = "DELETE_STEPDATA_SUCCESS";
export const DELETE_STEPDATA_FAILURE = "DELETE_STEPDATA_FAILURE";

// --- Fetch di tutti i dati step per un project ---
export const fetchStepDataByProject = (projectId) => async (dispatch) => {
  dispatch({ type: FETCH_STEPDATA_REQUEST });
  try {
    const token = getToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/project/step-data?projectId=${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    dispatch({ type: FETCH_STEPDATA_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FETCH_STEPDATA_FAILURE, payload: err.message });
  }
};

// --- Save (o update) di uno StepData via JSON ---
export const saveStepData = (projectId, faseId, taskId, stepId, fields) => async (dispatch) => {
  dispatch({ type: SAVE_STEPDATA_REQUEST });
  try {
    const token = getToken();
    // Costruiamo il payload JSON esattamente come StepDataRequest Java si aspetta
    const payload = {
      // id verrà omesso se stiamo creando un nuovo StepData,
      // oppure passato esplicitamente in fields se stiamo facendo update
      ...(fields.id && { id: fields.id }), // se fields.id esiste, lo mettiamo
      projectId,
      faseId,
      taskId,
      stepId,
      textareaValue: fields.textareaValue || null,
      dropdownSelected: fields.dropdownSelected || null,
      checkboxValue: typeof fields.checkboxValue !== "undefined" ? fields.checkboxValue : null,
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/project/step-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Errore saveStepData");
    }
    const saved = await res.json();
    dispatch({ type: SAVE_STEPDATA_SUCCESS, payload: saved });
    // Dopo aver salvato, ricarico la lista completa per riflettere il nuovo valore
    dispatch(fetchStepDataByProject(projectId));
    return saved;
  } catch (err) {
    dispatch({ type: SAVE_STEPDATA_FAILURE, payload: err.message });
    throw err;
  }
};

// --- Caricamento di un file per uno StepData ---
export const uploadStepFile = (projectId, faseId, taskId, stepId, file) => async (dispatch) => {
  // Non c’è uno spinner specifico qui, ma potete dispatchare altre azioni se necessario
  try {
    const token = getToken();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("projectId", String(projectId));
    fd.append("faseId", String(faseId));
    fd.append("taskId", String(taskId));
    fd.append("stepId", String(stepId));

    const res = await fetch(`${import.meta.env.VITE_API_URL}/project/step-data/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Non impostate “Content-Type” a mano per multipart/form-data
      },
      body: fd,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Errore uploadFileStepData");
    }
    const savedDto = await res.json();
    // Dopo aver caricato il file, ricarico la lista per vedere il nuovo “fileName”
    dispatch(fetchStepDataByProject(projectId));
    return savedDto;
  } catch (err) {
    console.error("uploadStepFile error:", err);
    throw err;
  }
};

// --- Delete di uno StepData per ID ---
export const deleteStepDataById = (stepDataId, projectId) => async (dispatch) => {
  dispatch({ type: DELETE_STEPDATA_REQUEST });
  try {
    const token = getToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/project/step-data/${stepDataId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    dispatch({ type: DELETE_STEPDATA_SUCCESS, payload: stepDataId });
    // Ricarico la lista aggiornata
    dispatch(fetchStepDataByProject(projectId));
  } catch (err) {
    dispatch({ type: DELETE_STEPDATA_FAILURE, payload: err.message });
  }
};
