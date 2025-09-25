import React, { useEffect, useState } from "react";
import api from "../../../api/axiosInstance"; // ✅ axios instance with JWT
import "../styles/ScoreBoard.css";

const ScoreBoard = ({ onRestart }) => {
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // ✅ Fetch all scores for the logged-in user
        const res = await api.get("/score"); 
        const scores = res.data; // array of { module, score, total }

        // ✅ Filter only the modules we want to include
        const modulesToInclude = ["DragDropData", "Data Protection Quiz"];
        const filtered = scores.filter((s) => modulesToInclude.includes(s.module));

        // ✅ Calculate combined totals
        const totalScore = filtered.reduce((sum, s) => sum + (s.score || 0), 0);
        const totalMax = filtered.reduce((sum, s) => sum + (s.total || 0), 0);

        setScore(totalScore);
        setTotal(totalMax);
      } catch (err) {
        console.error("❌ Failed to fetch scores:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return <p className="loading">Loading Score...</p>;
  }

  if (total === 0) {
    return <p className="error">⚠️ No scores found for trainings.</p>;
  }

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70; // ✅ Example pass mark

  return (
    <div className="scoreboard-container">
      <h2 className="score-title">🎉 Trainings Completed!</h2>

      <p className="score-text">
        Your Combined Score: <span className="score-highlight">{score}</span> / {total}
      </p>

      <p className={`result-message ${passed ? "passed" : "failed"}`}>
        {passed ? "✅ Great job! You passed overall!" : "⚠️ Keep practicing!"}
      </p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <button className="restart-btn" onClick={onRestart}>
        🔄 Restart Training
      </button>
    </div>
  );
};

export default ScoreBoard;


