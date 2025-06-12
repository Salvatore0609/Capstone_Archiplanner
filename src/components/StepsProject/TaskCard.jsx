import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, ListGroup, Form, Modal } from "react-bootstrap";
import { fetchStepDataByProject, saveStepData, uploadStepFile } from "../../redux/action/stepDataActions";
import BooleanPill from "../commons/BooleanPill";
import { getToken } from "../../redux/utils/authUtils";
import { IoMdDownload } from "react-icons/io";

// #region renderParametri
const renderParametri = (parametri) => {
  return (
    <ul style={{ marginTop: 4 }}>
      {parametri.map((p, i) => (
        <li key={i}>
          Indice Fondiario: {p.indiceFondiario} <br />
          Altezza Massima: {p.altezzaMassima} <br />
          Rapporto Copertura: {p.rapportoCopertura} <br />
          Intensità Territoriale Massima: {p.intensitaTerritorialeMassima} <br />
          Lotto Minimo: {p.lottoMinimo} <br />
          Volume Massimo: {p.volumeMassimo} <br />
          Indice Territoriale: {p.indiceTerritoriale} <br />
          Volumetria: {p.volumetria?.join(", ")} <br />
          Incremento: {p.incremento} <br />
          Deroga: {p.deroga} <br />
          Tipo: {p.tipo} <br />
          Indice: {p.indice} <br />
          Note: {p.note}
        </li>
      ))}
    </ul>
  );
};
// #endregion

// #region renderUsiPermessi
const renderUsiPermessi = (usiPermessi) => {
  return (
    <ul>
      {usiPermessi.map((uso) => (
        <li key={uso.id} style={{ marginBottom: 8 }}>
          <strong>Zona:</strong> {uso.zona} <br />
          <strong>Macrocategorie:</strong> {uso.macrocategorie} <br />
          <strong>Descrizione:</strong> {uso.descrizione} <br />
          <strong>Usi:</strong>
          <ul>
            {uso.usi?.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
          {uso.note && (
            <p>
              <strong>Note:</strong> {uso.note}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};
// #endregion

// renderizza il dettaglio completo dell’articolo
const renderContent = (art) => {
  if (!art) return null;
  return (
    <div
      style={{
        maxHeight: 400,
        overflowY: "auto",
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 4,
      }}
    >
      <h5>{art.titolo}</h5>
      {art.sezioni.map((sez) => (
        <div key={sez.sezId} style={{ marginBottom: 16 }}>
          <h6>Sezione: {sez.titolo}</h6>
          {sez.contenuto?.map((c, i) => (
            <p key={i}>{c}</p>
          ))}
          {sez.sottozone?.map((sz) => (
            <div key={sz.sottozId} style={{ paddingLeft: 16, marginBottom: 8 }}>
              <strong>Sottozona:</strong> {sz.nome}
              <br />
              <em>Descrizione:</em> {sz.descrizione}
              {renderParametri(sz.parametri)}
              {sz.note && (
                <p>
                  <strong>Note:</strong> {sz.note}
                </p>
              )}
            </div>
          ))}
          {sez.categorie?.length > 0 && (
            <p>
              <strong>Categorie:</strong> {sez.categorie.join(", ")}
            </p>
          )}
          {renderUsiPermessi(sez.usiPermessi)}
          {sez.parametriUrbanistici && <pre style={{ background: "#f5f5f5", padding: 8 }}>{JSON.stringify(sez.parametriUrbanistici, null, 2)}</pre>}
        </div>
      ))}
    </div>
  );
};

const TaskCard = ({ task, project, phase }) => {
  const dispatch = useDispatch();
  const stepDataItems = useSelector((state) => state.stepData.items || []);

  // Ricompongo taskState con useMemo
  const taskState = useMemo(() => {
    const state = {};
    stepDataItems
      .filter((sd) => sd.projectId === project.id && sd.taskId === task.id)
      .forEach((sd) => {
        state[`step-${sd.stepId}`] = sd;
      });
    return state;
  }, [stepDataItems, project.id, task.id]);

  const [localData, setLocalData] = useState({});
  const [activeModalStep, setActiveModalStep] = useState(null);
  const [modalTextareaValue, setModalTextareaValue] = useState("");
  const [pdfPreview, setPdfPreview] = useState({
    show: false,
    url: null,
    fileName: "",
  });

  // elenco dei titoli + id degli articoli
  // ogni elemento: { id: <numero>, titolo: <string> }
  const [titles, setTitles] = useState([]);
  // id dell’articolo selezionato (serve per fare il fetch del dettaglio e per il payload "artId")
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  // titolo dell’articolo selezionato (viene salvato in localData per passo 4)
  const [selectedArticleTitle, setSelectedArticleTitle] = useState("");
  const [fullArticle, setFullArticle] = useState(null);
  const [loading, setLoading] = useState({ titles: false, article: false });

  // Carica tutti i stepData del progetto appena project cambia
  useEffect(() => {
    if (project?.id) {
      dispatch(fetchStepDataByProject(project.id));
    }
  }, [dispatch, project]);

  // Inizializzo selectedArticleId e selectedArticleTitle se lo step 4 era già salvato
  useEffect(() => {
    const artStep = task.steps.find((s) => s.id === 4);
    if (!artStep) return;

    const saved = taskState[`step-${artStep.id}`];
    if (saved?.artId) {
      setSelectedArticleId(saved.artId);

      // Il titolo salvato era in saved.dropdownSelected (se in passato avevamo già usato "titolo").
      // Se non lo troviamo, dovremo cercarlo dentro titles in un secondo momento.
      if (saved.dropdownSelected) {
        setSelectedArticleTitle(saved.dropdownSelected);
      }
    }
  }, [taskState, task]);

  // Carico la lista completa di titoli articoli (solo se esiste passo id=4)
  useEffect(() => {
    if (!task.steps.some((s) => s.id === 4)) return;

    setLoading((prev) => ({ ...prev, titles: true }));
    fetch(`${import.meta.env.VITE_API_URL}/articoli`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        // data = array di ArticoloResponse { id, titolo, ... }
        setTitles(data.map((art) => ({ id: art.id, titolo: art.titolo })));

        // Se avevamo un selectedArticleId ma non avevamo ancora impostato il titolo,
        // proviamo a ricavarlo da questa lista:
        if (!selectedArticleTitle && selectedArticleId) {
          const found = data.find((art) => art.id === selectedArticleId);
          if (found) {
            setSelectedArticleTitle(found.titolo);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading((prev) => ({ ...prev, titles: false })));
  }, [task, selectedArticleId, selectedArticleTitle]);

  // Quando selectedArticleId cambia, carico il dettaglio completo e imposto selectedArticleTitle
  useEffect(() => {
    const loadFullArticle = async () => {
      if (!selectedArticleId) {
        setFullArticle(null);
        setSelectedArticleTitle("");
        return;
      }
      setLoading((prev) => ({ ...prev, article: true }));
      try {
        const token = getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/articoli/${selectedArticleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore nel fetch articolo");
        const data = await res.json();
        setFullArticle(data);

        // Imposto il titolo appena caricato
        if (data.titolo) {
          setSelectedArticleTitle(data.titolo);
        }
      } catch (err) {
        console.error("Errore caricamento articolo:", err);
      } finally {
        setLoading((prev) => ({ ...prev, article: false }));
      }
    };

    loadFullArticle();
  }, [selectedArticleId]);

  const handleFieldChange = (stepKey, newPartialData) => {
    setLocalData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        ...newPartialData,
      },
    }));
  };

  const handleSaveStep = async (stepIndex) => {
    const step = task.steps?.[stepIndex];
    if (!step || !step.id) return;

    const realStepId = step.id;
    const stepKey = `step-${realStepId}`;
    const saved = taskState[stepKey] || {};
    const draft = localData[stepKey] || {};

    const payload = {
      id: saved.id || null,
      projectId: project.id,
      faseId: phase.id,
      taskId: task.id,
      stepId: realStepId,
      textareaValue: draft.textareaValue ?? saved.textareaValue ?? null,
      // Per i dropdown generici:
      dropdownSelected: draft.dropdownSelected ?? saved.dropdownSelected ?? null,
      checkboxValue: typeof draft.checkboxValue !== "undefined" ? draft.checkboxValue : saved.checkboxValue ?? null,
      // Per lo step 4: mandiamo solo artId, in backend salverà anche dropdownSelected=title
      artId: step.id === 4 ? selectedArticleId : null,
    };

    try {
      await dispatch(saveStepData(payload.projectId, payload.faseId, payload.taskId, payload.stepId, payload));
      setLocalData((prev) => {
        const copy = { ...prev };
        delete copy[stepKey];
        return copy;
      });
    } catch (err) {
      alert("Errore nel salvataggio: " + err.message);
    }
  };

  const handleFileUpload = (stepIndex, file) => {
    const realStepId = task.steps[stepIndex].id;
    dispatch(uploadStepFile(project.id, phase.id, task.id, realStepId, file))
      .then(() => {
        dispatch(fetchStepDataByProject(project.id));
      })
      .catch((err) => {
        console.error("Errore upload:", err);
        alert("Errore durante l'upload del file.");
      });
  };

  // Apre l'anteprima PDF utilizzando Google Docs Viewer
  const openPdfPreview = (fileUrl, fileName) => {
    setPdfPreview({
      show: true,
      url: fileUrl,
      fileName: fileName,
    });
  };

  // Chiude l'anteprima PDF
  const closePdfPreview = () => {
    setPdfPreview({
      show: false,
      url: null,
      fileName: "",
    });
  };

  return (
    <>
      <Card className="task-card p-4 rounded-4 mb-3">
        <Card.Body>
          <div className="fw-bold fs-5 mb-3">{task.title}</div>
          <ListGroup variant="flush">
            {task.steps.map((step, idx) => {
              const realStepId = step.id;
              const stepKey = `step-${realStepId}`;
              const savedData = taskState[stepKey] || {};
              const draft = localData[stepKey] || {};

              return (
                <ListGroup.Item key={realStepId} className="border-0 px-0 py-2 bg-transparent">
                  <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                    {/* Se non è boolean, mostro la label col pill classico */}
                    {!step.type.includes("boolean") && <span className="task-label-pill">{step.label}</span>}

                    {/* ------------ BOOLEAN ------------ */}
                    {step.type.includes("boolean") && (
                      <BooleanPill
                        label={step.label}
                        checked={draft.checkboxValue ?? savedData.checkboxValue ?? false}
                        onChange={(val) =>
                          handleFieldChange(stepKey, {
                            checkboxValue: val,
                          })
                        }
                      />
                    )}

                    {/* ------------ DROPDOWN ------------ */}
                    {step.type.includes("dropdown") && (
                      <>
                        {step.id === 4 ? (
                          // Se è lo step 4, mostro la lista degli articoli
                          loading.titles ? (
                            <div>Caricamento titoli...</div>
                          ) : (
                            <>
                              <Form.Select
                                value={
                                  // primo tentativo: titolo in stato
                                  selectedArticleTitle ||
                                  // se non ci fosse, magari savedData.dropdownSelected
                                  savedData.dropdownSelected ||
                                  ""
                                }
                                onChange={(e) => {
                                  const titoloSelezionato = e.target.value;
                                  // salvo la stringa titolo in localData
                                  handleFieldChange(stepKey, {
                                    dropdownSelected: titoloSelezionato,
                                  });

                                  // cerco l’ID corrispondente nell’array "titles"
                                  const found = titles.find((t) => t.titolo === titoloSelezionato);
                                  if (found) {
                                    setSelectedArticleId(found.id);
                                    setSelectedArticleTitle((trovatoTitolo) => trovatoTitolo || titoloSelezionato);
                                  } else {
                                    setSelectedArticleId(null);
                                    setSelectedArticleTitle("");
                                  }
                                }}
                              >
                                <option value="">Seleziona articolo…</option>
                                {titles.map((t) => (
                                  <option key={t.id} value={t.titolo}>
                                    {t.titolo}
                                  </option>
                                ))}
                              </Form.Select>

                              {loading.article && <div className="mt-2">Caricamento dettaglio articolo…</div>}

                              {fullArticle && renderContent(fullArticle)}
                            </>
                          )
                        ) : (
                          // Dropdown generico per gli altri step
                          <>
                            <Form.Select
                              value={draft.dropdownSelected ?? savedData.dropdownSelected ?? ""}
                              onChange={(e) =>
                                handleFieldChange(stepKey, {
                                  dropdownSelected: e.target.value,
                                })
                              }
                            >
                              <option value="">Seleziona…</option>
                              {step.options &&
                                step.options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                            </Form.Select>
                            {(draft.dropdownSelected ?? savedData.dropdownSelected) && (
                              <>
                                <Button
                                  size="sm"
                                  className="ms-auto btn-link-custom"
                                  onClick={() => {
                                    window.open("https://www.sardegnaimpresa.eu/it/sportello-unico", "_blank");
                                  }}
                                >
                                  SUAPEE
                                </Button>

                                <Button
                                  size="sm"
                                  className="ms-auto btn-link-custom"
                                  onClick={() => {
                                    window.open("https://www.comune.sassari.it/.galleries/doc-documenti/edilizio_comunale.pdf", "_blank");
                                  }}
                                >
                                  Comune di Sassari - Regolamento Edilizio
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              className="ms-auto btn-link-custom"
                              onClick={() => {
                                const selectedArea = draft.dropdownSelected ?? savedData.dropdownSelected ?? null;
                                if (!selectedArea) {
                                  alert("Seleziona prima un'area.");
                                  return;
                                }
                                window.open("https://www.urbismap.com", "_blank");
                              }}
                            >
                              UrbisMap
                            </Button>
                          </>
                        )}
                      </>
                    )}

                    {/* ------------ TEXTAREA (commento) ------------ */}
                    {step.type.includes("textarea") && (
                      <Button
                        size="sm"
                        className="btn-commenta-custom"
                        onClick={() => {
                          setActiveModalStep(stepKey);
                          setModalTextareaValue(draft.textareaValue ?? savedData.textareaValue ?? "");
                        }}
                      >
                        Commenta
                      </Button>
                    )}

                    {/* ------------ FILE UPLOAD ------------ */}
                    {step.type.includes("file") && (
                      <div className="d-flex align-items-center gap-2">
                        {/* File name display - appears to the left of the button */}
                        {savedData.fileName && (
                          <div className="d-flex align-items-center gap-2">
                            {savedData.fileUrl ? (
                              <>
                                <a
                                  href={savedData.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="fw-bold text-decoration-none"
                                  style={{ color: "#7BADC6" }}
                                >
                                  {savedData.fileName}
                                </a>

                                {/* Pulsante Anteprima PDF */}
                                {savedData.fileName.toLowerCase().endsWith(".pdf") && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="text-secondary p-0 ms-2"
                                    onClick={() => openPdfPreview(savedData.fileUrl, savedData.fileName)}
                                  >
                                    Anteprima
                                  </Button>
                                )}

                                {/* Pulsante Anteprima DWG */}
                                {savedData.fileName.toLowerCase().endsWith(".dwg") && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="text-secondary p-0 ms-2"
                                    /* onClick={() => openDwgPreview(savedData.fileUrl, savedData.fileName)} */
                                  >
                                    Anteprima
                                  </Button>
                                )}
                              </>
                            ) : (
                              <small className="text-success text-decoration-none">{savedData.fileName}</small>
                            )}
                          </div>
                        )}

                        {/* Button with fixed text "Carica file" */}
                        <Form.Label className="botton-file btn btn-sm">
                          Carica file
                          <Form.Control
                            type="file"
                            accept={step.accept}
                            onChange={(e) => {
                              const chosen = e.target.files?.[0];
                              if (chosen) handleFileUpload(idx, chosen);
                            }}
                            style={{ display: "none" }}
                          />
                        </Form.Label>
                      </div>
                    )}

                    {/* ------------ LINK ESTERNO ------------ */}
                    {step.type.includes("link") && (
                      <Button
                        size="sm"
                        className="btn-link-custom"
                        onClick={() => {
                          const urlToOpen = step.modalSrc || "https://sister.agenziaentrate.gov.it";
                          window.open(urlToOpen, "_blank");
                        }}
                      >
                        Accedi al catasto
                      </Button>
                    )}

                    {/* ------------ PULSANTE SALVA ------------ */}
                    {(step.type.includes("boolean") || step.type.includes("dropdown") || step.type.includes("textarea")) && (
                      <Button
                        size="sm"
                        className="btn-save-custom ms-auto"
                        onClick={() => handleSaveStep(idx)}
                        disabled={!localData[stepKey] || Object.keys(localData[stepKey]).length === 0}
                      >
                        Salva
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Modal per commentare (textarea) */}
      {activeModalStep && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Commenta</h5>
                <button type="button" className="btn-close" onClick={() => setActiveModalStep(null)} />
              </div>
              <div className="modal-body">
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={modalTextareaValue}
                  onChange={(e) => setModalTextareaValue(e.target.value)}
                  placeholder="Scrivi qui il tuo commento…"
                />
              </div>
              <div className="modal-footer">
                <Button
                  className="btn-save-custom"
                  onClick={() => {
                    handleFieldChange(activeModalStep, {
                      textareaValue: modalTextareaValue,
                    });
                    setActiveModalStep(null);
                  }}
                >
                  Salva
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal per anteprima PDF con Google Docs Viewer */}
      <Modal show={pdfPreview.show} onHide={closePdfPreview} size="xl" centered className="d-flex">
        <Modal.Header closeButton>
          <Modal.Title>Anteprima PDF: {pdfPreview.fileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "70vh", width: "100%" }}>
            <iframe
              title="pdf-preview"
              src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfPreview.url || "")}&embedded=true`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePdfPreview}>
            Chiudi
          </Button>
          <Button variant="primary" href={pdfPreview.url} download>
            <IoMdDownload className="me-1" /> Scarica
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskCard;
