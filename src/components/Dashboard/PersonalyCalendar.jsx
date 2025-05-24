import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Card, Button, Modal, Form, Row, Col, Container } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import itLocale from "@fullcalendar/core/locales/it";
import { useDispatch, useSelector } from "react-redux";
import { addCalendarEvent, deleteCalendarEvent, fetchCalendarEvents, updateCalendarEvent } from "../../redux/action/calendarActions";

const PersonalyCalendar = ({ refreshKey }) => {
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.calendar.events || []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    dispatch(fetchCalendarEvents());
    if (calendarRef.current) calendarRef.current.getApi().updateSize();
    setCurrentDate(new Date());
  }, [dispatch, refreshKey]);

  const openModal = useCallback((data) => setModalData(data), []);
  const closeModal = useCallback(() => setModalData(null), []);

  const handleFixedSlot = (dateStr) => {
    const date = new Date(dateStr);
    const time = format(date, "HH:mm");
    openModal({
      title: "",
      description: "",
      date,
      startTime: time,
      endTime: format(addHours(date, 1), "HH:mm"),
      isFixedTime: true,
    });
  };

  const handleFreeSlot = () => {
    const today = new Date();
    openModal({
      title: "",
      description: "",
      date: today,
      startTime: "08:00",
      endTime: "09:00",
      isFixedTime: false,
    });
  };

  const handleSlot = ({ dateStr, isFixed }) => {
    if (isFixed) {
      handleFixedSlot(dateStr);
    } else {
      handleFreeSlot();
    }
  };

  const handleDateClick = (info) => handleSlot({ dateStr: info.dateStr, isFixed: true });
  const handleFreeTime = () => handleSlot({ dateStr: new Date().toISOString(), isFixed: false });

  const validateAppointment = () => {
    if (!modalData.startTime || !modalData.endTime || new Date(modalData.date) <= new Date()) {
      alert("Inserisci una data e ora valide.");
      return false;
    }
    return true;
  };

  const saveAppointment = () => {
    if (!validateAppointment()) return;

    if (modalData.id) {
      dispatch(updateCalendarEvent(modalData.id, modalData));
    } else {
      const startDateTime = `${format(modalData.date, "yyyy-MM-dd")}T${modalData.startTime}:00`;
      const endDateTime = `${format(modalData.date, "yyyy-MM-dd")}T${modalData.endTime}:00`;

      const appointmentToSave = {
        ...modalData,
        startTime: startDateTime,
        endTime: endDateTime,
      };

      dispatch(addCalendarEvent(appointmentToSave));
    }
    closeModal();
  };

  const deleteAppointment = () => {
    dispatch(deleteCalendarEvent(modalData.id));
    closeModal();
  };

  const events = useMemo(() => {
    return appointments
      .map((apt) => {
        if (apt.startTime && apt.endTime) {
          return {
            id: apt.id,
            title: apt.title,
            description: apt.description || "",
            start: apt.startTime,
            end: apt.endTime,
          };
        } else {
          console.error("Dati dell'appuntamento mancanti o malformati:", apt);
          return null;
        }
      })
      .filter((event) => event !== null);
  }, [appointments]);

  const handleOpenModalToUptDlt = (info) => {
    const appointment = appointments.find((a) => String(a.id) === info.event.id);
    if (!appointment) {
      console.error("Appuntamento non trovato per l'ID:", info.event.id);
      return;
    }

    openModal({
      ...appointment,
      date: new Date(appointment.startTime),
      isFixedTime: false,
    });
  };

  const renderModal = () => {
    const { title = "", startTime = "", endTime = "", description = "", date = new Date(), isFixedTime = false } = modalData || {};

    return (
      <Modal show={!!modalData} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalData ? "Modifica Appuntamento" : "Nuovo Appuntamento"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={format(date, "yyyy-MM-dd")}
                onChange={(e) => setModalData((prev) => ({ ...prev, date: parseISO(e.target.value) }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control value={title} onChange={(e) => setModalData((prev) => ({ ...prev, title: e.target.value }))} />
            </Form.Group>
            <Row className="mb-3">
              <Col>
                <Form.Label>Ora inizio</Form.Label>
                <Form.Control
                  type="time"
                  value={startTime}
                  onChange={(e) => setModalData((prev) => ({ ...prev, startTime: e.target.value }))}
                  disabled={isFixedTime}
                />
              </Col>
              <Col>
                <Form.Label>Ora fine</Form.Label>
                <Form.Control
                  type="time"
                  value={endTime}
                  onChange={(e) => setModalData((prev) => ({ ...prev, endTime: e.target.value }))}
                  disabled={isFixedTime}
                />
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setModalData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {modalData && (
            <Button style={{ backgroundColor: "#C67B7B", border: "none" }} onClick={deleteAppointment}>
              Elimina
            </Button>
          )}
          <Button style={{ backgroundColor: "#7BC682", border: "none" }} onClick={saveAppointment}>
            Salva Appuntamento
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Container fluid>
      <Card className="bg-transparent glass-card">
        <Card.Body className="bg-transparent">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button style={{ backgroundColor: "#C69B7B", border: "none" }} onClick={() => setCurrentDate((d) => subDays(d, 2))}>
              <FaArrowLeft className="d-flex" />
            </Button>
            <h5 className="text-center w-100" style={{ color: "#555" }}>
              {format(currentDate, "EEE dd/MM", { itLocale })} - {format(addDays(currentDate, 1), "EEE dd/MM yyyy", { itLocale })}
            </h5>
            <Button style={{ backgroundColor: "#C69B7B", border: "none" }} onClick={() => setCurrentDate((d) => addDays(d, 2))}>
              <FaArrowRight className="d-flex" />
            </Button>
          </div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridTwoDay"
            views={{ timeGridTwoDay: { type: "timeGrid", duration: { days: 2 } } }}
            locale={itLocale}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            slotDuration="01:00:00"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleOpenModalToUptDlt}
            headerToolbar={false}
            initialDate={currentDate}
            height="auto"
          />
        </Card.Body>
      </Card>
      <Button className="button-plus rounded-circle position-fixed" onClick={handleFreeTime}>
        <FaPlus />
      </Button>
      {renderModal()}
    </Container>
  );
};

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function subDays(date, days) {
  return addDays(date, -days);
}

function addHours(date, hours) {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

export default PersonalyCalendar;
