import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import genieImg from "../assets/genie.png";
import Sparkles from "../components/Sparkles.jsx";
import AuthModal from "../components/AuthModal";
import botImg from "../assets/bot.png";
import WishbotChat from "../components/WishbotChat";

export default function Home({ showLogin, setShowLogin }) {
  const [showSparkles, setShowSparkles] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(null);
  const [showWishbot, setShowWishbot] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setIsLoggedIn(true);
  }, []);

  const handleGenieClick = () => setShowSparkles(true);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    navigate("/input");
  };

  return (
    <div className={styles.container}>
      {(showSparkles || showLogin) && <div className={styles.overlay}></div>}

      {showSparkles && (
        <Sparkles
          trigger={showSparkles}
          onEnd={() => setShowSparkles(false)}
        />
      )}

      {showLogin && (
        <AuthModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
        />
      )}

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

      {/* Meet PlanGenie Section */}
      <section id="meet-plangenie" className={styles.meetGenieSection}>
        <div className={styles.meetGenieContent}>
          <img src={genieImg} alt="Genie" className={styles.genieImg} />
          <div className={styles.meetGenieIntro}>
            <h2>Meet PlanGenie</h2>
            <p>
              PlanGenie is your personal AI learning assistant, designed to create customized skill development roadmaps just for you. Whether you're exploring a new domain or leveling up your current skills, PlanGenie analyzes your goals, experience level, and availability to generate a structured weekly plan with curated resources. Stay focused, track your progress, and grow smarter—one week at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Sample Planners Section */}
      <section id="samples" className={styles.section}>
        <h3>📝 Sample Planners</h3>
        <div className={styles.planRow}>
          <div className={styles.weekBox} onClick={() => setSampleOpen(0)}>
            <h3>Web Development</h3>
            
          </div>
          <div className={styles.weekBox} onClick={() => setSampleOpen(1)}>
            <h3>Data Science</h3>
           
          </div>
          <div className={styles.weekBox} onClick={() => setSampleOpen(2)}>
            <h3>UI/UX Design</h3>
            
          </div>
        </div>

        {sampleOpen === 0 && (
          <div className={styles.modalOverlay} onClick={() => setSampleOpen(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h3>Web Development Roadmap</h3>
              <p><strong>Week 1:</strong> HTML & CSS basics</p>
              <p><strong>Week 2:</strong> JavaScript fundamentals</p>
              <p><strong>Week 3:</strong> Responsive design</p>
              <p><strong>Week 4:</strong> React basics</p>
              <button className={styles.backBtn} onClick={() => setSampleOpen(null)}>Close</button>
            </div>
          </div>
        )}

        {sampleOpen === 1 && (
          <div className={styles.modalOverlay} onClick={() => setSampleOpen(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h3>Data Science Starter</h3>
              <p><strong>Week 1:</strong> Python basics</p>
              <p><strong>Week 2:</strong> Numpy & Pandas</p>
              <p><strong>Week 3:</strong> Data visualization</p>
              <p><strong>Week 4:</strong> Intro to Machine Learning</p>
              <button className={styles.backBtn} onClick={() => setSampleOpen(null)}>Close</button>
            </div>
          </div>
        )}

        {sampleOpen === 2 && (
          <div className={styles.modalOverlay} onClick={() => setSampleOpen(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h3>UI/UX Design Journey</h3>
              <p><strong>Week 1:</strong> Design principles</p>
              <p><strong>Week 2:</strong> Wireframing</p>
              <p><strong>Week 3:</strong> Prototyping tools</p>
              <p><strong>Week 4:</strong> User testing</p>
              <button className={styles.backBtn} onClick={() => setSampleOpen(null)}>Close</button>
            </div>
          </div>
        )}
      </section>

      {/* Wishbot Chat Icon */}
      <div
        className={styles.wishbot}
        onClick={() => setShowWishbot((prev) => !prev)}
        title="Wishbot"
      >
        <img src={botImg} alt="Wishbot" className={styles.wishbotImg} />
        <span className={styles.wishbotLabel}>Wishbot</span>
      </div>

      {showWishbot && (
        <div className={styles.wishbotPopup}>
          <div className={styles.wishbotHeader}>
            <span>Wishbot</span>
            <button onClick={() => setShowWishbot(false)}>X</button>
          </div>
          <WishbotChat />
        </div>
      )}

      {/* Floating Sparkles */}
      {Array.from({ length: 6 }).map((_, i) => {
        const size = Math.random() * 10 + 6;
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