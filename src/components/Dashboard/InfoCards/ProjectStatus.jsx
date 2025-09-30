// src/components/ProjectStatus.jsx
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { VscGraph } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { getToken } from "../../../redux/utils/authUtils";

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
    <Card className="text-start p-2">
      <Card.Body>
        <div className="d-flex align-items-center">
          <Card.Title className="fs-5" style={{ color: "var(--primary)" }}>
            Progetti
          </Card.Title>
          <VscGraph size={24} className="ms-auto icon-color" />
        </div>

        {statuses.map((s, idx) => (
          <div key={idx} className="d-flex justify-content-between align-items-center border-bottom " style={{ color: "var(--text-dark)" }}>
            <p className="mb-0">{s.label}</p>
            <small>{s.count}</small>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ProjectStatus;
