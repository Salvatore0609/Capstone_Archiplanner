import { Card } from "react-bootstrap";
import { FaRegMap } from "react-icons/fa6";
import GoogleMapView from "../commons/GoogleMapView";

const ProjectMap = ({ projects = [] }) => {
  const validProjects = projects.filter((p) => p?.indirizzo);

  return (
    <Card className="map-card">
      <div className="map-wrapper p-2 pt-0 m-0">
        <div className="d-flex justify-content-between align-items-center border-0">
          <h5 className="map-title m-2" style={{ color: "var(--primary)" }}>
            Aree Progetti
          </h5>
          <FaRegMap size={25} className="map-icon ms-auto icon-color" />
        </div>
        <GoogleMapView projects={validProjects} />
      </div>
    </Card>
  );
};

export default ProjectMap;
