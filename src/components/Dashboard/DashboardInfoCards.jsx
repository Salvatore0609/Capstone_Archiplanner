// (opzionale) DashboardInfoCards.jsx
import ProjectStatus from "./InfoCards/ProjectStatus";
import CountdownBox from "./InfoCards/CountdownBox";

export default function DashboardInfoCards() {
  return (
    <div className="d-flex  flex-column flex-md-row w-100 gap-3">
      <div className="flex-fill">
        <ProjectStatus />
      </div>
      <div className="flex-fill">
        <CountdownBox />
      </div>
    </div>
  );
}
