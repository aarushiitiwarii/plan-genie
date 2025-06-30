import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./input.module.css";
import logoImg from "../assets/logo.png";
import genieImg from "../assets/genie.png";
import { createGoal } from "../api";

const COURSE_OPTIONS = {
  "Software Engineering": [
    "Web Development",
    "React",
    "DSA",
    "Backend Development",
    "DevOps",
    "Mobile App Development",
    "Machine Learning",
    "System Design"
  ],
  "Hardware Engineering": [
    "Embedded Systems",
    "VLSI Design",
    "Microcontrollers",
    "FPGA Programming",
    "PCB Design",
    "IoT",
    "Digital Signal Processing"
  ]
};

function parseWeeks(input) {
  if (!input) return 0;
  const match = input.trim().toLowerCase().match(/(\d+)\s*(week|weeks|month|months)/);
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  if (unit.startsWith("month")) {
    return value * 4;
  }
  return value;
}

export default function InputPage() {
  const [domain, setDomain] = useState(""); // default empty
  const [course, setCourse] = useState(""); // default empty
  const [weeks, setWeeks] = useState(""); // default empty
  const [learning, setLearning] = useState(""); // default empty
  const navigate = useNavigate();

  const handleDomainChange = (e) => {
    setDomain(e.target.value);
    setCourse(""); // Reset course when domain changes
  };

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

  const handleGenerateRoadmap = () => {
    const computedWeeks = parseWeeks(weeks);
    if (!computedWeeks) {
      alert("Please enter time commitment as 'X weeks' or 'Y months'.");
      return;
    }
    localStorage.setItem("roadmapWeeks", computedWeeks);
    navigate("/roadmap");
  };

  const isFormComplete = domain && course && weeks && learning;

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <img src={logoImg} alt="PlanGenie Logo" className={styles.logo} />
          <span className={styles.brand}>PlanGenie</span>
        </div>
      </nav>
      <main className={styles.mainContent}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Choose Your Domain</label>
          <select
            className={styles.select}
            value={domain}
            onChange={handleDomainChange}
          >
            <option value="" disabled>Select Domain</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Hardware Engineering">Hardware Engineering</option>
          </select>

          <label className={styles.label}>Select Course</label>
          <select
            className={styles.select}
            value={course}
            onChange={e => setCourse(e.target.value)}
            disabled={!domain}
          >
            <option value="" disabled>
              {domain ? "Select Course" : "Select Domain First"}
            </option>
            {domain &&
              COURSE_OPTIONS[domain].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <label className={styles.label}>Time Commitment</label>
          <input
            className={styles.input}
            type="text"
            value={weeks}
            onChange={e => setWeeks(e.target.value)}
            placeholder="e.g. 8 weeks, 3 months, etc."
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

          <button
            className={styles.generateBtn}
            onClick={handleGenerateRoadmap}
            disabled={!isFormComplete}
            type="button"
          >
            Generate Roadmap
          </button>
        </form>

        <div className={styles.genieSection}>
          <img src={genieImg} alt="Genie" className={styles.genieImg} />
        </div>
      </main>
    </div>
  );
}
