import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import axios from "axios";
import NavBar from "../components/NavBar"; // ✅ Import NavBar

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableUser, setEditableUser] = useState({});
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(userRes.data);
        setEditableUser(userRes.data);

        const planRes = await axios.get(`http://localhost:5000/api/roadmaps/user/${userId}`);
        setPlans(planRes.data.reverse()); // newest first
      } catch (err) {
        console.error("❌ Failed to fetch profile data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setEditableUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, editableUser);
      setUser(editableUser);
      setEditMode(false);
    } catch (err) {
      console.error("❌ Failed to save user info:", err);
    }
  };

  return (
    <div className={styles.container}>
      <NavBar /> {/* ✅ Add NavBar here */}

      <h2 className={styles.heading}>👤 Your Profile</h2>

      {user ? (
        <div className={styles.userInfo}>
          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              value={editableUser.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!editMode}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={editableUser.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!editMode}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>Bio</label>
            <textarea
              value={editableUser.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!editMode}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>GitHub</label>
            <input
              type="text"
              value={editableUser.github || ""}
              onChange={(e) => handleInputChange("github", e.target.value)}
              disabled={!editMode}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label>LinkedIn</label>
            <input
              type="text"
              value={editableUser.linkedin || ""}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              disabled={!editMode}
              className={styles.input}
            />
          </div>

          {editMode ? (
            <button className={`${styles.btn} ${styles.saveButton}`} onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className={`${styles.btn} ${styles.editButton}`} onClick={() => setEditMode(true)}>
              Edit
            </button>
          )}
        </div>
      ) : (
        <p>Loading user info...</p>
      )}

      {/* My Plans Section */}
      <section className={styles.section}>
        <h3>📋 My Plans</h3>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
          {plans.length > 0 ? (
            plans.map((plan, index) => (
              <div key={plan._id} className={styles.planBox}>
                <strong>Plan {index + 1}</strong>
                <pre className={styles.preview}>
                  {plan.content.slice(0, 100)}...
                </pre>
              </div>
            ))
          ) : (
            <p>No plans found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
