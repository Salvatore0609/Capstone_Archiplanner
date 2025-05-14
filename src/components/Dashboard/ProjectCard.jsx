import { Card } from "react-bootstrap";
import { FaLock } from "react-icons/fa6";

const ProjectCard = ({ project }) => {
  return (
    <Card
      className="m-2"
      style={{
        width: "250px",
        border: project.locked ? "2px solid #ddd" : "2px solid #C69B7B",
        opacity: project.locked ? 0.6 : 1,
      }}
    >
      <Card.Body>
        {project.locked ? (
          <div className="text-center">
            <FaLock className="mb-2" size={24} color="#666" />
            <Card.Text>Progetto bloccato</Card.Text>
          </div>
        ) : (
          <>
            <Card.Title>{project.name}</Card.Title>
            <Card.Text className="small">
              <strong>Progettista:</strong> {project.designer}
              <br />
              <strong>Impresa:</strong> {project.company}
              <br />
              <strong>Località:</strong> {project.location}
            </Card.Text>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;
