import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import { fetchProfile } from "../redux/action/LoginActions";

const languageMap = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français",
};

export default function ProfileDetails() {
  const [avatarError, setAvatarError] = useState(false);
  // Recupera i dati da Redux
  const loadingNormal = useSelector((state) => state.loginNormal.loginLoading);
  const loadingGoogle = useSelector((state) => state.loginGoogle.loginLoading);
  const activeUser = useSelector((state) => state.loginGoogle.user || state.loginNormal.user);
  console.log("Active User:", activeUser);
  const dispatch = useDispatch();
  // Stato del form
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    username: "",
    dataNascita: "",
    luogoNascita: "",
    residenza: "",
    nomeCompagnia: "",
    lingua: "it",
    avatar: null,
  });

  const getAvatarUrl = () => {
    if (avatarError) return null;
    return activeUser?.avatar;
  };

  useEffect(() => {
    if (activeUser) {
      setFormData({
        nome: activeUser.nome || "",
        cognome: activeUser.cognome || "",
        email: activeUser.email || "",
        username: activeUser.username || "",
        dataNascita: activeUser.dataNascita || "",
        luogoNascita: activeUser.luogoNascita || "",
        residenza: activeUser.residenza || "",
        nomeCompagnia: activeUser.nomeCompagnia || "",
        lingua: activeUser.lingua || "it",
        avatar: activeUser.avatar || null,
      });
    }
  }, [activeUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!activeUser?.avatar) {
        // Solo se manca l'avatar
        try {
          dispatch(fetchProfile());
        } catch (error) {
          if (isMounted) {
            console.error("Error fetching profile:", error);
            setAvatarError(true);
          }
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [dispatch, activeUser?.avatar]); // Solo alla modifica dell'avatar

  if (loadingNormal || loadingGoogle) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col sm={1} className="p-0">
          <Sidebar />
        </Col>
        <Col sm={11} className="p-0">
          <Topbar />
          <Container className="p-5 d-flex flex-column justify-content-center">
            <Row className="mb-4">
              <Col>
                <h1 className="text-center">Il Tuo Profilo</h1>
              </Col>
            </Row>
            <Row>
              <Col md={4} className="d-flex flex-column align-items-center mb-4">
                <div className="position-relative">
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "150px",
                      height: "150px",
                      overflow: "hidden",
                      border: "5px solid #C69B7B",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    {getAvatarUrl() ? (
                      <img
                        src={getAvatarUrl()}
                        alt="Avatar"
                        onError={() => setAvatarError(true)}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <FaRegUserCircle size={80} className="text-secondary" />
                    )}
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" value={formData.username} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control name="nome" value={formData.nome} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Cognome</Form.Label>
                        <Form.Control name="cognome" value={formData.cognome} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>La tua data di Nascita</Form.Label>
                        <Form.Control type="date" name="dataNascita" value={formData.dataNascita} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Luogo di Nascita</Form.Label>
                        <Form.Control name="luogoNascita" value={formData.luogoNascita} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Indirizzo di Residenza</Form.Label>
                        <Form.Control name="residenza" value={formData.residenza} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nome Compagnia</Form.Label>
                        <Form.Control name="nomeCompagnia" value={formData.nomeCompagnia} onChange={handleInputChange} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Lingua Preferita</Form.Label>
                        <Form.Select name="lingua" value={formData.lingua} onChange={handleInputChange}>
                          {Object.entries(languageMap).map(([code, label]) => (
                            <option key={code} value={code}>
                              {label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
