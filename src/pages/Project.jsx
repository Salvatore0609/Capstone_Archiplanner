import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Card, Button, Modal, Form } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import GoogleMapView from "../components/commons/GoogleMapView";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects, updateProject, deleteProject } from "../redux/action/projectsActions";
import { deleteStepDataById, fetchStepDataByProject } from "../redux/action/stepDataActions";
import { FaRegMap, FaEdit } from "react-icons/fa";

// Import fasi
import { phase1Tasks as p1 } from "../components/StepsProject/phase1Tasks.jsx";
import { phase2Tasks as p2 } from "../components/StepsProject/phase2Tasks";
import { phase3Tasks as p3 } from "../components/StepsProject/phase3Tasks";
import { phase4Tasks as p4 } from "../components/StepsProject/phase4Tasks";
import { phase5Tasks as p5 } from "../components/StepsProject/phase5Tasks";
import { phase6Tasks as p6 } from "../components/StepsProject/phase6Tasks";
import BooleanPill from "../components/commons/BooleanPill";

// Import icone pin
import { TiPinOutline, TiPin, TiDelete } from "react-icons/ti";

const Project = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    progettista: "",
    impresaCostruttrice: "",
    indirizzo: "",
  });
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

  // All’avvio e quando cambia `project`, popolo `checked` dal campo `completato`
  // e imposto i dati iniziali per l’editModal
  useEffect(() => {
    if (project) {
      setChecked(project.completato === true);
      setEditData({
        progettista: project.progettista || "",
        impresaCostruttrice: project.impresaCostruttrice || "",
        indirizzo: project.indirizzo || "",
      });
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

  // ────────────────────────────────────────────────────────────
  // GESTIONE DELETE PROGETTO
  const handleDeleteProject = () => {
    if (stepDataItems.length > 0) {
      alert("Non puoi eliminare il progetto finché ci sono step salvati. Elimina prima tutti gli step.");
      return;
    }
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  // Al click in conferma, eseguo l'azione di delete
  const confirmDelete = async () => {
    try {
      dispatch(deleteProject(projectToDelete.id));
      setShowDeleteModal(false);
      navigate("/dashboard");
    } catch (err) {
      alert("Errore nell'eliminazione: " + err.message);
    }
  };
  // ────────────────────────────────────────────────────────────

  // ────────────────────────────────────────────────────────────
  // GESTIONE TOGGLE COMPLETATO
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
          inProgress: project.inProgress, // mantengo invariato
        })
      );
      setChecked(newValue);
    } catch (err) {
      console.error("Errore aggiornamento completato:", err);
    }
  };
  // ────────────────────────────────────────────────────────────

  // ────────────────────────────────────────────────────────────
  // GESTIONE TOGGLE PIN (inProgress)
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
          completato: project.completato,
          inProgress: !project.inProgress, // inverto il valore
        })
      );
      // Redux ricarica project con inProgress aggiornato
    } catch (err) {
      console.error("Errore aggiornamento inProgress:", err);
    }
  };
  // ────────────────────────────────────────────────────────────

  // ────────────────────────────────────────────────────────────
  // GESTIONE EDIT MODAL: apertura/chiusura e submit
  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(
        updateProject(project.id, {
          nomeProgetto: project.nomeProgetto, // nome non cambia qui
          progettista: editData.progettista,
          impresaCostruttrice: editData.impresaCostruttrice,
          indirizzo: editData.indirizzo,
          lat: project.lat, // lat/lng restano invariati
          lng: project.lng,
          completato: project.completato, // completato non cambia
          inProgress: project.inProgress, // inProgress non cambia
        })
      );
      closeEditModal();
    } catch (err) {
      console.error("Errore aggiornamento progetto:", err);
    }
  };
  // ────────────────────────────────────────────────────────────

  return (
    <Container fluid>
      <Row>
        <Col sm={1}>
          <Sidebar />
        </Col>
        <Col sm={10} className="pt-5 mx-auto">
          <Topbar />
          <Container fluid className="pt-5">
            {/* ──────────────────────────────────────────────────────────── */}
            {/* Dettagli progetto */}
            <Col md={12}>
              <div className="d-flex align-items-center">
                <div className="d-flex gap-4 align-items-center ms-auto">
                  {/* Icona PIN */}
                  <Button
                    onClick={handlePinToggle}
                    className="pinBtn"
                    title={project.inProgress ? "Rimuovi da Lavori in corso" : "Aggiungi a Lavori in corso"}
                  >
                    {project.inProgress ? <TiPin size={25} color="#C69B7B" /> : <TiPinOutline size={24} color="#C69B7B" />}
                  </Button>

                  {/* Icona EDIT */}
                  <Button onClick={openEditModal} className="editBtn" title="Modifica dati progetto">
                    <FaEdit size={25} color="#C69B7B" />
                  </Button>

                  {/* BooleanPill per “Completato” */}
                  <BooleanPill label={<span className="d-none d-md-inline">Completato</span>} checked={checked} onChange={handleToggle} />
                  {/* Bottone “Elimina progetto” */}
                  <Button onClick={handleDeleteProject} className="deleteProjectBtn">
                    <span className="d-none d-md-inline">Elimina progetto</span>
                    <TiDelete size={70} className="d-inline d-md-none" />
                  </Button>
                </div>
              </div>
              <h4 className="project-title mt-3 fs-5">{project.nomeProgetto}</h4>
            </Col>
            <Col md={12} className="mt-3">
              <Row className="projectDetails gx-3 gy-2 fw-bold p-2" style={{ color: "#C69B7B", fontSize: "14px" }}>
                <Col xs={12} sm={6} lg={3} className="d-flex">
                  <span>Progettista:&nbsp;</span>
                  <span className="m-0">{project.progettista || "Non specificato"}</span>
                </Col>

                <Col xs={12} sm={6} lg={3} className="d-flex">
                  <span>Impresa costruttrice:&nbsp;</span>
                  <span className="m-0">{project.impresaCostruttrice || "Non specificata"}</span>
                </Col>

                <Col xs={12} sm={6} lg={3} className="d-flex">
                  <span>Indirizzo:&nbsp;</span>
                  <span className="m-0">{project.indirizzo}</span>
                </Col>

                <Col xs={12} sm={6} lg={3} className="d-flex">
                  <span className="ms-auto ">Creato:&nbsp;</span>
                  <span className="m-0">{new Date(project.createdAt).toLocaleDateString()}</span>
                </Col>
              </Row>
            </Col>

            {/* ──────────────────────────────────────────────────────────── */}
            <Card className="map-card mt-2">
              <div className="map-wrapper p-2 pt-0 m-0">
                <div className="d-flex justify-content-between align-items-center border-0">
                  <h5 className="map-title m-2" style={{ color: "#C69B7B" }}>
                    Aree Progetti
                  </h5>
                  <FaRegMap size={25} className="map-icon me-auto" style={{ color: "#C69B7B" }} />
                </div>
                <GoogleMapView projects={[project]} />
              </div>
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
                                <strong>Fase:</strong> <span>{sd.faseId}</span>
                              </div>
                              <div>
                                <strong>Task:</strong> <span>{taskTitle}</span>
                              </div>
                              <div>
                                <strong>Step:</strong> <span>{stepLabel}</span>
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="d-flex">
        <Modal.Header closeButton>
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Eliminare <strong>{projectToDelete?.nomeProgetto}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteModal(false)} style={{ backgroundColor: "#D9D9D9" }}>
            Annulla
          </Button>
          <Button onClick={confirmDelete} style={{ backgroundColor: "#c67b7b" }}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ─── MODAL MODIFICA PROGETTO ─── */}
      <Modal show={showEditModal} onHide={closeEditModal} centered className="d-flex">
        <Modal.Header closeButton>
          <Modal.Title>Modifica progetto</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Progettista</Form.Label>
              <Form.Control name="progettista" value={editData.progettista} onChange={handleEditChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Impresa costruttrice</Form.Label>
              <Form.Control name="impresaCostruttrice" value={editData.impresaCostruttrice} onChange={handleEditChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control name="indirizzo" value={editData.indirizzo} onChange={handleEditChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={closeEditModal} style={{ backgroundColor: "#C67B7B" }}>
              Annulla
            </Button>
            <Button type="submit" style={{ backgroundColor: "#7BC682" }}>
              Salva modifiche
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Project;
