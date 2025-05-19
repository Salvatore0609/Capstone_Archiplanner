import { Carousel, Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import ProjectStatus from "../components/Dashboard/ProjectStatus";
import CountdownBox from "../components/Dashboard/CountdownBox";
/* import ChatWidget from "../components/Dashboard/ChatWidget"; */
import ProjectMap from "../components/Dashboard/ProjectMap";
import PersonalyCalendar from "../components/Dashboard/PersonalyCalendar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const projects = useSelector((state) => state.projects?.items || []);
  // Estrai solo le informazioni necessarie per la mappa
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
    <Container fluid className="homepage">
      <Row>
        <Col sm={1} className="sidebar-container">
          <Sidebar />
        </Col>

        <Col sm={11} className="main-dashboard">
          <Topbar />

          <Carousel activeIndex={activeIndex} onSelect={changeSlide} controls={false} indicators={false} interval={null}>
            <Carousel.Item className="mt-5">
              <Row className="mt-5 d-flex justify-content-center">
                <Col md={3}>
                  <ProjectStatus />
                </Col>
                <Col md={3}>
                  {/* <ChatWidget /> */}
                  <CountdownBox />
                </Col>
              </Row>
              <Row className="mt-5 d-flex justify-content-center">
                <Col md={6}>
                  <ProjectMap projects={projectLocations} />
                </Col>
              </Row>
            </Carousel.Item>

            <Carousel.Item>
              <Row className="mt-5 justify-content-center">
                <Col md={8}>
                  <PersonalyCalendar key={refreshKey} />
                </Col>
              </Row>
            </Carousel.Item>
          </Carousel>

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
