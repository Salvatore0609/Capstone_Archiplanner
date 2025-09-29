import { useState, useEffect } from "react";
import { Button, Form, Container, Spinner, Alert, FormGroup, Col, Row, Card } from "react-bootstrap";
import Register from "./Register";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, loginUser } from "../../redux/action/LoginActions";
import ThemeToggle from "../../components/commons/ThemeToogle";

function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.loginNormal) || {};

  const handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = event.target;
    dispatch(loginUser(username.value, password.value, navigate));
  };

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  return (
    <>
      <ThemeToggle className="position-absolute top-0 start-0 m-3" />
      <Container fluid className="d-flex align-items-center">
        <Row className="w-100">
          <Col lg={8} className="d-none d-lg-flex align-items-center justify-content-center">
            <div className="position-relative w-100 h-100">
              {/* Testo descrittivo */}
              <Card
                className="p-3 text-light "
                style={{
                  right: "-5%",
                  top: "5%",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  backdropFilter: "blur(10px)",
                  border: "0px solid",
                  borderRadius: "20px",
                  width: "100%",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  maxHeight: "90%",
                  overflowY: "auto",
                }}
              >
                <div
                  className="position-absolute"
                  style={{
                    left: "60%",
                    top: "50%",
                    width: "40%",
                    height: "60%",
                    background: "url('/assets/logo.png') no-repeat center center",
                    backgroundSize: "contain",
                    opacity: 1,
                    zIndex: 1000,
                  }}
                />
                <Card.Body>
                  <h1 className="text-center mb-4" style={{ color: "var(--primary)", fontSize: "2rem", fontWeight: "bold" }}>
                    ARCHIPLANNER
                  </h1>
                  <h2 className="text-center mb-4" style={{ color: "var(--text-dark)", fontSize: "1.2rem" }}>
                    La piattaforma per la gestione intelligente dei progetti architettonici
                  </h2>

                  <div className="mb-4">
                    <h4 style={{ color: "var(--primary)" }}>PROBLEMA ATTUALE NEL SETTORE EDILIZIO E URBANISTICO:</h4>
                    <p>I professionisti e gli studi tecnici si trovano ogni giorno ad affrontare:</p>
                    <ul>
                      <li> Documentazione frammentata tra Comuni, SUAP e Catasto</li>
                      <li> Difficoltà nel tracciare le 6 fasi progettuali</li>
                      <li> Perdita di tempo nella ricerca delle normative urbanistiche</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 style={{ color: "var(--primary)" }}>LA SOLUZIONE: ARCHIPLANNER</h4>
                    <p>Una piattaforma centralizzata che semplifica e potenzia la gestione dei progetti architettonici:</p>

                    <h5>GESTIONE INTELLIGENTE DELLE FASI PROGETTUALI</h5>
                    <p>Progetti strutturati automaticamente in 6 fasi conformi alle normative tramite:</p>
                    <ul>
                      <li>Task guidate</li>
                      <li>Documenti precompilati</li>
                    </ul>

                    <h5>BANCA DATI NORMATIVA INTEGRATA</h5>
                    <p>Restituisce:</p>
                    <ul>
                      <li>Articoli di legge</li>
                      <li>Parametri urbanistici</li>
                      <li>Usi del territorio e vincoli</li>
                    </ul>
                    <p>Tutto tramite schede tecniche pre-caricate per ogni fase del progetto.</p>

                    <h5>ORGANIZZAZIONE EFFICACE</h5>
                    <ul>
                      <li>Calendario personale (sincronizzato con Google Calendar)</li>
                      <li>Georeferenziazione automatica dei progetti</li>
                      <li>Notifiche in tempo reale (WebSocket)</li>
                      <li>File sharing con anteprima dei documenti</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 style={{ color: "var(--primary)" }}>PERCHÉ FUNZIONA</h4>
                    <p>Con Archiplanner i team possono:</p>
                    <ul>
                      <li>Ridurre del 40% i tempi di gestione</li>
                      <li>Evitare errori normativi</li>
                      <li>Aumentare la produttività grazie a:</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
          <Form onSubmit={handleSubmit} className="login-form  ms-auto py-5">
            <img src="/assets/logo.png" alt="Logo" className="w-100 h-30" />
            {error && <Alert variant="danger">{error}</Alert>}
            <FormGroup>
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                required
                autoComplete="username"
                style={{ borderRadius: "25px", border: "3px solid var(--primary)" }}
              />
              <Form.Label className="mt-3 fw-bold">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                required
                autoComplete="current-password"
                style={{ borderRadius: "25px", border: "3px solid var(--primary)" }}
              />
              <div className="d-flex gap-3 mt-4">
                <Button type="submit" className="w-100 fw-bold" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Accesso...
                    </>
                  ) : (
                    "Accedi"
                  )}
                </Button>
                <Button
                  className="w-100 fw-bold"
                  onClick={() => setShowRegister(true)}
                  style={{
                    backgroundColor: "#FFBC02",
                    border: "none",
                  }}
                >
                  Registrati
                </Button>
              </div>
              <div className="text-center my-3 fw-bold">— oppure —</div>
              <Button
                className="w-100 fw-bold"
                onClick={handleGoogleLogin}
                style={{
                  backgroundColor: "#7BADC6",
                  border: "none",
                }}
              >
                Continua con Google
              </Button>
            </FormGroup>
          </Form>
        </Row>

        <Register show={showRegister} onClose={() => setShowRegister(false)} />
      </Container>
    </>
  );
}

export default Login;
