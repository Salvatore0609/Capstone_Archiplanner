import ProjectStatus2 from "./InfoCards/ProjectStatus2";
import CountdownBox from "./InfoCards/CountdownBox";

export default function DashboardInfoCards() {
  return (
    <div className="row w-100 g-2">
      <div className="col-12 col-md-7">
        <ProjectStatus2 />
      </div>
      <div className="col-12 col-md-5">
        <CountdownBox />
      </div>
    </div>
  );
}
