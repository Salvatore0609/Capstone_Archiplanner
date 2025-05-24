import { Carousel, Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import ProjectStatus from "../components/Dashboard/ProjectStatus";
import CountdownBox from "../components/Dashboard/CountdownBox";
import ProjectMap from "../components/Dashboard/ProjectMap";
import PersonalyCalendar from "../components/Dashboard/PersonalyCalendar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

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

          {/* WRAPPER che dà altezza fissa e centra il Carousel */}
          <div className="carousel-wrapper">
            <Carousel activeIndex={activeIndex} onSelect={changeSlide} controls={false} indicators={false} interval={null}>
              {/* Slide 1 */}
              <Carousel.Item>
                {/* RIGA 1: ProjectStatus + CountdownBox */}
                <Row className="justify-content-center align-items-center">
                  <Col md={3} className="mt-3">
                    <ProjectStatus />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CountdownBox />
                  </Col>
                </Row>

                {/* RIGA 2: ProjectMap */}
                <Row className="mt-4 justify-content-center">
                  <Col md={6}>
                    <ProjectMap projects={projectLocations} />
                  </Col>
                </Row>
              </Carousel.Item>

              {/* Slide 2 */}
              <Carousel.Item>
                <Row className="justify-content-center">
                  <Col md={6} className="mb-5">
                    <PersonalyCalendar key={refreshKey} />
                  </Col>
                </Row>
              </Carousel.Item>
            </Carousel>
          </div>

          {/* Frecce posizionate con assoluto rispetto a .main-dashboard */}
          <div className="carousel-arrow">
            {activeIndex > 0 && (
              <button onClick={() => changeSlide(activeIndex - 1)} className="carousel-control" aria-label="Previous">
                <FaChevronLeft size={30} color="#C69B7B" />
              </button>
            )}
            {activeIndex < totalSlides - 1 && (
              <button onClick={() => changeSlide(activeIndex + 1)} className="carousel-control" aria-label="Next">
                <FaChevronRight size={30} color="#C69B7B" />
              </button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
