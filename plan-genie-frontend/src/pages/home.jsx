import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import genieImg from "../assets/genie.png";
import logoImg from "../assets/logo.png";
import profileIcon from "../assets/profile.png"; // 👈 make sure you have a profile icon in assets
import Sparkles from "../components/Sparkles.jsx";
import AuthModal from "../components/AuthModal";

export default function Home() {
  const [showSparkles, setShowSparkles] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false); // NEW
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setIsLoggedIn(true);
  }, []);

  const handleGenieClick = () => {
    setShowSparkles(true);
  };

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }
    navigate("/input");
  };

  const handleLoginClick = () => {
    setShowModal(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  };

  return (
    <div className={styles.container}>
      {(showSparkles || showLoginRequired) && (
        <div className={styles.overlay}></div>
      )}
      {showSparkles && (
        <Sparkles trigger={showSparkles} onEnd={() => setShowSparkles(false)} />
      )}
      {showModal && (
        <AuthModal onClose={() => setShowModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
      {showLoginRequired && (
        <div className={styles.loginRequiredModal}>
          <h2>Login Required</h2>
          <p>You need to log in or sign up to get started!</p>
          <div className={styles.loginRequiredActions}>
            <button className={styles.loginRequiredBtn} onClick={() => { setShowLoginRequired(false); setShowModal(true); }}>
              Login / Signup
            </button>
            <button className={styles.loginRequiredBtnSecondary} onClick={() => setShowLoginRequired(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <img src={logoImg} alt="PlanGenie Logo" className={styles.logo} />
          <span className={styles.brand}>PlanGenie</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#meet" className={styles.link}>Meet PlanGenie</a>
          <a href="#samples" className={styles.link}>Sample Planners</a>

          {isLoggedIn ? (
            <img
              src={profileIcon}
              alt="Profile"
              className={styles.profileIcon}
              onClick={handleLogout}
              title="Logout"
              style={{ cursor: "pointer", width: "32px", height: "32px", borderRadius: "50%" }}
            />
          ) : (
            <button className={styles.loginBtn} onClick={handleLoginClick}>
              Login/Signup
            </button>
          )}
        </div>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.textSection}>
          <h1 className={styles.heading}>
            Personalised Learning,<br />Just A Wish Away!
          </h1>
          <p className={styles.subheading}>
            Curating Personalised Learning Roadmaps<br />
            based on your goals and availability.
          </p>
          <button className={styles.getStartedBtn} onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
        <div className={styles.genieSection}>
          <img
            src={genieImg}
            alt="Genie"
            className={styles.genieImg}
            style={{ cursor: "pointer" }}
            onClick={handleGenieClick}
          />
        </div>
      </main>
    </div>
  );
}
