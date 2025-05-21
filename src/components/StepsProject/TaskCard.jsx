import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, ListGroup, Form } from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { fetchStepDataByProject, saveStepData, uploadStepFile } from "../../redux/action/stepDataActions";
import BooleanPill from "../commons/BooleanPill";

const TaskCard = ({ task, project, phase }) => {
  const dispatch = useDispatch();

  const stepDataItems = useSelector((state) => state.stepData.items || []);
  const taskState = {};
  stepDataItems
    .filter((sd) => sd.projectId === project.id && sd.taskId === task.id)
    .forEach((sd) => {
      taskState[`step-${sd.stepId}`] = sd;
    });

  const [localData, setLocalData] = useState({});
  const [activeModalStep, setActiveModalStep] = useState(null);
  const [modalTextareaValue, setModalTextareaValue] = useState("");

  const handleFieldChange = (stepKey, newPartialData) => {
    setLocalData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        ...newPartialData,
      },
    }));
  };

  useEffect(() => {
    if (project?.id) {
      dispatch(fetchStepDataByProject(project.id));
    }
  }, [dispatch, project]);

  const handleSaveStep = async (stepIndex) => {
    const step = task.steps?.[stepIndex];
    if (!step || !step.id) return;

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

  const handleFileUpload = (stepIndex, file) => {
    const realStepId = task.steps[stepIndex].id;
    dispatch(uploadStepFile(project.id, phase.id, task.id, realStepId, file)).catch((err) => {
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
              const savedData = taskState[stepKey] || {};
              const draft = localData[stepKey] || {};

              return (
                <ListGroup.Item key={realStepId} className="border-0 px-0 py-2 bg-transparent">
                  <div className="d-flex justify-content-between align-items-center gap-5 flex-wrap">
                    <span className="task-label-pill">{step.label}</span>

                    {step.type.includes("boolean") && (
                      <BooleanPill
                        label={step.label}
                        checked={draft.checkboxValue ?? savedData.checkboxValue ?? false}
                        onChange={(val) => handleFieldChange(stepKey, { checkboxValue: val })}
                      />
                    )}

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

                    {step.type.includes("file") && (
                      <div className="d-flex flex-column align-items-start">
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
                        {savedData.fileName && (
                          <div className="d-flex align-items-center">
                            <small className="text-success">{savedData.fileName}</small>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger p-0"
                              onClick={() => handleFieldChange(stepKey, { fileName: null })}
                            >
                              <TiDeleteOutline />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

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

      {/* MODALE COMMENTA */}
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
