import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useMemo } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import GoogleMapView from "../components/commons/GoogleMapView";
import { useSelector } from "react-redux";

const Project = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const projects = useSelector((state) => state.projects.items || []);
  const project = useMemo(() => {
    return Array.isArray(projects) ? projects.find((p) => p.id === Number(id)) : null;
  }, [projects, id]);

  const isLoading = useSelector((state) => state.projects.loading);

  useEffect(() => {
    if (!isLoading && projects.length >= 0 && !project) {
      console.error("Progetto non trovato");
      // Se il progetto non esiste, reindirizza alla dashboard
      navigate("/dashboard");
    }
  }, [project, projects, navigate, isLoading]);

  if (isLoading) {
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
