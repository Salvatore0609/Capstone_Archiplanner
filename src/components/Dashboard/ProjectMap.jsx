import { Card } from "react-bootstrap";
import { FaRegMap } from "react-icons/fa6";
import GoogleMapView from "../commons/GoogleMapView";

const ProjectMap = ({ projects }) => {
  /* const address = "Via Vittorio Era Sassari"; */
  /* Prepara gli indirizzi per la mappa mantenendo i dati necessari */
  const validProjects = Array.isArray(projects) ? projects.filter((p) => p?.indirizzo) : [];

  return (
    <Card className="map-card">
      <Card.Header className="map-header d-flex" style={{ color: "#C69B7B" }}>
        <h5 className="me-auto">Aree Progetti</h5>
        <FaRegMap size={25} style={{ color: "#C69B7B" }} />
      </Card.Header>
      <Card.Body className="map-body">
        {/* Passiamo gli indirizzi come array di oggetti completi */}
        <GoogleMapView projects={validProjects} />
      </Card.Body>
    </Card>
  );
};

export default ProjectMap;
