import React, { useState } from "react";
import "../styles/Quiz.css";
import api from "../../../api/axiosInstance"; // ✅ use your axios instance

const Quiz = ({ onComplete }) => {
  const questions = [
    {
      question: "What is the best way to handle child personal data?",
      options: [
        "Share with colleagues freely",
        "Store in encrypted database",
        "Post on social media",
        "Send via public email",
      ],
      answer: "Store in encrypted database",
    },
    {
      question: "How should donor bank details be shared?",
      options: [
        "Only with authorized personnel",
        "With any team member",
        "On company Slack",
        "Upload to public cloud",
      ],
      answer: "Only with authorized personnel",
    },
    {
      question: "What should you do with employee emails?",
      options: [
        "Use for phishing tests",
        "Share externally",
        "Keep internal and secure",
        "Send to personal accounts",
      ],
      answer: "Keep internal and secure",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    let finalScore = score;
    if (selected === questions[current].answer) finalScore += 1;

    if (current + 1 < questions.length) {
      // Move to next question
      setScore(finalScore);
      setSelected("");
      setCurrent(current + 1);
    } else {
      // ✅ Quiz finished
      setScore(finalScore);
      setSubmitted(true);

      try {
        // ✅ Send score to backend
        await api.post("/score", {
          module: "Data Protection Quiz", // module name
          score: finalScore,
          total: questions.length,
        });
        console.log("✅ Score saved successfully!");
      } catch (err) {
        console.error("❌ Failed to save score:", err.response?.data || err.message);
      }

      if (onComplete) onComplete(finalScore);
    }
  };

  if (submitted) {
    return (
      <div className="quiz-container">
        <h3>🎉 Quiz Completed!</h3>
        <p>
          Final Score: {score} / {questions.length}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h3>Data Protection Quiz</h3>
      <p>{questions[current].question}</p>
      {questions[current].options.map((opt, idx) => (
        <label key={idx} className="quiz-option">
          <input
            type="radio"
            name="quiz"
            value={opt}
            checked={selected === opt}
            onChange={(e) => setSelected(e.target.value)}
          />
          {opt}
        </label>
      ))}
      <button onClick={handleSubmit} disabled={!selected}>
        {current + 1 < questions.length ? "Next" : "Finish"}
      </button>
      <p>Current Score: {score}</p>
    </div>
  );
};

export default Quiz;

