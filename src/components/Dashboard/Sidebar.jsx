import { Button, Card, Col, Form, Modal, Nav, Row } from "react-bootstrap";
import { FaCog, FaPlus, FaHeart, FaRegUserCircle, FaChevronLeft, FaLayerGroup, FaTimes, FaListUl } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addProject, deleteProject } from "../../redux/action/projectsActions";
import GoogleMapView from "../commons/GoogleMapView";

import { TiDeleteOutline } from "react-icons/ti";

const Sidebar = () => {
  // Stati per la gestione dell'UI
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPhaseCards, setShowPhaseCards] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Stato per il nuovo progetto
  const [newProject, setNewProject] = useState({
    nomeProgetto: "",
    progettista: "",
    impresaCostruttrice: "",
    indirizzo: "",
  });

  // Stati per la mappa
  const [mapForceUpdate, setMapForceUpdate] = useState(0);
  const [addressError, setAddressError] = useState(null);

  // Redux e routing
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects);
  const navigate = useNavigate();
  const location = useLocation();

  const currentProject = location.state?.project;

  const { user: googleUser } = useSelector((state) => state.loginGoogle) || {};
  const { user: normalUser } = useSelector((state) => state.loginNormal) || {};

  const activeUser = googleUser || normalUser;

  const getAvatarUrl = () => {
    const url = activeUser?.avatar || activeUser?.userData?.avatar || activeUser?.picture;
    return typeof url === "string" ? url : null;
  };
  const avatarUrl = getAvatarUrl();

  // Effetto per resettare il form alla apertura del modale
  useEffect(() => {
    if (showModal) {
      setNewProject({
        nomeProgetto: "",
        progettista: "",
        impresaCostruttrice: "",
        indirizzo: "",
      });
      setAddressError(null);
      setMapForceUpdate((prev) => prev + 1);
    }
  }, [showModal]);

  // Gestione submit nuovo progetto
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validazione indirizzo
    if (!newProject.indirizzo || addressError) {
      setAddressError("Inserisci un indirizzo valido");
      return;
    }

    // Crea il progetto con struttura completa
    const nuovoProgetto = {
      ...newProject,
      id: Date.now(), // ID univoco
      phases: {}, // Inizializza le fasi vuote
    };

    dispatch(addProject(nuovoProgetto));
    navigate("/project", { state: { project: nuovoProgetto } });
    setShowModal(false);
  };

  // Array delle fasi predefinite
  const fasiProgetto = [
    { num: "1", titolo: "FASE INIZIALE", sottotitolo: "Studio di Fattibilità & Analisi Preliminare" },
    { num: "2", titolo: "PROGETTAZIONE PRELIMINARE" },
    { num: "3", titolo: "PROGETTAZIONE DEFINITIVA E AUTORIZZAZIONI" },
    { num: "4", titolo: "PROGETTAZIONE ESECUTIVA & APPALTI" },
    { num: "5", titolo: "DIREZIONE LAVORI & CANTIERE" },
    { num: "6", titolo: "FINE LAVORI & AGGIORNAMENTI CATASTALI" },
  ];

  return (
    <>
      {/* SIDEBAR PRINCIPALE */}
      <div className={`d-flex flex-column align-items-center sidebar ${expanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <button onClick={() => setExpanded(!expanded)} className="sidebar-toggle btn btn-link p-1">
          {expanded ? <FaChevronLeft size={25} /> : <FiSidebar size={25} />}
        </button>

        <Nav className="flex-column text-center w-100">
          {/* Logo */}
          <Link to="/dashboard" className="text-decoration-none p-0">
            <Image src="../assets/logo1.jpg" alt="logo" roundedCircle fluid className="h-50" />
          </Link>

          {/* Pulsante Nuovo Progetto */}
          <Nav.Link
            className={`d-flex ${expanded ? "justify-content-start ps-2" : "justify-content-center"} align-items-center`}
            onClick={() => setShowModal(true)}
          >
            <div className="icon-hover">
              <FaPlus size={20} color="#C69B7B" />
            </div>
            {expanded && <span className="ms-2">Nuovo progetto</span>}
          </Nav.Link>

          {/* Lista Progetti */}
          <Nav.Link
            className={`my-3 d-flex ${expanded ? "justify-content-start ps-2" : "justify-content-center"} align-items-center`}
            onClick={() => {
              setShowProjectList(true);
              setShowPhaseCards(false);
            }}
          >
            <div className="icon-hover">
              <FaListUl size={20} color="#C69B7B" />
            </div>
            {expanded && <span className="ms-2">Progetti</span>}
          </Nav.Link>

          {/* Fasi Progetto (mostrato solo se c'è un progetto selezionato) */}
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

          {/* Voci secondarie */}
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

        {/* Footer sidebar */}
        <div className="mt-auto mb-3 d-flex flex-column align-items-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar utente"
              className="avatar-image"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <FaRegUserCircle size={30} className="text-secondary" />
          )}
        </div>
      </div>

      {/* MODAL NUOVO PROGETTO */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crea nuovo progetto</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* Campo Nome Progetto */}
            <Form.Group className="mb-3">
              <Form.Label>Nome progetto</Form.Label>
              <Form.Control
                value={newProject.nomeProgetto}
                onChange={(e) => setNewProject({ ...newProject, nomeProgetto: e.target.value })}
                required
              />
            </Form.Group>

            {/* Campo Progettista */}
            <Form.Group className="mb-3">
              <Form.Label>Progettista</Form.Label>
              <Form.Control value={newProject.progettista} onChange={(e) => setNewProject({ ...newProject, progettista: e.target.value })} required />
            </Form.Group>

            {/* Campo Impresa */}
            <Form.Group className="mb-3">
              <Form.Label>Impresa costruttrice</Form.Label>
              <Form.Control
                value={newProject.impresaCostruttrice}
                onChange={(e) => setNewProject({ ...newProject, impresaCostruttrice: e.target.value })}
                required
              />
            </Form.Group>

            {/* Area Progetto */}
            <Form.Group className="mb-3">
              <Form.Label>Seleziona l&apos;area del progetto</Form.Label>
              <Form.Control
                value={newProject.indirizzo}
                onChange={(e) => setNewProject({ ...newProject, indirizzo: e.target.value })}
                isInvalid={!!addressError}
              />
              {newProject.indirizzo && (
                <div className="my-3">
                  <GoogleMapView address={newProject.indirizzo} key={`map-${mapForceUpdate}`} onError={(error) => setAddressError(error)} />
                  {addressError && <div className="text-danger small mt-2">{addressError}</div>}
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Crea e vai al progetto</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* LISTA PROGETTI FLOTTANTE */}
      {showProjectList && (
        <div className="floating-cards-container">
          <h5>Progetti</h5>
          <Button className="position-absolute top-0 end-0 p-2 bg-transparent" onClick={() => setShowProjectList(false)}>
            <FaTimes size={20} color="#C69B7B" />
          </Button>
          {projects.map((proj, index) => (
            <Card
              key={proj.id}
              className="floating-card mb-3"
              onClick={() => {
                navigate("/project", { state: { project: proj } });
                setShowProjectList(false);
              }}
            >
              <Card.Body>
                <Row className="d-flex justify-content-center">
                  <Col md={2}>
                    <Card.Title>{index + 1}</Card.Title>
                  </Col>
                  <Col md={8} className="d-flex align-items-center">
                    <Card.Subtitle className="text-muted">{proj.nomeProgetto}</Card.Subtitle>
                    <TiDeleteOutline
                      size={25}
                      className="text-danger ms-auto"
                      cursor={"pointer"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectToDelete(proj);
                        setShowDeleteModal(true);
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <Card.Text className="text-secondary">{proj.indirizzo}</Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* LISTA FASI FLOTTANTE */}
      {showPhaseCards && currentProject && (
        <div className="floating-cards-container">
          <h5>{currentProject.nomeProgetto} - Fasi Progetto</h5>
          <Button onClick={() => setShowPhaseCards(false)} className="position-absolute top-0 end-0 p-2 bg-transparent">
            <FaTimes size={20} color="#C69B7B" />
          </Button>
          {fasiProgetto.map((fase) => (
            <Link key={fase.num} to={`/fase/${fase.num}`} state={{ project: currentProject }} className="text-decoration-none">
              <Card className="floating-card mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Card.Title>{fase.num}</Card.Title>
                    </Col>
                    <Col md={10}>
                      <Card.Subtitle className="mb-2 text-muted">{fase.titolo}</Card.Subtitle>
                      {fase.sottotitolo && <Card.Text className="text-secondary">{fase.sottotitolo}</Card.Text>}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* MODAL CONFERMA ELIMINAZIONE */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sei sicuro di voler eliminare il progetto <strong>{projectToDelete?.nomeProgetto}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              dispatch(deleteProject(projectToDelete.id));
              setShowDeleteModal(false);
              setProjectToDelete(null);
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
