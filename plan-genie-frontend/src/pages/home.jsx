import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import genieImg from "../assets/genie.png";
import logoImg from "../assets/logo.png";
import profileIcon from "../assets/profile.png";
import Sparkles from "../components/Sparkles.jsx";
import AuthModal from "../components/AuthModal";
import botImg from "../assets/bot.png"; // Import your new genie image
import WishbotChat from "../components/WishbotChat"; // Add this import

export default function Home() {
  const [showSparkles, setShowSparkles] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // NEW
  const [showWishbot, setShowWishbot] = useState(false); // Add state for chatbot (optional, for popup/modal)
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

  const handleProfileIconClick = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleProfileMenuOption = (option) => {
    setShowProfileMenu(false);
    if (option === "signout") {
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
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
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={profileIcon}
                alt="Profile"
                className={styles.profileIcon}
                onClick={handleProfileIconClick}
                title="Profile"
                style={{ cursor: "pointer", width: "32px", height: "32px", borderRadius: "50%" }}
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

      {/* Wishbot Chatbot Icon */}
      <div
        className={styles.wishbot}
        onClick={() => setShowWishbot((prev) => !prev)}
        title="Wishbot"
      >
        <img
          src={botImg} // Use the new genie image here
          alt="Wishbot"
          className={styles.wishbotImg}
        />
        <span className={styles.wishbotLabel}>Wishbot</span>
      </div>

      {/* Example: Wishbot popup/modal (optional) */}
      {showWishbot && (
        <div className={styles.wishbotPopup}>
          <div className={styles.wishbotHeader}>
            <span>Wishbot</span>
            <button onClick={() => setShowWishbot(false)}>X</button>
          </div>
          <WishbotChat />
        </div>
      )}

      {/* Magical floating sparkles */}
      {Array.from({ length: 6 }).map((_, i) => {
        const size = Math.random() * 10 + 6; // Same value for width and height
        return (
          <div
            key={i}
            className={styles.magicSparkle}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-${Math.random() * 20 + 5}vh`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.45,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${7 + Math.random() * 4}s`
            }}
          />
        );
      })}
    </div>
  );
}
