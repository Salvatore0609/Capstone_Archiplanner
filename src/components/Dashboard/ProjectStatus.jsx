// src/components/ProjectStatus.jsx
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { VscGraph } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { getToken } from "../../redux/utils/authUtils";

const ProjectStatus = () => {
  // “Iniziati” viene dal Redux store
  const iniziati = useSelector((state) => {
    const arr = state.projects?.items;
    return Array.isArray(arr) ? arr.length : 0;
  });

  // “Completati” lo leggiamo da backend via endpoint count-completati
  const [completati, setCompletati] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletati = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/count-completati`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || `HTTP ${res.status}`);
        }
        const count = await res.json(); // backend restituisce un long
        setCompletati(count);
      } catch (err) {
        console.error("Fetch completati error:", err);
        setError("Errore nel recupero dei completati");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletati();
  }, []);

  const statuses = [
    { label: "Iniziati", count: iniziati },
    { label: "Completati", count: loading ? "…" : error ? "-" : completati },
  ];

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
          <div key={idx} className="d-flex justify-content-between align-items-center mb-4 border-bottom">
            <p className="mb-0">{s.label}</p>
            <small className="text-muted">{s.count}</small>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ProjectStatus;
