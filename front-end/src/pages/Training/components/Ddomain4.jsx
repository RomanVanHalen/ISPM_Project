// src/pages/training/Courses/Ddomain4.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer2";
import FlashCards from "./FlashCards";       // BrainFlip
import NumberOrdering from "./NumberOrder";  // Sequence Ordering
import "../styles/Ddomain4.css";

const MODULE_ID = "Cyber Governance & Compliance";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Ddomain4 = () => {
  const [stage, setStage] = useState("brainflip");
  const [flashScore, setFlashScore] = useState({ correct: 0, total: 0 });
  const [orderScore, setOrderScore] = useState({ correct: 0, total: 0 });
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");
  const [hasSaved, setHasSaved] = useState(false);

  const { totalCorrect, totalQuestions, accuracy } = useMemo(() => {
    const totalCorrect = (flashScore.correct || 0) + (orderScore.correct || 0);
    const totalQuestions = (flashScore.total || 0) + (orderScore.total || 0);
    const accuracy = totalQuestions
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;
    return { totalCorrect, totalQuestions, accuracy };
  }, [flashScore, orderScore]);

  useEffect(() => {
    const saveTotalScore = async () => {
      if (stage !== "summary") return;
      if (hasSaved) return;
      if (!totalQuestions) return;
      setSaveError("");
      setSaveState("saving");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setSaveState("error");
          setSaveError("You are not logged in. Score not saved.");
          return;
        }

        await axios.post(
          `${API_BASE}/api/score`,
          {
            score: totalCorrect,
            total: totalQuestions,
            module: MODULE_ID,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSaveState("idle"); // no visible success message
        setHasSaved(true);
      } catch (err) {
        setSaveState("error");
        setSaveError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to save score"
        );
      }
    };

    saveTotalScore();
  }, [stage, totalCorrect, totalQuestions, hasSaved]);

  const retrySave = async () => {
    setHasSaved(false);
    setStage("ordering");
    setTimeout(() => setStage("summary"), 0);
  };

  return (
    <>
      <Navbar />
      <div className="ka-course-detail" style={{ padding: "2rem 1rem" }}>
        {stage === "brainflip" && (
          <FlashCards
            onFinish={(s) => setFlashScore(s)}
            onComplete={() => setStage("ordering")}
          />
        )}

        {stage === "ordering" && (
          <NumberOrdering
            onFinish={(s) => setOrderScore(s)}
            onComplete={() => setStage("summary")}
          />
        )}

        {stage === "summary" && (
          <div className="laana-quiz-summary">
            <h2>Module Scoreboard</h2>

            <div className="laana-quiz-summary-card">
              <div className="laana-quiz-summary-row">
                <span>BrainFlip</span>
                <span>
                  {flashScore.correct} / {flashScore.total}
                </span>
              </div>
              <div className="laana-quiz-summary-row">
                <span>Sequence Ordering</span>
                <span>
                  {orderScore.correct} / {orderScore.total}
                </span>
              </div>

              <hr />

              <div className="laana-quiz-summary-row laana-quiz-summary-total">
                <span>Total</span>
                <span>
                  {totalCorrect} / {totalQuestions}
                </span>
              </div>
              <div className="laana-quiz-summary-row laana-quiz-summary-accent">
                <span>Accuracy</span>
                <span>{accuracy}%</span>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              {saveState === "saving" && (
                <small style={{ color: "#6b7280" }}>Saving score…</small>
              )}
              {saveState === "error" && (
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  <small style={{ color: "#b91c1c" }}>
                    {saveError || "Failed to save score."}
                  </small>
                  <button
                    className="nawoo-next-quiz-btn"
                    style={{ alignSelf: "center" }}
                    onClick={retrySave}
                    type="button"
                  >
                    Try Save Again
                  </button>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                marginTop: "0.75rem",
              }}
            >
              
              <a href="/training/Courses" className="nawoo-next-quiz-btn">
                Back to Courses
              </a>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Ddomain4;



