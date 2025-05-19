import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useEffect, useMemo } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import GoogleMapView from "../components/commons/GoogleMapView";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../redux/action/projectsActions";
import { deleteStepDataById, fetchStepDataByProject } from "../redux/action/stepDataActions";

const Project = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  // Carico i progetti se non esistono
  const projects = useSelector((state) => state.projects.items || []);
  const isLoadingProjects = useSelector((state) => state.projects.loading);

  // Trovo il progetto corrente (numero ID)
  const project = useMemo(() => {
    return Array.isArray(projects) ? projects.find((p) => p.id === Number(id)) : null;
  }, [projects, id]);

  // Fetch degli StepData per questo project.id
  const { items: stepDataItems, loading: isLoadingStepData } = useSelector((state) => state.stepData);

  useEffect(() => {
    if (!projects.length) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  useEffect(() => {
    if (project) {
      dispatch(fetchStepDataByProject(project.id));
    }
  }, [dispatch, project]);

  useEffect(() => {
    // Se ho finito di caricare i progetti e non trovo “project”, vado su /dashboard
    if (!isLoadingProjects && projects.length >= 0 && !project) {
      navigate("/dashboard");
    }
  }, [project, projects, navigate, isLoadingProjects]);

  if (isLoadingProjects || !project) {
    return <Spinner />;
  }

  return (
    <Container fluid>
      <Row>
        <Col sm={1}>
          <Sidebar />
        </Col>
        <Col sm={11} style={{ overflowY: "auto", height: "95vh" }}>
          <Topbar />
          <div className="p-5">
            <h4>{project.nomeProgetto}</h4>

            <Col className="d-flex gap-3">
              <div className="d-flex">
                <span>Progettista:</span>
                <p>{project.progettista || "Non specificato"}</p>
              </div>
              <div className="d-flex">
                <span>Impresa costruttrice:</span>
                <p>{project.impresaCostruttrice || "Non specificata"}</p>
              </div>
              <div className="d-flex">
                <span>Indirizzo:</span>
                <p>{project.indirizzo}</p>
              </div>
            </Col>

            <div className="mt-5">
              <GoogleMapView projects={[project]} />
            </div>

            {/* Qui mostro l’elenco di tutti gli StepData salvati */}
            <div className="mt-5">
              <h5>Dati task/step per questo progetto</h5>
              {isLoadingStepData ? (
                <Spinner />
              ) : (
                <div>
                  {stepDataItems.length === 0 ? (
                    <p>Nessun dato salvato finora.</p>
                  ) : (
                    stepDataItems.map((sd) => (
                      <Row key={sd.id} className="mb-3 align-items-center">
                        <Col md={4}>
                          {sd.fileName ? (
                            <a href={sd.fileName} target="_blank" rel="noopener noreferrer">
                              Scarica allegato
                            </a>
                          ) : (
                            <em>No file</em>
                          )}
                        </Col>
                        <Col md={4}>
                          {sd.textareaValue && <p>Testo: {sd.textareaValue}</p>}
                          {sd.dropdownSelected && <p>Selezione: {sd.dropdownSelected}</p>}
                          {sd.checkboxValue !== null && <p>Checkbox: {sd.checkboxValue ? "Sì" : "No"}</p>}
                        </Col>
                        <Col md={3}>
                          <p>Aggiornato: {new Date(sd.updatedAt).toLocaleString("it-IT")}</p>
                        </Col>
                        <Col md={1}>
                          <Button variant="danger" size="sm" onClick={() => dispatch(deleteStepDataById(sd.id, project.id))}>
                            Elimina
                          </Button>
                        </Col>
                      </Row>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Project;
