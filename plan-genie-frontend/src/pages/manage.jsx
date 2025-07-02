import React, { useState, useEffect } from "react";
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

  const startDate = new Date(); // Can be adjusted to any fixed start date

  useEffect(() => {
    const storedRoadmap = localStorage.getItem("roadmap");
    if (storedRoadmap) {
      const lines = storedRoadmap
        .split("\n")
        .filter((l) => l.trim().startsWith("-"));

      const tasks = {};
      lines.forEach((task, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split("T")[0];
        if (!tasks[dateKey]) tasks[dateKey] = [];
        tasks[dateKey].push(task.replace(/^\s*-\s*/, ""));
      });

      setTasksByDate(tasks);
    }
  }, []);

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
    localStorage.setItem("roadmap", convertTasksToRoadmap(updated)); // Optional save
    setEditingTaskIndex(null);
    setEditedTask("");
  };

  const convertTasksToRoadmap = (allTasks) => {
    const flat = [];
    Object.values(allTasks).forEach((list) => {
      list.forEach((t) => flat.push("- " + t));
    });
    return flat.join("\n");
  };

  const getDayColor = (y, m, d) => {
    const key = formatDateKey(y, m, d);
    const t = tasksByDate[key];
    if (!t) return "#eee";
    const allDone = t.every((_, i) => checked[key + "-" + i]);
    if (allDone) return "#a3e635"; // green
    return "#facc15"; // yellow
  };

  return (
    <div className={styles.container}>
      <NavBar />
      {showSparkles && <Sparkles trigger={showSparkles} onEnd={() => setShowSparkles(false)} />}
      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <div className={styles.monthHeader}>
            <button className={styles.monthArrow} onClick={() => {
              if (calendarMonth === 0) {
                setCalendarMonth(11);
                setCalendarYear(calendarYear - 1);
              } else {
                setCalendarMonth(calendarMonth - 1);
              }
            }}>
              &#60;
            </button>
            <span className={styles.monthLabel}>
              {monthNames[calendarMonth]} {calendarYear}
            </span>
            <button className={styles.monthArrow} onClick={() => {
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
                      style={{ marginRight: 12, width: 20, height: 20 }}
                    />
                    {editingTaskIndex === idx ? (
                      <>
                        <input
                          value={editedTask}
                          onChange={(e) => setEditedTask(e.target.value)}
                          style={{ marginRight: 10, width: "60%" }}
                        />
                        <button onClick={saveEdit}>Save</button>
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            textDecoration: checked[dateKey + "-" + idx] ? "line-through" : "none"
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
