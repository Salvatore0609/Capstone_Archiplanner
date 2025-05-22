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
export const uploadStepFile =
  (projectId, faseId, taskId, stepId, file, otherFields = {}) =>
  async (dispatch) => {
    dispatch({ type: SAVE_STEPDATA_REQUEST });
    try {
      const token = getToken();

      const formData = new FormData();
      formData.append("file", file);

      const cloudRes = await fetch(`${import.meta.env.VITE_API_URL}/api/images/uploadRaw`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!cloudRes.ok) {
        const errText = await cloudRes.text();
        throw new Error(errText || "Errore upload su Cloudinary");
      }

      // PARSING JSON
      const cloudData = await cloudRes.json();
      const rawUrl = cloudData.fileUrl;

      const payload = {
        ...(otherFields.id && { id: otherFields.id }),
        projectId,
        faseId,
        taskId,
        stepId,
        textareaValue: otherFields.textareaValue || null,
        dropdownSelected: otherFields.dropdownSelected || null,
        checkboxValue: typeof otherFields.checkboxValue !== "undefined" ? otherFields.checkboxValue : null,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: rawUrl,
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
        throw new Error(errText || "Errore saveStepData con file");
      }

      const savedDto = await res.json();
      dispatch({ type: SAVE_STEPDATA_SUCCESS, payload: savedDto });
      dispatch(fetchStepDataByProject(projectId));
      return savedDto;
    } catch (err) {
      dispatch({ type: SAVE_STEPDATA_FAILURE, payload: err.message });
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
