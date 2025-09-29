import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Form, Row, Spinner, Button, Modal } from "react-bootstrap";
import { FaRegUserCircle, FaEdit } from "react-icons/fa";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "../components/Dashboard/Topbar";
import { fetchProfile, updateProfile } from "../redux/action/LoginActions";

const languageMap = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français",
};

export default function ProfileDetails() {
  const [avatarError, setAvatarError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // formData contiene i valori correnti; avatar può essere URL stringa o File
  const [formData, setFormData] = useState({
    id: null,
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
  // previewAvatar è l’URL locale (object URL) se avatar è File, altrimenti null
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const dispatch = useDispatch();
  const loadingNormal = useSelector((state) => state.loginNormal.loginLoading);
  const loadingGoogle = useSelector((state) => state.loginGoogle.loginLoading);
  const activeUser = useSelector((state) => state.loginGoogle.user || state.loginNormal.user);

  // Ritorna l'URL da mostrare nell’avatar circle:
  // - se previewAvatar è valorizzato (File scelto), uso quello
  // - altrimenti, uso activeUser.avatar (stringa) se presente
  const getAvatarUrl = () => {
    if (previewAvatar) return previewAvatar;
    if (avatarError) return null;
    return activeUser?.avatar;
  };

  // Popolo formData (incluso id) quando cambia activeUser
  useEffect(() => {
    if (activeUser) {
      setFormData({
        id: activeUser.id || null,
        nome: activeUser.nome || "",
        cognome: activeUser.cognome || "",
        email: activeUser.email || "",
        username: activeUser.username || "",
        dataNascita: activeUser.dataNascita || "",
        luogoNascita: activeUser.luogoNascita || "",
        residenza: activeUser.residenza || "",
        nomeCompagnia: activeUser.nomeCompagnia || "",
        lingua: activeUser.lingua || "it",
        avatar: activeUser.avatar || null, // se stringa URL
      });
      setPreviewAvatar(null); // reset preview appena arriva activeUser
    }
  }, [activeUser]);

  // Se manca l'avatar (e non sto già mostrando preview), provo a ricaricare
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!activeUser?.avatar && !previewAvatar) {
        try {
          dispatch(fetchProfile());
        } catch (error) {
          if (isMounted) {
            console.error("Errore nel recupero del profilo:", error);
            setAvatarError(true);
          }
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [dispatch, activeUser?.avatar, previewAvatar]);

  // Handle permanente per caricamento errori avatar (img broken)
  const handleAvatarError = () => {
    setAvatarError(true);
    setPreviewAvatar(null);
  };

  // Apertura/chiusura del modal
  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  // Quando l’utente seleziona un nuovo file avatar:
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Aggiorno formData.avatar con l’oggetto File
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
      // Creo object URL per mostrare subito l’anteprima
      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);
      setAvatarError(false);
    }
  };

  // Aggiorno formData per tutti gli altri campi (readonly => solo nel modal)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit del form di modifica
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatcha updateProfile (che fa PUT multipart o JSON a seconda di avatar)
      await dispatch(updateProfile(formData));
      // Chiudo il modal
      closeEditModal();
      // Se ho usato object URL, posso liberarlo (previo revoke)
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
      }
      // Attendi che Redux propague activeUser aggiornato → useEffect lo ricaricherà
    } catch (err) {
      console.error("Errore aggiornamento profilo:", err);
    }
  };

  if (loadingNormal || loadingGoogle) {
    return (
      <Container className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col sm={1}>
          <Sidebar />
        </Col>
        <Col sm={10}>
          <Topbar />
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Container fluid className="container-details">
              <Row>
                {/* Colonna avatar */}
                <Col md={4} className="d-flex flex-column align-items-center">
                  <div className="avatar-profile-details rounded-circle d-flex justify-content-center align-items-center">
                    {getAvatarUrl() ? (
                      <img src={getAvatarUrl()} alt="Avatar" onError={handleAvatarError} className="w-100 h-100" style={{ objectFit: "cover" }} />
                    ) : (
                      <FaRegUserCircle size={80} className="text-secondary" />
                    )}
                  </div>
                </Col>

                {/* Colonna form e dettagli */}
                <Col md={8}>
                  {/* Titolo e Icona Edit */}
                  <div className="d-flex align-items-center mb-4">
                    <h3 className="me-auto">Il Tuo Profilo</h3>
                    <Button className="editBtn" onClick={openEditModal} title="Modifica profilo">
                      <FaEdit size={24} color="#C69B7B" />
                    </Button>
                  </div>

                  {/* Form statico (readonly) per mostrare i dati */}
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="bg-transparent border-0">Username</Form.Label>
                          <Form.Control name="username" value={formData.username} onChange={handleInputChange} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="bg-transparent border-0">Nome</Form.Label>
                          <Form.Control name="nome" value={formData.nome} onChange={handleInputChange} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="bg-transparent border-0">Cognome</Form.Label>
                          <Form.Control name="cognome" value={formData.cognome} onChange={handleInputChange} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="bg-transparent border-0">Data di nascita</Form.Label>
                          <Form.Control type="date" name="dataNascita" value={formData.dataNascita} onChange={handleInputChange} readOnly />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="bg-transparent border-0">Email</Form.Label>
                          <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="bg-transparent border-0">Luogo di nascita</Form.Label>
                          <Form.Control name="luogoNascita" value={formData.luogoNascita} onChange={handleInputChange} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="bg-transparent border-0">Residenza</Form.Label>
                          <Form.Control name="residenza" value={formData.residenza} onChange={handleInputChange} readOnly />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="bg-transparent border-0">Società</Form.Label>
                          <Form.Control name="nomeCompagnia" value={formData.nomeCompagnia} onChange={handleInputChange} readOnly />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="bg-transparent border-0">Lingua preferita</Form.Label>
                          <Form.Control name="lingua" value={languageMap[formData.lingua]} readOnly />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Container>
          </div>
        </Col>
      </Row>

      {/* ─── MODAL MODIFICA PROFILO ─── */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifica profilo</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Username</Form.Label>
                  <Form.Control name="username" value={formData.username} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Nome</Form.Label>
                  <Form.Control name="nome" value={formData.nome} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Cognome</Form.Label>
                  <Form.Control name="cognome" value={formData.cognome} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Data di nascita</Form.Label>
                  <Form.Control type="date" name="dataNascita" value={formData.dataNascita} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Luogo di nascita</Form.Label>
                  <Form.Control name="luogoNascita" value={formData.luogoNascita} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Residenza</Form.Label>
                  <Form.Control name="residenza" value={formData.residenza} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Società</Form.Label>
                  <Form.Control name="nomeCompagnia" value={formData.nomeCompagnia} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Lingua preferita</Form.Label>
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
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="bg-transparent border-0">Avatar (jpg/png)</Form.Label>
                  <Form.Control type="file" name="avatar" accept="image/*" onChange={handleAvatarFileChange} />
                </Form.Group>
                {/* Anteprima all’interno del modal */}
                {previewAvatar && (
                  <div className="text-center mb-3">
                    <img src={previewAvatar} alt="Anteprima avatar" className="avatarPreview" />
                  </div>
                )}
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={closeEditModal} className="btn-cancel">
              Annulla
            </Button>
            <Button onClick={handleEditSubmit} className="btn-primary">
              Salva modifiche
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
