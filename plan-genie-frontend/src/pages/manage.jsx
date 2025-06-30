import React, { useState, useEffect, useRef } from "react";
import styles from "./manage.module.css";
import logoImg from "../assets/logo.png";
import profileIcon from "../assets/profile.png"; // <-- Add this import
import confetti from "canvas-confetti";
import WishbotChat from "../components/WishbotChat";
import botImg from "../assets/bot.png";
import { useNavigate } from "react-router-dom"; // <-- Add this import

// Helper to get days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function PieChart({ completed, total }) {
  const percent = total === 0 ? 0 : (completed / total) * 100;
  const angle = (percent / 100) * 360;
  const r = 60, cx = 75, cy = 75;
  const x = cx + r * Math.cos((Math.PI / 180) * (angle - 90));
  const y = cy + r * Math.sin((Math.PI / 180) * (angle - 90));
  const largeArc = percent > 50 ? 1 : 0;
  const pathData =
    total === 0 || percent === 100
      ? ""
      : `M${cx},${cy - r} A${r},${r} 0 ${largeArc} 1 ${x},${y} L${cx},${cy} Z`;

  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx={cx} cy={cy} r={r} fill="#e0e0e0" />
      {total > 0 && percent === 100 && (
        <circle cx={cx} cy={cy} r={r} fill="#3d3dd6" />
      )}
      {total > 0 && percent > 0 && percent < 100 && (
        <path d={pathData} fill="#3d3dd6" />
      )}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#222" strokeWidth="1" />
    </svg>
  );
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Manage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    now.getMonth() === selectedMonth && now.getFullYear() === selectedYear
      ? now.getDate()
      : 1
  );
  const [tasks, setTasks] = useState({
    [`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`]: [
      { text: "Finish UI Design", done: true },
      { text: "Add Smart Animate", done: true },
      { text: "Review Resource Links", done: false },
    ],
  });
  const [input, setInput] = useState("");
  const [showWishbot, setShowWishbot] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // <-- Add this state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- Add this state
  const navigate = useNavigate(); // <-- Add this hook

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setIsLoggedIn(true);
  }, []);

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

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);

  // For calendar grid
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay(); // 0=Sun
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  // Key for tasks
  const taskKey = `${selectedYear}-${selectedMonth}-${selectedDate}`;
  const dayTasks = tasks[taskKey] || [];
  const completed = dayTasks.filter((t) => t.done).length;

  // For real-time highlight of today
  const isToday = (d) =>
    d === now.getDate() &&
    selectedMonth === now.getMonth() &&
    selectedYear === now.getFullYear();

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setInput("");
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks((prev) => ({
      ...prev,
      [taskKey]: [
        ...(prev[taskKey] || []),
        { text: input.trim(), done: false },
      ],
    }));
    setInput("");
  };

  const handleToggleTask = (idx) => {
    setTasks((prev) => ({
      ...prev,
      [taskKey]: prev[taskKey].map((task, i) =>
        i === idx ? { ...task, done: !task.done } : task
      ),
    }));
  };

  // Add this function to delete a task
  const handleDeleteTask = (idx) => {
    setTasks((prev) => ({
      ...prev,
      [taskKey]: prev[taskKey].filter((_, i) => i !== idx),
    }));
  };

  // Generate year options (current year +/- 5 years)
  const yearOptions = [];
  for (let y = now.getFullYear() - 5; y <= now.getFullYear() + 5; y++) {
    yearOptions.push(y);
  }

  // Confetti trigger
  const prevCompletedRef = useRef(0);
  useEffect(() => {
    if (dayTasks.length > 0 && completed === dayTasks.length && prevCompletedRef.current !== completed) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
    prevCompletedRef.current = completed;
  }, [completed, dayTasks.length]);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <img src={logoImg} alt="PlanGenie Logo" className={styles.logo} />
          <span className={styles.brand}>PlanGenie</span>
        </div>
        <div className={styles.navLinks}>
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
          ) : null}
        </div>
      </nav>
      <h1 className={styles.heading}>Track Your Progress</h1>
      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <div className={styles.monthYearRow}>
            <select
              className={styles.monthSelect}
              value={selectedMonth}
              onChange={e => {
                setSelectedMonth(Number(e.target.value));
                setSelectedDate(1);
              }}
            >
              {monthNames.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
            <select
              className={styles.yearSelect}
              value={selectedYear}
              onChange={e => {
                setSelectedYear(Number(e.target.value));
                setSelectedDate(1);
              }}
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className={styles.calendarGrid}>
            {["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].map((d) => (
              <div key={d} className={styles.dayLabel}>{d}</div>
            ))}
            {calendarCells.map((day, idx) =>
              day ? (
                <button
                  key={day}
                  className={`${styles.dayCell} ${
                    day === selectedDate ? styles.selectedDay : ""
                  } ${isToday(day) ? styles.today : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </button>
              ) : (
                <div key={`empty-${idx}`} className={styles.dayCellEmpty}></div>
              )
            )}
          </div>
        </div>
        <div className={styles.todoSection}>
          <div className={styles.todoCard}>
            <div className={styles.todoTitle}>
              Tasks for {selectedDate} {monthNames[selectedMonth]} {selectedYear}
            </div>
            <ul className={styles.todoList}>
              {dayTasks.map((task, idx) => (
                <li key={idx} className={styles.todoItem}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggleTask(idx)}
                  />
                  <span className={task.done ? styles.done : ""}>{task.text}</span>
                  <button
                    className={styles.deleteTaskBtn}
                    type="button"
                    onClick={() => handleDeleteTask(idx)}
                    title="Delete task"
                  >-</button>
                </li>
              ))}
            </ul>
            <form className={styles.addTaskForm} onSubmit={handleAddTask}>
              <input
                className={styles.addTaskInput}
                type="text"
                placeholder="Add new task"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className={styles.addTaskBtn} type="submit">+</button>
            </form>
            <div className={styles.pieChart}>
              <PieChart completed={completed} total={dayTasks.length} />
            </div>
            {dayTasks.length > 0 && completed === dayTasks.length && (
              <div className={styles.congratsMsg}>
                You did it buddy! 
                Let's move ahead with another day💪🏻
                
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={styles.wishbotLeft}
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
        <div className={styles.wishbotPopupLeft}>
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