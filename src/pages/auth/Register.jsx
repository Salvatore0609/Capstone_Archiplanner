import { Button, Form, Spinner, Modal, FormGroup, Alert, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { registerSuccess, registerUser } from "../../redux/action/LoginActions";

function Register({ show, onClose }) {
  const dispatch = useDispatch();
  const { registerLoading: loading, registerError: error } = useSelector((state) => state.loginNormal) || {};

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const languageMap = {
    it: "Italiano",
    en: "English",
    es: "Español",
    fr: "Français",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const userRequest = {
      nome: form.nome.value,
      cognome: form.cognome.value,
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
      annoNascita: parseInt(form.annoNascita.value, 10),
      luogoNascita: form.luogoNascita.value,
      residenza: form.residenza.value,
      nomeCompagnia: form.nomeCompagnia.value,
      lingua: form.lingua.value,
    };

    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(userRequest)], {
        type: "application/json",
      })
    );

    if (imageFile) {
      formData.append("file", imageFile);
    }

    dispatch(registerUser(formData)).then(() => {
      registerSuccess();
      onClose();
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrazione</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Nome *</Form.Label>
                <Form.Control name="nome" required />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label>Cognome *</Form.Label>
                <Form.Control name="cognome" required />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label>Username *</Form.Label>
                <Form.Control name="username" required />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" name="email" required />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label>Password *</Form.Label>
                <Form.Control type="password" name="password" required />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="mb-3">
                <Form.Label>Anno di Nascita *</Form.Label>
                <Form.Control type="number" name="annoNascita" min="1900" max={new Date().getFullYear() - 18} required />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label>Luogo di Nascita *</Form.Label>
                <Form.Control name="luogoNascita" required />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label>Residenza *</Form.Label>
                <Form.Control name="residenza" required />
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label>Nome Compagnia</Form.Label>
                <Form.Control name="nomeCompagnia" />
              </FormGroup>

              <FormGroup className="mb-4">
                <Form.Label>Lingua Preferita *</Form.Label>
                <Form.Select name="lingua" defaultValue="it" required>
                  {Object.entries(languageMap).map(([code, label]) => (
                    <option key={code} value={code}>
                      {" "}
                      {/* Usa code invece del nome completo */}
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup className="mb-3">
            <Form.Label>Avatar</Form.Label>
            <div className="d-flex justify-content-center">
              <div className="rounded-circle" style={{ width: "100px", height: "100px", overflow: "hidden" }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Avatar Preview" className="w-100 h-100" style={{ objectFit: "cover" }} />
                ) : (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}></div>
                )}
              </div>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="form-control mt-2" aria-label="Carica avatar" />
          </FormGroup>

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary" disabled={loading} aria-busy={loading ? "true" : "false"}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Registrazione in corso...
                </>
              ) : (
                "Completa Registrazione"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Register;
