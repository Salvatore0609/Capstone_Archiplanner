import { Card, Col } from "react-bootstrap";
import { FiCoffee } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";

const CountdownBox = () => {
  const [nextBreak, setNextBreak] = useState(getTimeUntilNextCoffee());
  const notifiedRef = useRef(false); // Per evitare alert multipli nello stesso secondo

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedBreak = getTimeUntilNextCoffee();
      setNextBreak(updatedBreak);

      // Se mancano esattamente 0 ore, 0 minuti, 0 secondi, e non abbiamo ancora notificato
      if (updatedBreak.hours === "00" && updatedBreak.minutes === "00" && updatedBreak.seconds === "00" && !notifiedRef.current) {
        notifiedRef.current = true;
        alert("☕ Ora della caffeina!");
        // Dopo l'alert, resettiamo il flag dopo 5 secondi per il prossimo orario
        setTimeout(() => {
          notifiedRef.current = false;
        }, 5000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calcola il tempo rimanente fino al prossimo caffè
  function getTimeUntilNextCoffee() {
    const now = new Date();
    const coffeeTimes = ["09:00", "11:00", "15:00", "17:00"];
    let nextCoffee = null;

    // Trova il prossimo orario futuro oggi
    for (let time of coffeeTimes) {
      const [hour, minute] = time.split(":");
      const target = new Date(now);
      target.setHours(parseInt(hour), parseInt(minute), 0, 0);
      if (target > now) {
        nextCoffee = target;
        break;
      }
    }

    // Se tutti gli orari sono passati, prendi il primo orario di domani
    if (!nextCoffee) {
      const [hour, minute] = coffeeTimes[0].split(":");
      nextCoffee = new Date(now);
      nextCoffee.setDate(now.getDate() + 1);
      nextCoffee.setHours(parseInt(hour), parseInt(minute), 0, 0);
    }

    // Calcola la differenza in millisecondi
    const diff = nextCoffee - now;

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    //"2-digit" è un formato specificato per l'opzione toLocaleTimeString in JavaScript.
    // Serve per indicare che l'ora o il minuto devono essere mostrati sempre con due cifre,
    // anche quando il valore è inferiore a 10.
    return {
      hours,
      minutes,
      seconds,
      targetTime: nextCoffee.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }

  return (
    <Card className="countdown-box h-100">
      <Card.Body>
        <Card.Title className="countdown-label">
          <Col md={12} className="d-flex align-items-center" style={{ paddingBottom: "1em" }}>
            <p className="m-0 fs-6 fw-bold" style={{ color: "#C69B7B" }}>
              Prossimo caffè alle {nextBreak.targetTime}
            </p>
            <FiCoffee size={25} color="#C69B7B" className="ms-auto" />
          </Col>
        </Card.Title>

        <div className="countdown-timer text-center fs-3 fw-bold">
          <span className="time-segment">{nextBreak.hours}</span>
          <span className="time-separator mx-1">:</span>
          <span className="time-segment">{nextBreak.minutes}</span>
          <span className="time-separator mx-1">:</span>
          <span className="time-segment">{nextBreak.seconds}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CountdownBox;
