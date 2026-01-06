import "./Menu.css";

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  const [cookies, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  useEffect(() => {
    axios
      .post("https://zerodhaclone-1-y2ot.onrender.com/auth", {}, { withCredentials: true })
      .then((res) => {
        setUsername(res.data.user || "User");
        setJoinedDate(res.data.createdAt || new Date());
      })
      .catch(() => setUsername("User"));
  }, []);

  useEffect(() => {
    axios
      .post("http://localhost:3002/auth", {}, { withCredentials: true })
      .then((res) => setUsername(res.data.user || "User"))
      .catch(() => setUsername("User"));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    window.location.href = "http://localhost:3000";
  };

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="logo" />

      <div className="menus">
        <ul>
          <li>
            <Link to="/" onClick={() => setSelectedMenu(0)}>
              <p className={selectedMenu === 0 ? "menu selected" : "menu"}>
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link to="/orders" onClick={() => setSelectedMenu(1)}>
              <p className={selectedMenu === 1 ? "menu selected" : "menu"}>
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link to="/holdings" onClick={() => setSelectedMenu(2)}>
              <p className={selectedMenu === 2 ? "menu selected" : "menu"}>
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link to="/positions" onClick={() => setSelectedMenu(3)}>
              <p className={selectedMenu === 3 ? "menu selected" : "menu"}>
                Positions
              </p>
            </Link>
          </li>

          <li>
            <Link to="/funds" onClick={() => setSelectedMenu(4)}>
              <p className={selectedMenu === 4 ? "menu selected" : "menu"}>
                Funds
              </p>
            </Link>
          </li>
        </ul>

        <hr />

        {/* USER PROFILE */}
        {/* PROFILE */}
        <div
          className="profile"
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          ref={dropdownRef}
        >
          <div className="avatar">{username[0]?.toUpperCase()}</div>
          <p className="username">{username.toUpperCase()}</p>

          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <p>
                <strong>Signed in as</strong>
              </p>

              <div className="info-row">
                <span className="label">Username</span>
                <span className="value">{username}</span>
              </div>

              <div className="info-row">
                <span className="label">Member since</span>
                <span className="value">
                  {new Date(joinedDate).toLocaleDateString()}
                </span>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Menu;
