import { Button, Card, Col, Form, Modal, Nav, Row } from "react-bootstrap";
import { FaCog, FaPlus, FaHeart, FaRegUserCircle, FaChevronLeft, FaLayerGroup, FaTimes, FaListUl } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addProject, deleteProject, fetchProjects } from "../../redux/action/projectsActions";
import GoogleMapView from "../commons/GoogleMapView";
import { TiDeleteOutline } from "react-icons/ti";
import { getToken } from "../../redux/utils/authUtils";

const Sidebar = () => {
  // Stati per la gestione dell'UI
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPhaseCards, setShowPhaseCards] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Stato per il nuovo progetto e geocoding
  const [newProject, setNewProject] = useState({
    nomeProgetto: "",
    progettista: "",
    impresaCostruttrice: "",
    indirizzo: "",
  });
  const [previewCoordinates, setPreviewCoordinates] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Redux e routing
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects?.items || []);
  const navigate = useNavigate();
  //
  const location = useLocation();
  const { id } = useParams();
  const currentProject = location.state?.project || projects.find((p) => p.id === Number(id));

  // Utente autenticato
  const [localAvatarError, setLocalAvatarError] = useState(false);
  const activeUser = useSelector((state) => state.loginGoogle.user || state.loginNormal.user);
  const avatarUrl = activeUser?.avatar;

  useEffect(() => {
    if (showModal) {
      resetForm();
    }
  }, [showModal]);

  // Funzioni
  const resetForm = () => {
    setNewProject({
      nomeProgetto: "",
      progettista: "",
      impresaCostruttrice: "",
      indirizzo: "",
    });
    setPreviewCoordinates(null);
    setAddressError(null);
  };

  const handleGeocode = async (address) => {
    if (!address.trim() || address.trim().length < 10) {
      setPreviewCoordinates(null);
      return;
    }

    try {
      setIsGeocoding(true);
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/geocode?address=${encodeURIComponent(address)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Indirizzo non trovato");

      const coordinates = await response.json();
      setPreviewCoordinates(coordinates);
      setAddressError(null);
    } catch (error) {
      if (error.name !== "AbortError") {
        setAddressError("Completa l'indirizzo per vedere l'anteprima");
        setPreviewCoordinates(null);
      }
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewCoordinates) {
      setAddressError("Verifica l'indirizzo prima di procedere");
      return;
    }
    const completeProject = {
      ...newProject,
      lat: previewCoordinates.lat,
      lng: previewCoordinates.lng,
    };
    try {
      const addedProject = dispatch(addProject(completeProject));
      dispatch(fetchProjects());

      navigate(`/project/${addedProject.id}`);
      setShowModal(false);
    } catch (error) {
      setAddressError("Errore nel salvataggio del progetto: " + error.message);
    }
  };

  const handleLoadProjects = async () => {
    try {
      setLoadingProjects(true);
      await dispatch(fetchProjects());
      setShowProjectList(true);
      setShowPhaseCards(false);
    } catch (error) {
      console.error("Errore caricamento progetti:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  return (
    <>
      <div className={`d-flex flex-column align-items-center sidebar ${expanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <button onClick={() => setExpanded(!expanded)} className="sidebar-toggle btn btn-link p-1">
          {expanded ? <FaChevronLeft size={25} /> : <FiSidebar size={25} />}
        </button>

        <Nav className="flex-column text-center w-100">
          <Link to="/dashboard" className="text-decoration-none p-0">
            <Image src="../assets/logo1.jpg" alt="logo" roundedCircle fluid className="h-50" />
          </Link>

          <Nav.Link
            className={`d-flex ${expanded ? "justify-content-start ps-2" : "justify-content-center"} align-items-center`}
            onClick={() => setShowModal(true)}
          >
            <div className="icon-hover">
              <FaPlus size={20} color="#C69B7B" />
            </div>
            {expanded && <span className="ms-2">Nuovo progetto</span>}
          </Nav.Link>

          <Nav.Link
            className={`my-3 d-flex ${expanded ? "justify-content-start ps-2" : "justify-content-center"} align-items-center`}
            onClick={handleLoadProjects}
          >
            <div className="icon-hover">
              <FaListUl size={20} color="#C69B7B" />
              {loadingProjects && (
                <span className="ms-2">
                  <div className="spinner-border spinner-border-sm text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </span>
              )}
            </div>
            {expanded && <span className="ms-2">Progetti</span>}
          </Nav.Link>

          {currentProject && (
            <Nav.Link
              className={`my-3 d-flex ${expanded ? "justify-content-start ps-2" : "justify-content-center"} align-items-center`}
              onClick={() => {
                setShowPhaseCards(true);
                setShowProjectList(false);
              }}
            >
              <div className="icon-hover">
                <FaLayerGroup size={20} color="#C69B7B" />
              </div>
              {expanded && <span className="ms-2">Fasi progetto</span>}
            </Nav.Link>
          )}

          <Nav.Link className={`my-3 d-flex ${expanded ? "justify-content-start ps-2" : "justify-content-center"} align-items-center`}>
            <div className="icon-hover">
              <FaHeart size={20} color="#C69B7B" />
            </div>
            {expanded && <span className="ms-2">Preferiti</span>}
          </Nav.Link>

          <Nav.Link className={`my-3 d-flex ${expanded ? "justify-content-start ps-2" : "justify-content-center"} align-items-center`}>
            <div className="icon-hover">
              <FaCog size={20} color="#C69B7B" />
            </div>
            {expanded && <span className="ms-2">Impostazioni</span>}
          </Nav.Link>
        </Nav>

        <div className="mt-auto mb-3 d-flex flex-column align-items-center">
          {localAvatarError || !avatarUrl ? (
            <FaRegUserCircle size={30} className="text-secondary" />
          ) : (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="avatar-image"
              onError={(e) => {
                setLocalAvatarError(true);
                e.target.onerror = null;
              }}
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #C69B7B",
              }}
            />
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crea nuovo progetto</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome progetto</Form.Label>
              <Form.Control
                value={newProject.nomeProgetto}
                onChange={(e) => setNewProject({ ...newProject, nomeProgetto: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Progettista</Form.Label>
              <Form.Control value={newProject.progettista} onChange={(e) => setNewProject({ ...newProject, progettista: e.target.value })} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Impresa costruttrice</Form.Label>
              <Form.Control
                value={newProject.impresaCostruttrice}
                onChange={(e) => setNewProject({ ...newProject, impresaCostruttrice: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Area del progetto</Form.Label>
              <Form.Control
                value={newProject.indirizzo}
                onChange={(e) => {
                  setNewProject({ ...newProject, indirizzo: e.target.value });
                  if (e.target.value.length >= 20) {
                    handleGeocode(e.target.value);
                  }
                }}
                isInvalid={!!addressError}
                placeholder="Es: Via Roma 1, Milano"
              />
              {addressError && <Form.Text className="text-danger">{addressError}</Form.Text>}
            </Form.Group>

            {previewCoordinates && (
              <div className="mt-3">
                <GoogleMapView
                  projects={[
                    {
                      id: "preview",
                      lat: previewCoordinates.lat,
                      lng: previewCoordinates.lng,
                    },
                  ]}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" disabled={!previewCoordinates || isGeocoding}>
              Crea progetto
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {showProjectList && (
        <div className="floating-cards-container">
          <h5>Progetti ({projects.length})</h5>
          <Button className="btn-close" onClick={() => setShowProjectList(false)}>
            <FaTimes size={20} color="#C69B7B" />
          </Button>

          {loadingProjects ? (
            <div className="text-center p-3">
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Caricamento...</span>
              </div>
            </div>
          ) : (
            projects
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((proj, index) => (
                <Card
                  key={proj.id}
                  className="floating-card mb-3"
                  onClick={() => {
                    navigate(`/project/${proj.id}`);
                    setShowProjectList(false);
                  }}
                >
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={2}>
                        <Card.Title>{index + 1}</Card.Title>
                      </Col>
                      <Col md={8} className="d-flex align-items-center">
                        <Card.Subtitle className="text-muted">{proj.nomeProgetto}</Card.Subtitle>
                        <TiDeleteOutline
                          size={25}
                          className="text-danger ms-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToDelete(proj);
                            setShowDeleteModal(true);
                          }}
                        />
                      </Col>
                      <Col md={12}>
                        <Card.Text className="text-secondary">{proj.indirizzo}</Card.Text>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
          )}
        </div>
      )}

      {showPhaseCards && currentProject && (
        <div className="floating-cards-container">
          <h5>{currentProject.nomeProgetto} - Fasi</h5>
          <Button className="btn-close" onClick={() => setShowPhaseCards(false)}>
            <FaTimes size={20} color="#C69B7B" />
          </Button>
          {[
            { num: "1", titolo: "FASE INIZIALE" },
            { num: "2", titolo: "PROGETTAZIONE PRELIMINARE" },
            { num: "3", titolo: "PROGETTAZIONE DEFINITIVA E AUTORIZZAZIONI" },
            { num: "4", titolo: "PROGETTAZIONE ESECUTIVA & APPALTI" },
            { num: "5", titolo: "DIREZIONE LAVORI & CANTIERE" },
            { num: "6", titolo: "FINE LAVORI & AGGIORNAMENTI CATASTALI" },
          ].map((fase) => (
            <Link key={fase.num} to={`/fase/${fase.num}`} state={{ project: currentProject }} className="text-decoration-none">
              <Card className="floating-card mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Card.Title>{fase.num}</Card.Title>
                    </Col>
                    <Col md={10}>
                      <Card.Subtitle className="mb-2 text-muted">{fase.titolo}</Card.Subtitle>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      )}

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
                await dispatch(deleteProject(projectToDelete.id));
                setShowDeleteModal(false);
              } catch (err) {
                alert("Errore nell'eliminazione: " + err.message);
              }
            }}
          >
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Sidebar;
