import { useLocation, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import { phase1Tasks } from "../components/StepsProject/phase1Tasks";
import { phase2Tasks } from "../components/StepsProject/phase2Tasks";
import { phase3Tasks } from "../components/StepsProject/phase3Tasks";
import { phase4Tasks } from "../components/StepsProject/phase4Tasks";
import { phase5Tasks } from "../components/StepsProject/phase5Tasks";
import { phase6Tasks } from "../components/StepsProject/phase6Tasks";
import TaskCard from "../components/StepsProject/TaskCard";

const titles = {
  1: "FASE INIZIALE",
  2: "PROGETTAZIONE PRELIMINARE",
  3: "PROGETTAZIONE DEFINITIVA E AUTORIZZAZIONI",
  4: "PROGETTAZIONE ESECUTIVA & APPALTI",
  5: "DIREZIONE LAVORI & CANTIERE",
  6: "FINE LAVORI & AGGIORNAMENTI CATASTALI",
};

const phaseTasksMap = {
  1: phase1Tasks,
  2: phase2Tasks,
  3: phase3Tasks,
  4: phase4Tasks,
  5: phase5Tasks,
  6: phase6Tasks,
};

const FasePage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const project = state?.project;
  const phaseNum = Number(id);
  const phase = { id: phaseNum };
  const tasks = phaseTasksMap[phaseNum] || [];
  const title = titles[phaseNum] || `Fase ${phaseNum}`;

  return (
    <Container fluid className="fase-page">
      <Row>
        <Col sm={1} className="sidebar-container">
          <Sidebar />
        </Col>

        <Col sm={11} className="main-dashboard">
          <Topbar />

          <Row className="justify-content-center m-5" style={{ overflowY: "auto", height: "calc(85vh - 180px)" }}>
            <h5 className="mt-3">{title}</h5>
            {tasks.map((task) => (
              <Col key={task.id} md={12}>
                <TaskCard task={task} project={project} phase={phase} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default FasePage;
