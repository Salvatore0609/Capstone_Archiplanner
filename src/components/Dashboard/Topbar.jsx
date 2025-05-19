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
  const activeUser = useSelector((state) => state.loginGoogle.user || state.loginNormal.user);
  const getAvatarUrl = () => activeUser?.avatar;
  const avatarUrl = getAvatarUrl();

  const handleLogout = () => {
    dispatch(logoutNormal());
    dispatch(logoutGoogle());
    removeToken();
    clearUserData();
    navigate("/");
  };

  return (
    <div className="topbar d-flex justify-content-center align-items-center px-3 py-3">
      <InputGroup className="search-bar w-50 ms-auto me-auto">
        <InputGroup.Text className="border border-0 bg-transparent">
          <FaSearch size={20} color="#C69B7B" />
        </InputGroup.Text>
        <FormControl type="text" placeholder="Cerca un progetto..." />
      </InputGroup>

      <div className="user-info d-flex align-items-center">
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
                  e.target.onerror = null; // Importante per prevenire loop
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
