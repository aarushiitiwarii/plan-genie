import React, { useState } from "react";
import styles from "./input.module.css";
import logoImg from "../assets/logo.png";
import genieImg from "../assets/genie.png";
import { createGoal } from "../api"; // ✅ import the backend API function

export default function InputPage() {
  const [domain, setDomain] = useState("Software Engineering");
  const [course, setCourse] = useState("Web Development");
  const [weeks, setWeeks] = useState("8 Weeks");
  const [learning, setLearning] = useState("Master the basics");

  // ✅ ADD THIS FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    const goalData = { domain, course, weeks, learning };

    try {
      const res = await createGoal(goalData);
      console.log("✅ Goal saved:", res.data);
      // alert("Goal saved!");
    } catch (error) {
      console.error("❌ Failed to save goal:", error);
      // alert("Failed to save goal");
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <img src={logoImg} alt="PlanGenie Logo" className={styles.logo} />
          <span className={styles.brand}>PlanGenie</span>
        </div>
      </nav>
      <main className={styles.mainContent}>
        <form className={styles.form} onSubmit={handleSubmit}> {/* ✅ updated */}
          <label className={styles.label}>Choose Your Domain</label>
          <select
            className={styles.select}
            value={domain}
            onChange={e => setDomain(e.target.value)}
          >
            <option>Software Engineering</option>
            <option>Hardware Engineering</option>
          </select>

          <label className={styles.label}>Select Course</label>
          <select
            className={styles.select}
            value={course}
            onChange={e => setCourse(e.target.value)}
          >
            <option>Web Development</option>
            <option>React</option>
            <option>DSA</option>
          </select>

          <label className={styles.label}>Time Commitment</label>
          <input
            className={styles.input}
            type="text"
            value={weeks}
            onChange={e => setWeeks(e.target.value)}
          />

          <label className={styles.label}>How do you prefer to learn</label>
          <div className={styles.cardGroup}>
            <div
              className={`${styles.card} ${learning === "Master the basics" ? styles.selected : ""}`}
              onClick={() => setLearning("Master the basics")}
            >
              <span className={styles.radio}></span>
              Master the basics
            </div>
            <div
              className={`${styles.card} ${learning === "Project-Based Learning" ? styles.selected : ""}`}
              onClick={() => setLearning("Project-Based Learning")}
            >
              <span className={styles.radio}></span>
              Project-Based Learning
            </div>
            <div
              className={`${styles.card} ${learning === "Exam Preparation" ? styles.selected : ""}`}
              onClick={() => setLearning("Exam Preparation")}
            >
              <span className={styles.radio}></span>
              Exam Preparation
            </div>
          </div>

          <button className={styles.generateBtn}>Generate Roadmap</button>
        </form>

        <div className={styles.genieSection}>
          <img src={genieImg} alt="Genie" className={styles.genieImg} />
        </div>
      </main>
    </div>
  );
}
