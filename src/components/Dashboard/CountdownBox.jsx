import { Card, Col } from "react-bootstrap";
import { FiCoffee } from "react-icons/fi";

const CountdownBox = () => {
  return (
    <Card className="countdown-box mb-4">
      <Card.Body>
        <Card.Title className="countdown-label mb-5" color="#C69B7B">
          <Col md={12} className="d-flex align-items-center">
            <FiCoffee size={25} color="#C69B7B" className="me-auto" />
            <p className="m-0 me-auto ps-2">Tra … ORA DEL CAFFÈ!</p>
          </Col>
        </Card.Title>
        <div className="countdown-timer text-center">
          <span className="time-segment">10</span>
          <span className="time-separator mx-1">:</span>
          <span className="time-segment">30</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CountdownBox;
