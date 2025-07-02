import React, { useEffect, useState } from "react";
import styles from "./history.module.css";
import axios from "axios";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
        if (!user || !user._id) return;
        const res = await axios.get(`/api/roadmap/user/${user._id}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Your Past Roadmaps</h2>
      {history.length === 0 ? (
        <p style={{ textAlign: "center", color: "#aaa" }}>No previous plans found.</p>
      ) : (
        <ul className={styles.historyList}>
          {history.map((item, idx) => (
            <li key={idx} className={styles.historyItem}>
              <span className={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <span className={styles.action}>
                Plan with {item.content.split("- ").length - 1} tasks
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
