// src/components/StepsProject/TaskCard.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, ListGroup, Form, Modal } from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { fetchStepDataByProject, saveStepData, uploadStepFile } from "../../redux/action/stepDataActions";

const TaskCard = ({ task, project, phase }) => {
  const dispatch = useDispatch();

  // 1) Prendo tutti gli StepData salvati per questo progetto dal Redux store
  const stepDataItems = useSelector((state) => state.stepData.items || []);

  // 2) Costruisco un oggetto “taskState” indicizzato su `step-<stepId>` per accesso rapido
  const taskState = {};
  stepDataItems
    .filter((sd) => sd.projectId === project.id && sd.taskId === task.id)
    .forEach((sd) => {
      taskState[`step-${sd.stepId}`] = sd;
    });

  // 3) Stato locale: bozza (draft) dei campi modificati dall’utente
  const [localData, setLocalData] = useState({});

  // 4) Handler per mostrare un eventuale iframe in modal (solo per i link)
  const [activeIframe, setActiveIframe] = useState(null);

  // Funzione che aggiorna solo il draft in locale, senza chiamare subito il backend
  const handleFieldChange = (stepKey, newPartialData) => {
    setLocalData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        ...newPartialData,
      },
    }));
  };

  // 5) Ad ogni cambio di `project`, ricarico gli StepData da backend
  useEffect(() => {
    if (project?.id) {
      dispatch(fetchStepDataByProject(project.id));
    }
  }, [dispatch, project]);

  // 6) Salvataggio “JSON” di checkbox / dropdown / textarea per un singolo step
  const handleSaveStep = async (stepIndex) => {
    const step = task.steps?.[stepIndex];
    if (!step || !step.id) {
      console.error("Step non trovato per stepIndex:", stepIndex);
      return;
    }

    const realStepId = step.id;
    const stepKey = `step-${realStepId}`;
    const draft = localData[stepKey] || {};
    const saved = taskState[stepKey] || {};

    const payload = {
      id: saved.id || null,
      projectId: project.id,
      faseId: phase.id,
      taskId: task.id,
      stepId: realStepId,
      textareaValue: draft.textareaValue ?? saved.textareaValue ?? null,
      dropdownSelected: draft.dropdownSelected ?? saved.dropdownSelected ?? null,
      checkboxValue: typeof draft.checkboxValue !== "undefined" ? draft.checkboxValue : saved.checkboxValue ?? null,
    };

    try {
      await dispatch(saveStepData(payload.projectId, payload.faseId, payload.taskId, payload.stepId, payload));
      setLocalData((prev) => {
        const copy = { ...prev };
        delete copy[stepKey];
        return copy;
      });
    } catch (err) {
      alert("Errore nel salvataggio: " + err.message);
    }
  };

  // 8) Upload automatico del file: appena scelto, invia a backend e ricarica i dati
  const handleFileUpload = (stepIndex, file) => {
    const realStepId = task.steps[stepIndex].id;
    const realTaskId = task.id;
    const realFaseId = phase.id;
    const realProjectId = project.id;

    dispatch(uploadStepFile(realProjectId, realFaseId, realTaskId, realStepId, file)).catch((err) => {
      console.error("Errore upload:", err);
    });
  };

  return (
    <>
      <Card className="task-card p-4 shadow-sm rounded-4 mb-4">
        <Card.Body>
          <div className="fw-bold fs-5 mb-3">{task.title}</div>
          <ListGroup variant="flush">
            {task.steps.map((step, idx) => {
              const realStepId = step.id;
              const stepKey = `step-${realStepId}`;

              // Dati già salvati sul server per questo step
              const savedData = taskState[stepKey] || {};
              // Bozza “draft” in locale
              const draft = localData[stepKey] || {};

              return (
                <ListGroup.Item
                  key={realStepId} // ← qui uso `step.id` come chiave univoca
                  className="border-0 px-0 py-2 bg-transparent"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="task-label-pill">{step.label}</span>

                    {step.type.includes("boolean") && (
                      <Form.Check
                        type="switch"
                        checked={draft.checkboxValue ?? savedData.checkboxValue ?? false}
                        onChange={(e) =>
                          handleFieldChange(stepKey, {
                            checkboxValue: e.target.checked,
                          })
                        }
                      />
                    )}

                    {step.type.includes("dropdown") && (
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
                    )}

                    {step.type.includes("textarea") && (
                      <Form.Control
                        as="textarea"
                        value={draft.textareaValue ?? savedData.textareaValue ?? ""}
                        onChange={(e) =>
                          handleFieldChange(stepKey, {
                            textareaValue: e.target.value,
                          })
                        }
                        placeholder={step.placeholder || "Inserisci il testo…"}
                        style={{ width: "60%", marginRight: "8px" }}
                      />
                    )}

                    {step.type.includes("file") && (
                      <Form.Control
                        type="file"
                        accept={step.accept}
                        onChange={(e) => {
                          const chosen = e.target.files?.[0];
                          if (chosen) {
                            handleFileUpload(idx, chosen);
                          }
                        }}
                      />
                    )}

                    {step.type.includes("link") && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          setActiveIframe({
                            src: step.modalSrc,
                            title: step.modalTitle,
                          })
                        }
                      >
                        Apri
                      </Button>
                    )}

                    {(step.type.includes("boolean") || step.type.includes("dropdown") || step.type.includes("textarea")) && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleSaveStep(idx)}
                        disabled={!localData[stepKey] || Object.keys(localData[stepKey]).length === 0}
                      >
                        Salva
                      </Button>
                    )}
                  </div>

                  {savedData.fileName && (
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <small className="text-success">{savedData.fileName}</small>
                      <Button variant="link" size="sm" className="text-danger p-0" onClick={() => handleFieldChange(stepKey, { fileName: null })}>
                        <TiDeleteOutline />
                      </Button>
                    </div>
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>

      {activeIframe && (
        <Modal size="lg" show={!!activeIframe} onHide={() => setActiveIframe(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{activeIframe.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: 0, height: "70vh" }}>
            <iframe src={activeIframe.src} title={activeIframe.title} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default TaskCard;
