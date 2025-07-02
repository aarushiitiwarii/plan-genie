import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import styles from "./result.module.css";
import Navbar from "../components/NavBar";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const [weeks, setWeeks] = useState([]);
  const [modalIndex, setModalIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [loadingRegen, setLoadingRegen] = useState(false);

  useEffect(() => {
    const roadmap = location.state?.roadmap || localStorage.getItem("roadmap");
    if (!roadmap) return;
    const weekChunks = roadmap.split(/(?=Week \d+:)/g).map((w) => w.trim());
    setWeeks(weekChunks);
  }, [location.state]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(weeks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setWeeks(items);
  };

  const saveToBackend = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("User not logged in.");
    const roadmapText = weeks.join("\n\n");
    try {
      await axios.post("http://localhost:5000/api/roadmaps", {
        userId,
        content: roadmapText,
      });
      alert("Roadmap saved to your profile!");
    } catch (err) {
      alert("Failed to save roadmap.");
      console.error(err);
    }
  };

  const openModal = (index) => {
    setModalIndex(index);
    setEditedText(weeks[index]);
  };

  const saveModalEdits = () => {
    const updated = [...weeks];
    updated[modalIndex] = editedText;
    setWeeks(updated);
    setModalIndex(null);
  };

  const deleteWeek = () => {
    const updated = [...weeks];
    updated.splice(modalIndex, 1);
    setWeeks(updated);
    setModalIndex(null);
  };

  const regenerateRoadmap = async () => {
    const savedInput = JSON.parse(localStorage.getItem("planGenieInput"));
    if (!savedInput) return alert("No previous input found.");

    setLoadingRegen(true);
    try {
      const res = await axios.post("http://localhost:5000/api/roadmaps/generate", savedInput);
      const roadmapStr = res.data.roadmap;
      const weekChunks = roadmapStr.split(/(?=Week \d+:)/g).map((w) => w.trim());
      localStorage.setItem("roadmap", roadmapStr);
      setWeeks(weekChunks);
    } catch (err) {
      alert("Failed to regenerate roadmap");
      console.error(err);
    } finally {
      setLoadingRegen(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <h2 className={styles.heading}>Your Personalized Roadmap</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="weeks" direction="horizontal">
          {(provided) => (
            <div className={styles.grid} {...provided.droppableProps} ref={provided.innerRef}>
              {weeks.slice(1).map((week, index) => (
                <Draggable key={index + 1} draggableId={`week-${index + 1}`} index={index}>
                  {(provided) => (
                    <div
                      className={styles.card}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => openModal(index + 1)}
                    >
                      <div className={styles.previewText}>
                        {week.split("\n")[0]}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className={styles.buttonRow}>
        <button onClick={() => navigate(-1)}>Back</button>
        <button onClick={saveToBackend}>Save Roadmap</button>
        <button onClick={() => alert("Edit Roadmap coming soon")}>Edit Roadmap</button>
        <button onClick={regenerateRoadmap} disabled={loadingRegen}>
          {loadingRegen ? "Regenerating..." : "Regenerate"}
        </button>
      </div>

      {modalIndex !== null && (
        <div className={styles.modalOverlay} onClick={() => setModalIndex(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalHeading}>{weeks[modalIndex].split("\n")[0]}</h3>
            <textarea
              className={styles.modalTextarea}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div className={styles.modalButtons}>
              <button onClick={saveModalEdits}>Save</button>
              <button onClick={deleteWeek}>Delete</button>
              <button onClick={() => setModalIndex(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
