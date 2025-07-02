import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../pages/home.module.css";
import logoImg from "../assets/logo.png";
import profileIcon from "../assets/profile.png";

export default function NavBar({ onMeetClick, showLoginModal }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("userId");

  const handleProfileMenuOption = (option) => {
    setShowProfileMenu(false);
    if (option === "signout") {
      localStorage.removeItem("userId");
      navigate("/");
      window.location.reload();
    } else if (option === "profile") {
      navigate("/profile");
    } else if (option === "history") {
      navigate("/history");
    } else if (option === "help") {
      navigate("/help");
    } else if (option === "manage") {
      navigate("/manage");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection} onClick={() => navigate("/")}>
        <img src={logoImg} alt="PlanGenie Logo" className={styles.logo} />
        <span className={styles.brand}>PlanGenie</span>
      </div>

      <div className={styles.navLinks}>
        <a href="#meet-plangenie" className={styles.link} onClick={onMeetClick}>
          Meet PlanGenie
        </a>
        <a href="#samples" className={styles.link}>
          Sample Planners
        </a>

        {isLoggedIn ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={profileIcon}
              alt="Profile"
              className={styles.profileIcon}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title="Profile"
              style={{
                cursor: "pointer",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
              }}
            />
            {showProfileMenu && (
              <div className={styles.profileMenu}>
                <button onClick={() => handleProfileMenuOption("profile")}>Profile</button>
                <button onClick={() => handleProfileMenuOption("history")}>History</button>
                <button onClick={() => handleProfileMenuOption("manage")}>Manage Tasks</button>
                <button onClick={() => handleProfileMenuOption("help")}>Help</button>
                <button onClick={() => handleProfileMenuOption("signout")}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.loginBtn} onClick={showLoginModal}>
            Login / Signup
          </button>
        )}
      </div>
    </nav>
  );
}

// Add a helper style for page padding
// Usage: add className={styles.pageContent} to the main content wrapper in each page
