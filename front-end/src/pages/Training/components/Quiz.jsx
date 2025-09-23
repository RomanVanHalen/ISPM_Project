import React, { useState } from "react";
import "../styles/Quiz.css";

const Quiz = ({ onComplete }) => {
  const questions = [
    {
      question: "What is the best way to handle child personal data?",
      options: [
        "Share with colleagues freely",
        "Store in encrypted database",
        "Post on social media",
        "Send via public email"
      ],
      answer: "Store in encrypted database",
    },
    {
      question: "How should donor bank details be shared?",
      options: [
        "Only with authorized personnel",
        "With any team member",
        "On company Slack",
        "Upload to public cloud"
      ],
      answer: "Only with authorized personnel",
    },
    {
      question: "What should you do with employee emails?",
      options: [
        "Use for phishing tests",
        "Share externally",
        "Keep internal and secure",
        "Send to personal accounts"
      ],
      answer: "Keep internal and secure",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");

  const handleSubmit = () => {
    if (selected === questions[current].answer) setScore((s) => s + 1);
    setSelected("");
    if (current + 1 < questions.length) setCurrent(current + 1);
    else onComplete(score + (selected === questions[current].answer ? 1 : 0));
  };

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
      <button onClick={handleSubmit} disabled={!selected}>Submit</button>
      <p>Current Score: {score}</p>
    </div>
  );
};

export default Quiz;
