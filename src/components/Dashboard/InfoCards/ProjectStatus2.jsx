// src/components/ProjectStatus.jsx
import { useState, useEffect, useMemo } from "react";
import { Card, Spinner } from "react-bootstrap";
import { VscGraph } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { getToken } from "../../../redux/utils/authUtils";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// Registrazione (necessaria con Chart.js v3+ / v4)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        setCompletati(Number(count) || 0);
      } catch (err) {
        console.error("Fetch completati error:", err);
        setError("Errore nel recupero dei completati");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletati();
  }, []);

  // Labels e dataset per il Bar chart
  const labels = ["Iniziati", "Completati"];
  const data = useMemo(() => {
    // uso di variabili CSS di Bootstrap per restare coerenti con il tema
    const rootStyles = getComputedStyle(document.documentElement);
    const colorIniziati = rootStyles.getPropertyValue("--info")?.trim() || "#0d6efd";
    const colorCompletati = rootStyles.getPropertyValue("--success")?.trim() || "#198754";

    return {
      labels,
      datasets: [
        {
          label: "Numero progetti",
          data: [iniziatiCountSafe(iniziati), completatiCountSafe(completati, loading, error)],
          backgroundColor: [colorIniziati, colorCompletati],
          borderColor: [colorIniziati, colorCompletati],
          borderWidth: 1,
        },
      ],
    };

    // funzioni helper locali per evitare NaN in grafico
    function iniziatiCountSafe(v) {
      return typeof v === "number" && !Number.isNaN(v) ? v : 0;
    }
    function completatiCountSafe(v, isLoading, isError) {
      // se loading o errore, passiamo 0 (grafico mostrera' 0) — manteniamo lo stato testuale sotto al grafico
      return isLoading || isError ? 0 : typeof v === "number" && !Number.isNaN(v) ? v : 0;
    }
  }, [iniziati, completati, loading, error]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Stato progetti" },
      tooltip: {
        callbacks: {
          // mostriamo il valore reale anche se loading/errore (possibile override)
          label: function (context) {
            const label = context.dataset.label || "";
            return `${label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // numeri interi
        },
      },
    },
  };

  return (
    <Card className="text-start p-2">
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          <Card.Title className="fs-5 mb-0" style={{ color: "var(--primary)" }}>
            Progetti
          </Card.Title>
          <VscGraph size={24} className="ms-auto icon-color" />
        </div>

        {/* Grafico (altezza fissata per controllare l'aspect ratio dentro la card) */}
        <div style={{ height: 220 }}>
          <Bar data={data} options={options} />
        </div>

        {/* Riepilogo testuale sotto il grafico per accessibilità / stato */}
        <div className="mt-3">
          {loading ? (
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              <small>Caricamento completati . . .</small>
            </div>
          ) : error ? (
            <small className="text-danger">{error}</small>
          ) : (
            <div className="d-flex justify-content-between" style={{ color: "var(--text-dark" }}>
              <div>
                <small className="d-block">Iniziati</small>
                <strong>{iniziati}</strong>
              </div>
              <div>
                <small className="d-block">Completati</small>
                <strong>{completati}</strong>
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectStatus;
