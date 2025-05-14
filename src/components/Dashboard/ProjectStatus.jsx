import { Card } from "react-bootstrap";
import { VscGraph } from "react-icons/vsc";

const statuses = [
  { label: "Da iniziare", count: 12, variant: "light" },
  { label: "In esecuzione", count: 8, variant: "light" },
  { label: "Completati", count: 24, variant: "light" },
];

const ProjectStatus = () => {
  return (
    <Card className="status-card text-start mb-4 p-3">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Card.Title className="mb-0 fs-5" style={{ color: "#C69B7B" }}>
            Progetti
          </Card.Title>
          <VscGraph size={24} color="#C69B7B" className="ms-auto" />
        </div>

        {statuses.map((s, idx) => (
          <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
            <p className="mb-0">{s.label}</p>
            <small className="text-muted">{s.count}</small>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ProjectStatus;
