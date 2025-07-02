import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./input.module.css";
import logoImg from "../assets/logo.png";
import profileIcon from "../assets/profile.png";

export default function Input() {
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [timePerWeek, setTimePerWeek] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [format, setFormat] = useState("");
  const [numWeeks, setNumWeeks] = useState(""); // ✅ number of weeks
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const parseRoadmapString = (roadmapStr) => {
    const weeks = [];
    const weekRegex =
      /Week (\d) \((.*?)\):\s+Goal: (.*?)\n([\s\S]*?)(?=Week \d|\nPaid resources|\nMotivational Tips|$)/g;

    let match;
    while ((match = weekRegex.exec(roadmapStr)) !== null) {
      const weekNumber = parseInt(match[1]);
      const dateRange = match[2];
      const goal = match[3];
      const details = match[4].trim();

      const task = {
        weekNumber,
        content: `${goal}\n\n${details}`,
        status: "pending",
        dueDate: new Date(dateRange.split(" - ")[1] + " 2025").toISOString().split("T")[0],
      };
      weeks.push(task);
    }

    return weeks;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const inputData = {
        goal,
        experience,
        timePerWeek,
        learningStyle,
        format,
        numWeeks,
      };

      // ✅ Save input for reuse (for "Generate Again")
      localStorage.setItem("planGenieInput", JSON.stringify(inputData));

      const response = await axios.post("http://localhost:5000/api/roadmaps/generate", inputData);

      console.log("✅ Got roadmap from backend:", response.data);
      const roadmapStr = response.data.roadmap;
      const parsedTasks = parseRoadmapString(roadmapStr);
      localStorage.setItem("planGenieTasks", JSON.stringify(parsedTasks));
      localStorage.setItem("roadmap", roadmapStr);

      navigate("/result", { state: { roadmap: roadmapStr } });
    } catch (err) {
      console.error("❌ Error generating roadmap:", err);
      alert("Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <img src={logoImg} alt="PlanGenie Logo" className={styles.logo} />
          <span className={styles.brand}>PlanGenie</span>
        </div>
        <div className={styles.navLinks}>
          <a href="/" className={styles.link}>Home</a>
          <img
            src={profileIcon}
            alt="Profile"
            className={styles.profileIcon}
            onClick={() => navigate("/profile")}
          />
        </div>
      </nav>

      <main className={styles.mainContent}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.label}>What's your learning goal?</div>
          <input
            className={styles.input}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Become a full-stack web developer"
          />

          <div className={styles.label}>Your experience level:</div>
          <select className={styles.select} value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className={styles.label}>How much time per week can you give?</div>
          <select className={styles.select} value={timePerWeek} onChange={(e) => setTimePerWeek(e.target.value)}>
            <option value="">Select</option>
            <option value="Less than 5 hours">Less than 5 hours</option>
            <option value="5–10 hours">5–10 hours</option>
            <option value="10–15 hours">10–15 hours</option>
            <option value="15+ hours">15+ hours</option>
          </select>

          <div className={styles.label}>Preferred learning style:</div>
          <select className={styles.select} value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)}>
            <option value="">Select</option>
            <option value="Video-based">Video-based</option>
            <option value="Reading articles">Reading articles</option>
            <option value="Hands-on projects">Hands-on projects</option>
            <option value="Mix of all">Mix of all</option>
          </select>

          <div className={styles.label}>Preferred format:</div>
          <select className={styles.select} value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="">Select</option>
            <option value="Free resources">Free resources</option>
            <option value="Paid courses">Paid courses</option>
            <option value="Mix of both">Mix of both</option>
          </select>

          <div className={styles.label}>How many weeks should your roadmap be?</div>
          <input
            className={styles.input}
            type="number"
            min="1"
            value={numWeeks}
            onChange={(e) => setNumWeeks(e.target.value)}
            placeholder="e.g. 6"
          />

          <button
            type="button"
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </form>
      </main>
    </div>
  );
}
