import { Badge, Dropdown, /* Form, */ FormControl, InputGroup, Spinner } from "react-bootstrap";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUserData, removeToken } from "../../redux/utils/authUtils";
import { logoutGoogle, logoutNormal } from "../../redux/action/LoginActions";
import { useEffect, useState } from "react";
import { fetchNotifications, fetchUnreadNotificationsCount, markNotificationAsRead } from "../../redux/action/NotificationActions";
import ThemeToggle from "../commons/ThemeToogle";
/* import { useDarkMode } from "../commons/useDarkMode";
import { MdLightMode, MdOutlineDarkMode } from "react-icons/md"; */

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* const [mode, toggleMode] = useDarkMode(); */
  const [localAvatarError, setLocalAvatarError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const activeUser = useSelector((state) => state.loginGoogle.user || state.loginNormal.user);
  const projects = useSelector((state) => state.projects?.items || []);

  /* notifiche */
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = useSelector((state) => state.notifications.all || []);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const loadingNotifications = useSelector((state) => state.notifications.loading);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadNotificationsCount());
  }, [dispatch]);

  const interval = setInterval(() => {
    dispatch(fetchUnreadNotificationsCount());
    /* fallo solo una volta */
    clearInterval(interval);
  }, 60000);

  /* notifiche */
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleNotificationClick = (notifId) => {
    dispatch(markNotificationAsRead(notifId));
    clearInterval(interval); // fermo il conteggio automatico
    setShowNotifications(false);
  };

  const avatarUrl = activeUser?.avatar;

  const handleLogout = () => {
    dispatch(logoutNormal());
    dispatch(logoutGoogle());
    removeToken();
    clearUserData();
    navigate("/");
  };

  const filteredSuggestions = projects.filter((project) => project.nomeProgetto?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectProject = (projectId) => {
    setSearchTerm("");
    setShowSuggestions(false);
    navigate(`/project/${projectId}`);
  };

  const handleSearch = () => {
    const first = filteredSuggestions[0];
    if (first) {
      handleSelectProject(first.id);
    } else {
      alert("Nessun progetto trovato.");
    }
  };

  return (
    <div className="topbar ">
      <div className="w-50 ms-auto me-auto">
        <InputGroup className="search-bar">
          <InputGroup.Text className="border border-0 bg-transparent" role="button" onClick={handleSearch}>
            <FaSearch size={20} color="var(--primary)" />
          </InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Cerca un progetto..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 150); // tempo per permettere il click
            }}
            onFocus={() => {
              if (searchTerm.length > 0) setShowSuggestions(true);
            }}
          />
        </InputGroup>

        {showSuggestions && (
          <div className="dropdown-search">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((proj) => (
                <div key={proj.id} role="button" onMouseDown={() => handleSelectProject(proj.id)} className="p-2">
                  <p>{proj.nomeProgetto}</p>
                </div>
              ))
            ) : (
              <div className="p-2 text-muted">Nessun progetto trovato</div>
            )}
          </div>
        )}
      </div>

      <ThemeToggle />

      <div className="user-info d-flex align-items-center ms-3 position-relative">
        {/* Icona campanella con badge */}
        <div className="position-relative me-3" style={{ cursor: "pointer" }} onClick={toggleNotifications}>
          <IoMdNotificationsOutline size={30} className="icon-color" />
          {unreadCount > 0 && (
            <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle text-white">
              {unreadCount}
            </Badge>
          )}
        </div>
        {/* Dropdown notifiche */}
        {showNotifications && (
          <div
            className="position-absolute bg-white border rounded"
            style={{
              zIndex: 1000,
              right: 0,
              top: "40px",
              width: "300px",
              backgroundColor: "var(--neutral-gray)",
              overflow: "auto",
            }}
          >
            <div className="p-2 border-bottom d-flex justify-content-between align-items-center">
              <strong>Notifiche</strong>
              {loadingNotifications && <Spinner animation="border" size="sm" />}
            </div>

            {notifications.length === 0 && !loadingNotifications && <div className="p-2 text-center text-muted">Nessuna notifica</div>}

            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-2 d-flex justify-content-between align-items-start ${!notif.isRead ? "bg-light" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNotificationClick(notif.id)}
                >
                  <div style={{ flex: 1 }}>
                    <small className="d-block text-muted">
                      {new Date(notif.createdAt).toLocaleString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                    <span>{notif.message}</span>
                  </div>
                  {!notif.isRead && <Badge bg="primary" pill style={{ height: 12, width: 12, marginLeft: 8 }} />}
                </div>
              ))}
            </div>
          </div>
        )}
        {/*  */}
        <Dropdown>
          <Dropdown.Toggle variant="link" id="user-dropdown-toggle" className="text-decoration-none">
            {localAvatarError || !avatarUrl ? (
              <FaRegUserCircle size={30} />
            ) : (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="avatar-image"
                onError={(e) => {
                  setLocalAvatarError(true);
                  e.target.onerror = null;
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid var(--primary)",
                }}
              />
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu align="end">
            <Dropdown.Item as={Link} to="/profile-details">
              Profilo
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Esci</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Topbar;
