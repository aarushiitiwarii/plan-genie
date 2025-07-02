import React, { useState, useEffect } from "react";
import axios from "axios";
import Sparkles from "../components/Sparkles";
import NavBar from "../components/NavBar";
import styles from "./manage.module.css";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Manage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(selectedDate.getMonth());
  const [calendarYear, setCalendarYear] = useState(selectedDate.getFullYear());
  const [tasksByDate, setTasksByDate] = useState({});
  const [checked, setChecked] = useState({});
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [showSparkles, setShowSparkles] = useState(false);
  const [startDate, setStartDate] = useState(new Date()); // ✅ Start date picker

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const localRoadmap = localStorage.getItem("roadmap");

    // Helper: Parse roadmap text into weeks and tasks
    function parseRoadmapWeeks(text) {
      const weekRegex = /Week (\d+):[\s\S]*?Tasks:\n([\s\S]*?)(?=(\nWeek \d+:|$))/g;
      let match;
      const weeks = [];
      while ((match = weekRegex.exec(text)) !== null) {
        const weekNum = parseInt(match[1], 10);
        const tasksBlock = match[2];
        const tasks = tasksBlock
          .split(/\n\d+\. /)
          .map(t => t.replace(/\n/g, " ").trim())
          .filter(t => t && !/^Tasks:/.test(t));
        weeks.push({ weekNum, tasks });
      }
      return weeks;
    }

    // Helper: Distribute weekly tasks into days
    function distributeTasksByDate(weeks, startDate) {
      const tasksByDate = {};
      let currentDate = new Date(startDate);
      weeks.forEach(week => {
        const daysInWeek = 7;
        const numTasks = week.tasks.length;
        let dayIdx = 0;
        week.tasks.forEach((task, i) => {
          // Assign each task to a day, cycling through the week
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() + dayIdx);
          const dateKey = date.toISOString().split("T")[0];
          if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
          tasksByDate[dateKey].push(task);
          dayIdx = (dayIdx + 1) % daysInWeek;
          if (dayIdx === 0 && i !== numTasks - 1) {
            // Move to next week if more tasks remain
            currentDate.setDate(currentDate.getDate() + daysInWeek);
          }
        });
        // After each week, move currentDate to next week
        currentDate.setDate(currentDate.getDate() + daysInWeek - dayIdx);
      });
      return tasksByDate;
    }

    const processRoadmap = (text) => {
      const weeks = parseRoadmapWeeks(text);
      const distributed = distributeTasksByDate(weeks, startDate);
      setTasksByDate(distributed);
    };

    if (localRoadmap) {
      processRoadmap(localRoadmap);
    } else if (userId) {
      axios
        .get(`http://localhost:5000/api/roadmaps/user/${userId}`)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const latest = res.data[0].content;
            localStorage.setItem("roadmap", latest);
            processRoadmap(latest);
          }
        })
        .catch((err) => console.error("Failed to fetch roadmap:", err));
    }
  }, [startDate]);

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfWeek(calendarYear, calendarMonth);

  const handleDayClick = (day) => {
    const newDate = new Date(calendarYear, calendarMonth, day);
    setSelectedDate(newDate);
  };

  const formatDateKey = (y, m, d) => {
    return new Date(y, m, d).toISOString().split("T")[0];
  };

  const dateKey = formatDateKey(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  const tasks = tasksByDate[dateKey] || [];
  const allChecked = tasks.length > 0 && tasks.every((_, i) => checked[dateKey + "-" + i]);

  const handleCheck = (idx) => {
    const newChecked = { ...checked, [dateKey + "-" + idx]: !checked[dateKey + "-" + idx] };
    setChecked(newChecked);
    if (tasks.every((_, i) => newChecked[dateKey + "-" + i] || i === idx)) {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1500);
    }
  };

  const handleEdit = (i) => {
    setEditingTaskIndex(i);
    setEditedTask(tasks[i]);
  };

  const saveEdit = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingTaskIndex] = editedTask;
    const updated = { ...tasksByDate, [dateKey]: updatedTasks };
    setTasksByDate(updated);
    setEditingTaskIndex(null);
    setEditedTask("");
  };

  const getDayColor = (y, m, d) => {
    const key = formatDateKey(y, m, d);
    const t = tasksByDate[key];
    if (!t) return "#eee";
    const allDone = t.every((_, i) => checked[key + "-" + i]);
    return allDone ? "#a3e635" : "#facc15";
  };

  return (
    <div className={styles.container}>
      <NavBar />
      {showSparkles && <Sparkles trigger={showSparkles} onEnd={() => setShowSparkles(false)} />}
      <div className={styles.content}>
        <div className={styles.topControls}>
          <label style={{ fontWeight: 600 }}>
            Start Date:{" "}
            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.calendarSection}>
          <div className={styles.monthHeader}>
            <button onClick={() => {
              if (calendarMonth === 0) {
                setCalendarMonth(11);
                setCalendarYear(calendarYear - 1);
              } else {
                setCalendarMonth(calendarMonth - 1);
              }
            }}>
              &#60;
            </button>
            <span>{monthNames[calendarMonth]} {calendarYear}</span>
            <button onClick={() => {
              if (calendarMonth === 11) {
                setCalendarMonth(0);
                setCalendarYear(calendarYear + 1);
              } else {
                setCalendarMonth(calendarMonth + 1);
              }
            }}>
              &#62;
            </button>
          </div>

          <div className={styles.calendarGrid}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className={styles.dayLabel}>{d}</div>
            ))}
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={"empty-" + i} className={styles.dayCellEmpty}></div>
            ))}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isSelected =
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === calendarMonth &&
                selectedDate.getFullYear() === calendarYear;
              return (
                <button
                  key={day}
                  className={`${styles.dayCell} ${isSelected ? styles.selectedDay : ""}`}
                  style={{ backgroundColor: getDayColor(calendarYear, calendarMonth, day) }}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.todoSection}>
          <div className={styles.todoCard}>
            <div className={styles.todoTitle}>
              Tasks for {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
            </div>
            <ul className={styles.todoList}>
              {tasks.length === 0 ? (
                <li className={styles.todoItem} style={{ color: "#888" }}>
                  No tasks assigned.
                </li>
              ) : (
                tasks.map((task, idx) => (
                  <li key={idx} className={styles.todoItem}>
                    <input
                      type="checkbox"
                      checked={!!checked[dateKey + "-" + idx]}
                      onChange={() => handleCheck(idx)}
                    />
                    {editingTaskIndex === idx ? (
                      <>
                        <input
                          value={editedTask}
                          onChange={(e) => setEditedTask(e.target.value)}
                          style={{ marginLeft: 10 }}
                        />
                        <button onClick={saveEdit} style={{ marginLeft: 10 }}>Save</button>
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            textDecoration: checked[dateKey + "-" + idx] ? "line-through" : "none",
                            marginLeft: 10
                          }}
                        >
                          {task}
                        </span>
                        <button onClick={() => handleEdit(idx)} style={{ marginLeft: 10 }}>
                          ✏️
                        </button>
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
