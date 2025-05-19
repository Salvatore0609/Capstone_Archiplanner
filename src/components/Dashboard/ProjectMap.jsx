import { Card } from "react-bootstrap";
import { FaRegMap } from "react-icons/fa6";
import GoogleMapView from "../commons/GoogleMapView";

const ProjectMap = ({ projects = [] }) => {
  const validProjects = projects.filter((p) => p?.indirizzo);

  return (
    <Card className="map-card">
      <Card.Header className="map-header d-flex flex-column" style={{ color: "#C69B7B" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="me-auto">Aree Progetti</h5>
          <FaRegMap size={25} style={{ color: "#C69B7B" }} />
        </div>
        <GoogleMapView projects={validProjects} />
      </Card.Header>
    </Card>
  );
};

export default ProjectMap;
