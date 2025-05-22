import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, ListGroup, Form } from "react-bootstrap";
import { fetchStepDataByProject, saveStepData, uploadStepFile } from "../../redux/action/stepDataActions";
import BooleanPill from "../commons/BooleanPill";

// TaskCard visualizza i dettagli di un singolo task, i suoi step,
// e gestisce salvataggio JSON e upload file per ognuno step.
const TaskCard = ({ task, project, phase }) => {
  const dispatch = useDispatch();

  // Recupero da Redux tutti gli StepData già salvati per il progetto.
  const stepDataItems = useSelector((state) => state.stepData.items || []);

  //  Costruisco un oggetto taskState in cui la chiave è "step-{stepId}"
  //  e il valore è l’oggetto StepData corrispondente. In questo modo
  //  posso facilmente accedere ai dati salvati per ciascuno step.
  const taskState = {};
  stepDataItems
    .filter((sd) => sd.projectId === project.id && sd.taskId === task.id)
    .forEach((sd) => {
      taskState[`step-${sd.stepId}`] = sd;
    });

  // Stato locale per eventuali modifiche (prima di salvare su DB)
  //  Ogni chiave è "step-{stepId}" e il valore contiene i campi cambiati.
  const [localData, setLocalData] = useState({});

  // Stati per gestire la finestra modale di commento
  const [activeModalStep, setActiveModalStep] = useState(null);
  const [modalTextareaValue, setModalTextareaValue] = useState("");

  // useEffect iniziale: quando cambia project.id, richiamo fetchStepDataByProject
  useEffect(() => {
    if (project?.id) {
      dispatch(fetchStepDataByProject(project.id));
    }
  }, [dispatch, project]);

  // Funzione di utilità per aggiornare localData passo per passo
  // stepKey è "step-{stepId}", newPartialData contiene solo i campi cambiati
  const handleFieldChange = (stepKey, newPartialData) => {
    setLocalData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        ...newPartialData,
      },
    }));
  };

  // Salvataggio JSON (dropdown, checkbox, textarea) per uno step
  const handleSaveStep = async (stepIndex) => {
    const step = task.steps?.[stepIndex];
    if (!step || !step.id) return;

    const realStepId = step.id;
    const stepKey = `step-${realStepId}`;

    // Riferimento allo StepData salvato in Redux, se esiste
    const saved = taskState[stepKey] || {};

    // Dati correnti presi da localData (bozza) o fallback a quelli salvati
    const draft = localData[stepKey] || {};

    // Preparo il payload esattamente come lo StepDataRequest Java si aspetta
    const payload = {
      id: saved.id || null, // se esiste un ID vuol dire che sto facendo update
      projectId: project.id,
      faseId: phase.id,
      taskId: task.id,
      stepId: realStepId,
      textareaValue: draft.textareaValue ?? saved.textareaValue ?? null,
      dropdownSelected: draft.dropdownSelected ?? saved.dropdownSelected ?? null,
      checkboxValue: typeof draft.checkboxValue !== "undefined" ? draft.checkboxValue : saved.checkboxValue ?? null,
    };

    try {
      // Chiamo saveStepData(action) che invia JSON al backend
      dispatch(saveStepData(payload.projectId, payload.faseId, payload.taskId, payload.stepId, payload));
      // Dopo il salvataggio, rimuovo quella voce da localData
      setLocalData((prev) => {
        const copy = { ...prev };
        delete copy[stepKey];
        return copy;
      });
    } catch (err) {
      alert("Errore nel salvataggio: " + err.message);
    }
  };

  // Upload diretto di un file per lo step corrispondente
  const handleFileUpload = (stepIndex, file) => {
    const realStepId = task.steps[stepIndex].id;
    // Chiamo uploadStepFile che:
    //  carica il PDF su Cloudinary (uploadRaw)
    //  salva/aggiorna lo StepData includendo fileName=rawUrl
    dispatch(uploadStepFile(project.id, phase.id, task.id, realStepId, file))
      .then((res) => {
        console.log("Upload riuscito:", res);
        dispatch(fetchStepDataByProject(project.id)); // Ricarico gli StepData
      })
      .catch((err) => {
        console.error("Errore upload:", err);
        alert("Errore durante l'upload del file.");
      });
  };

  return (
    <>
      <Card className="task-card p-4 shadow-sm rounded-4 mb-4">
        <Card.Body>
          {/* Titolo del Task */}
          <div className="fw-bold fs-5 mb-3">{task.title}</div>
          <ListGroup variant="flush">
            {task.steps.map((step, idx) => {
              const realStepId = step.id;
              const stepKey = `step-${realStepId}`;

              // Dati salvati in Redux per questo step, se esistono
              const savedData = taskState[stepKey] || {};
              // Dati temporanei locali (bozza), se esistono
              const draft = localData[stepKey] || {};

              return (
                <ListGroup.Item key={realStepId} className="border-0 px-0 py-2 bg-transparent">
                  <div className="d-flex justify-content-between align-items-center gap-5 flex-wrap">
                    {/* Label dello step */}
                    <span className="task-label-pill">{step.label}</span>

                    {/* Se lo step è di tipo boolean (checkbox) */}
                    {step.type.includes("boolean") && (
                      <BooleanPill
                        label={step.label}
                        checked={draft.checkboxValue ?? savedData.checkboxValue ?? false}
                        onChange={(val) => handleFieldChange(stepKey, { checkboxValue: val })}
                      />
                    )}

                    {/* Se lo step è di tipo dropdown */}
                    {step.type.includes("dropdown") && (
                      <>
                        <Form.Select
                          value={draft.dropdownSelected ?? savedData.dropdownSelected ?? ""}
                          onChange={(e) =>
                            handleFieldChange(stepKey, {
                              dropdownSelected: e.target.value,
                            })
                          }
                        >
                          <option value="">Seleziona…</option>
                          {step.options &&
                            step.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                        </Form.Select>
                        <Button
                          size="sm"
                          className="ms-auto btn-link-custom"
                          onClick={() => {
                            const selectedArea = draft.dropdownSelected ?? savedData.dropdownSelected ?? null;
                            if (!selectedArea) {
                              alert("Seleziona prima un'area.");
                              return;
                            }
                            window.open("https://www.urbismap.com", "_blank");
                          }}
                        >
                          UrbisMap
                        </Button>
                      </>
                    )}

                    {/* Se lo step è di tipo textarea */}
                    {step.type.includes("textarea") && (
                      <Button
                        size="sm"
                        className="btn-commenta-custom"
                        onClick={() => {
                          setActiveModalStep(stepKey);
                          setModalTextareaValue(draft.textareaValue ?? savedData.textareaValue ?? "");
                        }}
                      >
                        Commenta
                      </Button>
                    )}

                    {/* Se lo step è di tipo file (PDF, ecc.) */}
                    {step.type.includes("file") && (
                      <div className="d-flex flex-column align-items-start">
                        {/* Bottone che apre il file picker */}
                        <Form.Label className="btn btn-outline-secondary btn-sm">
                          Scegli file
                          <Form.Control
                            type="file"
                            accept={step.accept}
                            onChange={(e) => {
                              const chosen = e.target.files?.[0];
                              if (chosen) handleFileUpload(idx, chosen);
                            }}
                            style={{ display: "none" }}
                          />
                        </Form.Label>
                        {/* Se esiste già un file salvato, mostro l’URL e l’icona per rimuoverlo */}
                        {savedData.fileName && (
                          <div className="d-flex align-items-center gap-2">
                            {/* Link al file usando fileUrl */}
                            {savedData.fileUrl ? (
                              <a href={savedData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-success">
                                {savedData.fileName}
                              </a>
                            ) : (
                              <small className="text-success">{savedData.fileName}</small>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Se lo step è di tipo link */}
                    {step.type.includes("link") && (
                      <Button
                        size="sm"
                        className="btn-link-custom"
                        onClick={() => {
                          const urlToOpen = step.modalSrc || "https://sister.agenziaentrate.gov.it";
                          window.open(urlToOpen, "_blank");
                        }}
                      >
                        Apri Portale
                      </Button>
                    )}

                    {/* Bottone Salva (per boolean, dropdown, textarea) */}
                    {(step.type.includes("boolean") || step.type.includes("dropdown") || step.type.includes("textarea")) && (
                      <Button
                        size="sm"
                        className="btn-save-custom"
                        onClick={() => handleSaveStep(idx)}
                        disabled={!localData[stepKey] || Object.keys(localData[stepKey]).length === 0}
                      >
                        Salva
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Modale per inserire/modificare il commento (textarea) di uno step */}
      {activeModalStep && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Commenta</h5>
                <button type="button" className="btn-close" onClick={() => setActiveModalStep(null)}></button>
              </div>
              <div className="modal-body">
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={modalTextareaValue}
                  onChange={(e) => setModalTextareaValue(e.target.value)}
                  placeholder="Scrivi qui il tuo commento…"
                />
              </div>
              <div className="modal-footer">
                <Button
                  className="btn-save-custom"
                  onClick={() => {
                    handleFieldChange(activeModalStep, { textareaValue: modalTextareaValue });
                    setActiveModalStep(null);
                  }}
                >
                  Salva
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
