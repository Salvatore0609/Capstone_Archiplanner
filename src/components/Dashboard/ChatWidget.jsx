import { Card, ListGroup, Form, InputGroup, Button } from "react-bootstrap";
import { FaPaperPlane, FaRegUserCircle } from "react-icons/fa";
import { MdOutlineChatBubbleOutline } from "react-icons/md";

const messages = [
  { id: 1, user: "Alice", text: "Ciao! Come procede il progetto?", time: "09:15" },
  { id: 2, user: "Mario", text: "Tutto bene, sono quasi alla consegna finale.", time: "09:17" },
  { id: 3, user: "Alice", text: "Ottimo! Fammi sapere quando sei pronto per il demo.", time: "09:18" },
];

const ChatWidget = () => (
  <Card className="chat-widget mb-4">
    <Card.Header className="bg-transparent border-0">
      <div className="d-flex align-items-center gap-3">
        <div className="ms-auto">
          <FaRegUserCircle size={20} className="my-3 text-secondary" />
        </div>
        <div>
          <FaRegUserCircle size={20} className="my-3 text-secondary" />
        </div>
        <div>
          <FaRegUserCircle size={20} className="my-3 text-secondary" />
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="user-info-text">3</div>
          <MdOutlineChatBubbleOutline size={25} color="#C69B7B" />
        </div>
      </div>
    </Card.Header>

    <ListGroup variant="flush" className="chat-list">
      {messages.map((msg) => (
        <ListGroup.Item
          key={msg.id}
          className={`chat-message ${msg.user === "Mario" ? "own" : ""}`}
          style={{ border: "none", background: "transparent", padding: "0.1em 0" }}
        >
          {/* Nome utente fuori dalla pillola */}
          <div className="message-user">{msg.user}</div>

          {/* Pillola del testo */}
          <div className="message-content">{msg.text}</div>

          {/* Orario */}
          <div className="message-time">{msg.time}</div>
        </ListGroup.Item>
      ))}
    </ListGroup>

    <Card.Footer className="chat-input-wrapper">
      <Form>
        <InputGroup>
          <Form.Control placeholder="Scrivi un messaggio..." />
          <Button variant="" className="">
            <FaPaperPlane color="#C69B7B" />
          </Button>
        </InputGroup>
      </Form>
    </Card.Footer>
  </Card>
);

export default ChatWidget;
