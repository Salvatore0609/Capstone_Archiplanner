import { Dropdown, FormControl, InputGroup } from "react-bootstrap";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUserData, removeToken } from "../../redux/utils/authUtils";
import { logoutGoogle, logoutNormal } from "../../redux/action/LoginActions";
import { useState } from "react";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localAvatarError, setLocalAvatarError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const activeUser = useSelector((state) => state.loginGoogle.user || state.loginNormal.user);
  const projects = useSelector((state) => state.projects?.items || []);

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
            <FaSearch size={20} color="#C69B7B" />
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

      <div className="user-info d-flex align-items-center ms-3">
        <IoMdNotificationsOutline size={30} color="#C69B7B" />
        <Dropdown>
          <Dropdown.Toggle variant="link" id="user-dropdown-toggle" className="text-decoration-none">
            {localAvatarError || !avatarUrl ? (
              <FaRegUserCircle size={30} className="text-secondary" />
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
                  border: "2px solid #C69B7B",
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
