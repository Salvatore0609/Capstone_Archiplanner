import { Carousel, Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import ProjectMap from "../components/Dashboard/ProjectMap";
import PersonalyCalendar from "../components/Dashboard/PersonalyCalendar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import DashboardInfoCards from "../components/Dashboard/DashboardInfoCards";

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const projects = useSelector((state) => state.projects?.items || []);
  const projectLocations = useMemo(
    () =>
      projects.map(({ id, indirizzo, lat, lng }) => ({
        id,
        indirizzo,
        lat,
        lng,
      })),
    [projects]
  );

  const totalSlides = 2;
  const changeSlide = (newIndex) => {
    if (newIndex < 0 || newIndex >= totalSlides) return;
    setActiveIndex(newIndex);
    if (newIndex === 1) setRefreshKey(Date.now());
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={1}>
          <Sidebar />
        </Col>

        <Col sm={12} className="main-dashboard">
          <Topbar />

          <div className="carousel-wrapper">
            <Carousel activeIndex={activeIndex} onSelect={changeSlide} controls={false} indicators={false} interval={null}>
              {/* Slide 1 */}
              <Carousel.Item>
                <Row className="justify-content-center">
                  <Col xs={12} md={6}>
                    <div className="d-flex flex-column gap-2 w-100">
                      <DashboardInfoCards />

                      <div className="w-100">
                        <ProjectMap projects={projectLocations} />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Carousel.Item>

              {/* Slide 2 */}
              <Carousel.Item>
                <Row className="justify-content-center">
                  <Col md={9}>
                    <PersonalyCalendar key={refreshKey} />
                  </Col>
                </Row>
              </Carousel.Item>
            </Carousel>
          </div>

          {/* Frecce navigazione */}
          <div className="carousel-arrow">
            {activeIndex > 0 && (
              <button onClick={() => changeSlide(activeIndex - 1)} className="carousel-control" aria-label="Previous">
                <FaChevronLeft size={30} />
              </button>
            )}
            {activeIndex < totalSlides - 1 && (
              <button onClick={() => changeSlide(activeIndex + 1)} className="carousel-control" aria-label="Next">
                <FaChevronRight size={30} />
              </button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
