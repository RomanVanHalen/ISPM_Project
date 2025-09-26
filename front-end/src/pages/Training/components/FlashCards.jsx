// src/components/FlashCards.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FlashCards.css";

export default function FlashCards({ onComplete, onFinish }) {
  const questions = [
    { question: "Which ISO standard prevents bribery?", options: [
      { id: 0, label: "A", text: "ISO 9001", correct: false },
      { id: 1, label: "B", text: "ISO 37001", correct: true },
      { id: 2, label: "C", text: "ISO 14001", correct: false },
    ]},
    { question: "What does ISO 9001 focus on?", options: [
      { id: 0, label: "A", text: "Bribery prevention", correct: false },
      { id: 1, label: "B", text: "Quality and process documentation", correct: true },
      { id: 2, label: "C", text: "Environmental protection", correct: false },
    ]},
    { question: "Whistleblowing system is used for?", options: [
      { id: 0, label: "A", text: "Tracking aid distribution", correct: false },
      { id: 1, label: "B", text: "Reporting fraud anonymously", correct: true },
      { id: 2, label: "C", text: "Monitoring quality", correct: false },
    ]},
    { question: "What do audit logs provide?", options: [
      { id: 0, label: "A", text: "Digital accountability records", correct: true },
      { id: 1, label: "B", text: "Anonymous fraud reports", correct: false },
      { id: 2, label: "C", text: "Bribery prevention", correct: false },
    ]},
  ];

  const total = questions.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flipped, setFlipped] = useState(Array(3).fill(false));
  const [peeked, setPeeked] = useState(Array(3).fill(false));
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const isDone = currentQuestionIndex >= total;

  const resetForNext = () => {
    setFlipped(Array(3).fill(false));
    setPeeked(Array(3).fill(false));
    setSelected(null);
    setShowResult(false);
  };

  const handlePeekFlip = (index) => {
    if (showResult || isDone) return;
    const nf = [...flipped]; nf[index] = true; setFlipped(nf);
    const np = [...peeked]; np[index] = true; setPeeked(np);
    setTimeout(() => { const r = [...nf]; r[index] = false; setFlipped(r); }, 1000);
  };

  const handleSelect = (index) => {
    if (isDone) return;
    if (!peeked[index]) { alert("Peek this card first before selecting!"); return; }
    setSelected(index);
    setShowResult(true);
  };

  const handleNext = () => {
    if (!showResult) return;

    const wasCorrect =
      selected !== null &&
      questions[currentQuestionIndex].options[selected].correct;

    // update score now
    const nextCorrect = correctCount + (wasCorrect ? 1 : 0);
    setCorrectCount(nextCorrect);

    const onLastQ = currentQuestionIndex === total - 1;

    // report to parent right before we advance beyond last Q
    if (onLastQ && typeof onFinish === "function") {
      onFinish({ correct: nextCorrect, total });
    }

    setCurrentQuestionIndex((p) => p + 1);
    resetForNext();
  };

  return (
    <div className="nawoo-fc-container">
      <p className="nawoo-fc-progress">
        Question {Math.min(currentQuestionIndex + 1, total)} / {total}
        <span className="nawoo-fc-score">Score: {correctCount}/{total}</span>
      </p>

      <h1 className="nawoo-fc-title">BrainFlip</h1>

      {!isDone ? (
        (() => {
          const currentQuestion = questions[currentQuestionIndex];
          const onLast = currentQuestionIndex === total - 1;
          return (
            <>
              <p className="nawoo-fc-question">{currentQuestion.question}</p>

              <div className="nawoo-fc-grid">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`nawoo-fc-card ${flipped[index] ? "flipped" : ""} ${
                      showResult && index === selected
                        ? option.correct ? "correct" : "wrong"
                        : ""
                    }`}
                  >
                    <div
                      className="nawoo-fc-front"
                      onClick={() => handlePeekFlip(index)}
                      onDoubleClick={() => handleSelect(index)}
                    >
                      <p className="nawoo-fc-label">{option.label}</p>
                    </div>

                    <div className="nawoo-fc-back">
                      <p className="nawoo-fc-text">{option.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {showResult && selected !== null && (
                <p className="nawoo-fc-feedback">
                  {currentQuestion.options[selected].correct
                    ? " Correct!"
                    : `Wrong! Correct answer: ${
                        currentQuestion.options.find((o) => o.correct).text
                      }`}
                </p>
              )}

              {showResult && (
                <div className="nawoo-fc-actions">
                  {!onLast ? (
                    <button className="nawoo-fc-btn" onClick={handleNext}>Next Question</button>
                  ) : (
                    <button className="nawoo-fc-btn" onClick={handleNext}>Finish</button>
                  )}
                </div>
              )}
            </>
          );
        })()
      ) : (
        <div className="nawoo-next-quiz-container">
          <p>You’ve completed BrainFlip!</p>
          {onComplete ? (
            <button className="nawoo-next-quiz-btn" onClick={onComplete}>Next Quiz</button>
          ) : (
            <Link to="/NumberOrder" className="nawoo-next-quiz-btn">Next Quiz</Link>
          )}
        </div>
      )}
    </div>
  );
}
