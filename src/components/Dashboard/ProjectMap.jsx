import { Card } from "react-bootstrap";
import { FaRegMap } from "react-icons/fa6";
import GoogleMapView from "../commons/GoogleMapView";

const ProjectMap = ({ projects = [] }) => {
  const validProjects = projects.filter((p) => p?.indirizzo);

  /*  return (
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
}; */
  return (
    <Card className="map-card">
      <div style={{ border: "5px solid rgb(255, 255, 255)", borderRadius: "20px" }} className="p-2 pt-0 bg-white m-0">
        <div className="d-flex justify-content-between align-items-center border-0">
          <h5 style={{ color: "#C69B7B" }} className="m-2">
            Aree Progetti
          </h5>
          <FaRegMap size={25} style={{ color: "#C69B7B" }} className="me-auto" />
        </div>
        <GoogleMapView projects={validProjects} />
      </div>
    </Card>
  );
};

export default ProjectMap;
