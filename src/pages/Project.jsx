import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Card, Button, Modal } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import GoogleMapView from "../components/commons/GoogleMapView";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects, updateProject } from "../redux/action/projectsActions";
import { deleteStepDataById, fetchStepDataByProject } from "../redux/action/stepDataActions";
import { deleteProject } from "../redux/action/projectsActions";
import { FaRegMap } from "react-icons/fa";

// Import fasi
import { phase1Tasks as p1 } from "../components/StepsProject/phase1Tasks.jsx";
import { phase2Tasks as p2 } from "../components/StepsProject/phase2Tasks";
import { phase3Tasks as p3 } from "../components/StepsProject/phase3Tasks";
import { phase4Tasks as p4 } from "../components/StepsProject/phase4Tasks";
import { phase5Tasks as p5 } from "../components/StepsProject/phase5Tasks";
import { phase6Tasks as p6 } from "../components/StepsProject/phase6Tasks";
import BooleanPill from "../components/commons/BooleanPill";

// Import icone pin
import { TiPinOutline, TiPin } from "react-icons/ti";

const Project = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Tutti i task uniti in un unico array
  const allTasks = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6];

  // Funzione di utilità per ottenere titolo task e label dello step
  const getStepInfo = (taskId, stepId) => {
    const task = allTasks.find((t) => Number(t.id) === Number(taskId));
    if (!task) return { taskTitle: "Task non trovata", stepLabel: "Step non trovato" };

    const step = task.steps.find((s) => String(s.id) === String(stepId));
    return {
      taskTitle: task.title || "Task senza titolo",
      stepLabel: step?.label || "Step senza etichetta",
    };
  };

  const handleDownload = (fileUrl, fileName) => {
    if (!fileUrl) {
      alert("Nessun file disponibile per il download");
      return;
    }
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const projects = useSelector((state) => state.projects.items || []);
  const isLoadingProjects = useSelector((state) => state.projects.loading);
  const { items: stepDataItems, loading: isLoadingStepData } = useSelector((state) => state.stepData);

  const project = useMemo(() => {
    return Array.isArray(projects) ? projects.find((p) => p.id === Number(id)) : null;
  }, [projects, id]);

  // Carica la lista di progetti al montaggio, se non è già stata caricata
  useEffect(() => {
    if (!projects.length) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  // All’avvio e quando cambia `project`, popolo `checked` dal campo `completato` e setto lo stato del pin da `inProgress`
  useEffect(() => {
    if (project) {
      setChecked(project.completato === true);
      // Se serve, potresti anche avere uno stato locale per far vedere subito l'icona pin,
      // ma non è necessario: basterà leggere project.inProgress direttamente.
    }
  }, [project]);

  // Carica i dati task/step per il progetto corrente
  useEffect(() => {
    if (project) {
      dispatch(fetchStepDataByProject(project.id));
    }
  }, [dispatch, project]);

  // Se i progetti sono caricati e non trovo il singolo progetto, torno alla dashboard
  useEffect(() => {
    if (!isLoadingProjects && projects.length >= 0 && !project) {
      navigate("/dashboard");
    }
  }, [project, projects, navigate, isLoadingProjects]);

  if (isLoadingProjects || !project) {
    return <Spinner />;
  }

  const handleDeleteProject = () => {
    if (stepDataItems.length > 0) {
      alert("Non puoi eliminare il progetto finché ci sono step salvati. Elimina prima tutti gli step.");
      return;
    }
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  // Al toggle della checkbox, aggiorno "completato" sul backend e in Redux
  const handleToggle = async () => {
    const newValue = !checked;
    try {
      dispatch(
        updateProject(project.id, {
          nomeProgetto: project.nomeProgetto,
          progettista: project.progettista,
          impresaCostruttrice: project.impresaCostruttrice,
          indirizzo: project.indirizzo,
          lat: project.lat,
          lng: project.lng,
          completato: newValue,
          // non tocchiamo inProgress qui: rimane invariato
        })
      );
      setChecked(newValue);
    } catch (err) {
      console.error("Errore aggiornamento completato:", err);
    }
  };

  // al click del pin faccio il toggle di `inProgress` per questo progetto
  const handlePinToggle = async () => {
    try {
      dispatch(
        updateProject(project.id, {
          nomeProgetto: project.nomeProgetto,
          progettista: project.progettista,
          impresaCostruttrice: project.impresaCostruttrice,
          indirizzo: project.indirizzo,
          lat: project.lat,
          lng: project.lng,
          completato: project.completato, // rimane invariato
          inProgress: !project.inProgress, // inverto il valore
        })
      );
      // Non serve un setState locale: appena Redux aggiorna project.inProgress,
      // il componente verrà re-renderizzato con l’icona corretta.
    } catch (err) {
      console.error("Errore aggiornamento inProgress:", err);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={1}>
          <Sidebar />
        </Col>
        <Col sm={10} className="pt-5 mx-auto">
          <Topbar />
          <Container fluid className="pt-5">
            <div className="d-flex align-items-center">
              <h4 className="me-auto">{project.nomeProgetto}</h4>
              <div className="d-flex gap-2 align-items-center">
                {/* Icona PIN */}
                <Button
                  onClick={handlePinToggle}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                  title={project.inProgress ? "Rimuovi da Lavori in corso" : "Aggiungi a Lavori in corso"}
                >
                  {project.inProgress ? <TiPin size={24} color="#C69B7B" /> : <TiPinOutline size={24} color="#C69B7B" />}
                </Button>
                {/* BooleanPill per “Completato” */}
                <BooleanPill label="Completato" checked={checked} onChange={handleToggle} />
                {/* Bottone “Elimina progetto” */}
                <Button
                  size="sm"
                  onClick={handleDeleteProject}
                  style={{
                    backgroundColor: "#C67B7B",
                    borderRadius: "50px",
                    borderColor: "#C67B7B",
                    padding: "1em",
                  }}
                >
                  Elimina progetto
                </Button>
              </div>
            </div>

            <Col className="d-flex justify-content-between gap-3 mt-3" style={{ color: "#C69B7B", fontWeight: "bold" }}>
              <div className="d-flex">
                <span>Progettista:&nbsp;</span>
                <p>{project.progettista || "Non specificato"}</p>
              </div>
              <div className="d-flex">
                <span>Impresa costruttrice:&nbsp;</span>
                <p>{project.impresaCostruttrice || "Non specificata"}</p>
              </div>
              <div className="d-flex">
                <span>Indirizzo:&nbsp;</span>
                <p>{project.indirizzo}</p>
              </div>
              <div className="d-flex">
                <span>Creato:&nbsp;</span>
                <p>{new Date(project.createdAt).toLocaleDateString() || "Non specificata"}</p>
              </div>
            </Col>

            <Card className="map-card">
              <Card.Header className="map-header d-flex flex-column" style={{ color: "#C69B7B" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="me-auto">Area Progetto</h5>
                  <FaRegMap size={25} style={{ color: "#C69B7B" }} />
                </div>
                <GoogleMapView projects={[project]} />
              </Card.Header>
            </Card>

            <Card className="card mt-4">
              <div className="p-3">
                <h5 style={{ color: "#C69B7B" }}>Dati task/step per questo progetto</h5>

                {isLoadingStepData ? (
                  <Spinner />
                ) : (
                  <div>
                    {stepDataItems.length === 0 ? (
                      <p>Nessun dato salvato finora.</p>
                    ) : (
                      stepDataItems.map((sd) => {
                        const { taskTitle, stepLabel } = getStepInfo(sd.taskId, sd.stepId);
                        return (
                          <Row key={sd.id} className="mb-3 align-items-center border-bottom pb-2">
                            <Col md={3} className="fw-bold">
                              <div>
                                <strong>Fase:</strong> <span style={{ color: "#ababab" }}>{sd.faseId}</span>
                              </div>
                              <div>
                                <strong>Task:</strong> <span style={{ color: "#ababab" }}>{taskTitle}</span>
                              </div>
                              <div>
                                <strong>Step:</strong> <span style={{ color: "#ababab" }}>{stepLabel}</span>
                              </div>
                            </Col>

                            <Col md={3} className="fw-bold">
                              {sd.fileName && sd.fileUrl ? (
                                <div>
                                  <strong>File:</strong>
                                  <Button
                                    size="sm"
                                    variant="link"
                                    style={{
                                      color: "#C69B7B",
                                      textDecoration: "none",
                                    }}
                                    onClick={() => {
                                      handleDownload(sd.fileUrl, sd.fileName);
                                    }}
                                  >
                                    {sd.fileName}
                                  </Button>
                                </div>
                              ) : (
                                <em>No file</em>
                              )}
                            </Col>

                            <Col md={3}>
                              {sd.textareaValue && (
                                <p className="mb-1">
                                  <strong>Commento:</strong> {sd.textareaValue}
                                </p>
                              )}
                              {sd.dropdownSelected && (
                                <p className="mb-1">
                                  <strong>Selezione:</strong> {sd.dropdownSelected}
                                </p>
                              )}
                              {sd.checkboxValue !== null && (
                                <p className="mb-1">
                                  <strong>Checkbox:</strong> {sd.checkboxValue ? "Sì" : "No"}
                                </p>
                              )}
                            </Col>

                            <Col md={1} className="ms-auto">
                              <p className="mb-1 text-muted small">{new Date(sd.updatedAt).toLocaleString("it-IT")}</p>
                            </Col>

                            <Col md={1}>
                              <Button
                                style={{
                                  backgroundColor: "#C67B7B",
                                  borderColor: "#C67B7B",
                                  color: "white",
                                }}
                                size="sm"
                                onClick={() => dispatch(deleteStepDataById(sd.id, project.id))}
                              >
                                Elimina
                              </Button>
                            </Col>
                          </Row>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </Card>
          </Container>
        </Col>
      </Row>

      {/* ─── MODAL ELIMINA PROGETTO ─── */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Eliminare <strong>{projectToDelete?.nomeProgetto}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                dispatch(deleteProject(projectToDelete.id));
                setShowDeleteModal(false);
                navigate("/dashboard");
              } catch (err) {
                alert("Errore nell'eliminazione: " + err.message);
              }
            }}
          >
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Project;
