import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import { fetchProfile } from "../redux/action/LoginActions";
import { getToken } from "../redux/utils/authUtils";

const languageMap = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français",
};

export default function ProfileDetails() {
  const dispatch = useDispatch();

  // Recupera i dati da Redux
  const googleUser = useSelector((state) => state.loginGoogle?.user);
  const normalUser = useSelector((state) => state.loginNormal?.user);
  const loadingNormal = useSelector((state) => state.loginNormal.loginLoading);
  const loadingGoogle = useSelector((state) => state.loginGoogle.loginLoading);

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Effetto per il caricamento iniziale
  useEffect(() => {
    if (getToken()) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  // Stato del form
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    username: "",
    annoNascita: "",
    luogoNascita: "",
    residenza: "",
    nomeCompagnia: "",
    lingua: "it",
    avatar: null,
  });

  // Aggiornamento formData ottimizzato
  useEffect(() => {
    const user = googleUser || normalUser;
    if (user) {
      setFormData({
        nome: user.nome || "",
        cognome: user.cognome || "",
        email: user.email || "",
        username: user.username || "",
        annoNascita: user.annoNascita || "",
        luogoNascita: user.luogoNascita || "",
        residenza: user.residenza || "",
        nomeCompagnia: user.nomeCompagnia || "",
        lingua: user.lingua || "it",
        avatar: user.avatar || null,
      });
    }
  }, [googleUser, normalUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getAvatarUrl = () => {
    const user = googleUser || normalUser;
    return user?.avatar || user?.userData?.avatar || user?.picture;
  };
  // Condizione di caricamento migliorata
  if (showSpinner && (loadingNormal || loadingGoogle) && !googleUser && !normalUser) {
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
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.jpg";
                        }}
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
                        <Form.Label>Anno di Nascita</Form.Label>
                        <Form.Control
                          type="number"
                          name="annoNascita"
                          value={formData.annoNascita}
                          onChange={handleInputChange}
                          min="1900"
                          max={new Date().getFullYear() - 18}
                        />
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
