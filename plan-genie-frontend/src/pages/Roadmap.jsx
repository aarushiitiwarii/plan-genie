import React, { useState } from "react";
import styles from "./roadmap.module.css";
import WishbotChat from "../components/WishbotChat";
import botImg from "../assets/bot.png";

// Helper to get week ranges
function getWeekRanges(startDate, weeks) {
  const ranges = [];
  let current = new Date(startDate);
  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6);
    ranges.push({
      week: i + 1,
      start: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      end: weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    });
    current.setDate(current.getDate() + 7);
  }
  return ranges;
}

export default function Roadmap() {
  // Read from localStorage (or context)
  const weeks = Number(localStorage.getItem("roadmapWeeks")) || 4;
  const tasks = JSON.parse(localStorage.getItem("roadmapTasks")) || [[]];
  const startDate = new Date(); // Or read from localStorage if you store it

  const weekRanges = getWeekRanges(startDate, weeks);
  const [showWishbot, setShowWishbot] = useState(false);

  return (
    <div className={styles.roadmapContainer}>
      <h1 className={styles.heading}>Your Personalised Roadmap</h1>
      <p className={styles.subheading}>
        Based on your input, here’s your week-by-week skill development plan.
      </p>
      <div className={styles.weeksGrid}>
        {weekRanges.map((range, idx) => (
          <div className={styles.weekCard} key={range.week}>
            <div className={styles.weekHeader}>
              <span>Week {range.week}</span>
              <br />
              <span>
                ({range.start} - {range.end})
              </span>
            </div>
            <div className={styles.tasksList}>
              {tasks[idx] && tasks[idx].length > 0 ? (
                tasks[idx].map((task, tIdx) => (
                  <div className={styles.taskItem} key={tIdx}>
                    <span className={styles.taskDot}>■</span>
                    <span className={styles.taskText}>{task}</span>
                  </div>
                ))
              ) : (
                <div className={styles.taskItem}>No tasks assigned</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className={styles.wishbotRight}
        onClick={() => setShowWishbot((prev) => !prev)}
        title="Wishbot"
      >
        <img
          src={botImg}
          alt="Wishbot"
          className={styles.wishbotImg}
        />
        <span className={styles.wishbotLabel}>Wishbot</span>
      </div>

      {showWishbot && (
        <div className={styles.wishbotPopupRight}>
          <div className={styles.wishbotHeader}>
            <span>Wishbot</span>
            <button onClick={() => setShowWishbot(false)}>X</button>
          </div>
          <WishbotChat />
        </div>
      )}
    </div>
  );
}