import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import GoogleMapView from "../components/commons/GoogleMapView";

const Project = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();

  // Cerca il progetto in due modi:
  // 1. Dallo state della navigazione (se arriviamo da un link interno)
  // 2. Dallo store Redux tramite ID (se la pagina viene ricaricata)
  const projectFromState = location.state?.project;
  const projectFromStore = useSelector((state) => state.projects.find((p) => p.id === Number(projectId)));

  // Unifica i due risultati
  const project = projectFromState || projectFromStore;

  // Effetto per il redirect se il progetto non esiste
  useEffect(() => {
    if (!project) {
      navigate("/dashboard");
    }
  }, [project, navigate]);

  if (!project) return null;

  return (
    <Container fluid>
      <Row>
        <Col sm={1}>
          <Sidebar />
        </Col>
        <Col sm={11} style={{ overflowY: "auto", height: "95vh" }}>
          <Topbar />
          <div className="p-4">
            <h4>{project.nomeProgetto}</h4>

            <div className="mt-5">
              <h6>Progettista:</h6>
              <p>{project.progettista || "Non specificato"}</p>
            </div>

            <div className="mt-3">
              <h6>Impresa costruttrice:</h6>
              <p>{project.impresaCostruttrice || "Non specificata"}</p>
            </div>

            <div className="mt-3">
              <h6>Indirizzo:</h6>
              <p>{project.indirizzo}</p>
            </div>

            <div className="mt-5">
              <GoogleMapView projects={[project]} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Project;
