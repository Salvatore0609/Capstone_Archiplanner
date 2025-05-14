import { useDispatch, useSelector } from "react-redux";
import { updateTaskData } from "../../redux/action/projectsActions";
import { Button, Card, ListGroup, Form, Modal } from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { useState } from "react";

// Questo è il componente per una singola task (attività)
const TaskCard = ({ task, project, phaseKey }) => {
  // Strumenti per gestire lo stato globale (Redux)
  const dispatch = useDispatch(); // Invia azioni (come messaggi) per modificare lo stato
  const taskState = useSelector(
    (state) =>
      // Cerca il progetto corrente e prendi i dati della task
      state.projects.find((p) => p.id === project.id)?.phases?.[phaseKey]?.[task.id] || {}
  );

  // Stato per controllare l'iframe (finestra popup)
  const [activeIframe, setActiveIframe] = useState(null);

  //  Funzione per aggiornare i dati della task
  const handleUpdate = (stepKey, newData) => {
    // 1. Prendi i dati attuali della task
    const currentData = taskState[stepKey] || {};
    // 2. Unisco i vecchi dati con quelli nuovi (come un collage)
    const mergedData = { ...currentData, ...newData };
    // 3. Invia i dati aggiornati allo stato globale
    dispatch(
      updateTaskData(project.id, phaseKey, task.id, {
        [stepKey]: mergedData,
      })
    );
  };

  // Funzione per gestire i file caricati
  const handleFileUpload = (stepIndex, file) => {
    const stepKey = `step-${stepIndex}`; // Crea un nome unico per questo step
    handleUpdate(stepKey, {
      file: {
        // Salva le informazioni del file
        name: file.name, // Nome del file
        size: file.size, // Dimensione
        type: file.type, // Tipo (es. PDF)
        lastModified: file.lastModified, // Data ultima modifica
      },
    });
  };

  return (
    <>
      {/*  Carta contenente tutta la task */}
      <Card className="task-card p-4 shadow-sm rounded-4 mb-4">
        <Card.Body>
          {/*  Titolo della task */}
          <div className="fw-bold fs-5 mb-3">{task.title}</div>

          {/* Lista dei passaggi della task */}
          <ListGroup variant="flush">
            {task.steps.map((step, idx) => {
              const stepKey = `step-${idx}`; // Nome unico per ogni passaggio
              const stepData = taskState[stepKey] || {}; // Dati salvati per questo passaggio

              return (
                <ListGroup.Item key={idx} className="border-0 px-0 py-2 bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="task-label-pill">{step.label}</span>

                    {/* Interruttore ON/OFF */}
                    {step.type.includes("boolean") && (
                      <Form.Check
                        type="switch"
                        checked={!!stepData.checked} // Stato attuale
                        onChange={(e) => handleUpdate(stepKey, { checked: e.target.checked })}
                      />
                    )}

                    {/*  Menu a tendina */}
                    {step.type.includes("dropdown") && (
                      <Form.Select value={stepData.selected || ""} onChange={(e) => handleUpdate(stepKey, { selected: e.target.value })}>
                        <option value="">Seleziona...</option>
                        {step.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    )}

                    {/*  Caricamento file */}
                    {step.type.includes("file") && (
                      <Form.Control
                        type="file"
                        accept={step.accept} // Tipi di file permessi (es. .pdf)
                        onChange={(e) => handleFileUpload(idx, e.target.files[0])}
                      />
                    )}

                    {/* Finestra per siti esterni */}
                    {step.type.includes("link") && (
                      <Button variant="outline-primary" size="sm" href={step.modalSrc} target="_blank" rel="noopener noreferrer">
                        Apri
                      </Button>
                    )}
                    {/* Area di testo modificabile */}
                    {step.type.includes("textarea") && (
                      <>
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            className="ms-auto"
                            onClick={() => handleUpdate(stepKey, { show: !stepData.show })}
                          >
                            {stepData.show ? "Nascondi" : "Modifica"}
                          </Button>
                        </div>

                        {stepData.show && (
                          <Form.Control
                            as="textarea"
                            value={stepData.text || ""}
                            onChange={(e) =>
                              handleUpdate(stepKey, {
                                text: e.target.value,
                                show: true,
                              })
                            }
                            placeholder={step.placeholder || "Inserisci il testo..."}
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* Mostra nome file dopo il caricamento */}
                  {stepData.file && (
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <small className="text-success">{stepData.file.name}</small>
                      <Button variant="link" size="sm" className="text-danger p-0" onClick={() => handleUpdate(stepKey, { file: null })}>
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

      {/* Finestra popup per iframe */}
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
