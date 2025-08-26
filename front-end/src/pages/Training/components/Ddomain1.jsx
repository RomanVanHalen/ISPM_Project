
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer2";
import "../styles/Ddomain1.css";

const Ddomain1 = () => {
  const navigate = useNavigate();

  // ===== Quiz Data =====
  const quizData = [
    {
      question: "Which of the following is NOT part of the CIA triad?",
      options: ["Confidentiality", "Integrity", "Availability", "Authorization"],
      answer: "Authorization",
      explanation: "The CIA triad stands for Confidentiality, Integrity, and Availability. Authorization is related to access control but not part of the triad.",
    },
    {
      question: "What is the main purpose of risk management in cybersecurity?",
      options: [
        "To completely eliminate risks",
        "To identify, assess, and mitigate risks",
        "To ignore minor threats",
        "To increase system complexity",
      ],
      answer: "To identify, assess, and mitigate risks",
      explanation: "Risk management helps organizations prioritize and reduce risks — risks cannot be fully eliminated, only minimized.",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(""); // explanation feedback
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (option) => {
    setSelected(option);

    if (option === quizData[current].answer) {
      setScore(score + 1);
      setFeedback("✅ Correct!");
      setTimeout(() => {
        goToNext();
      }, 1500);
    } else {
      setFeedback(
        `❌ Wrong! The correct answer is "${quizData[current].answer}".\n\n💡 ${quizData[current].explanation}`
      );
      setTimeout(() => {
        goToNext();
      }, 3000);
    }
  };

  const goToNext = () => {
    const next = current + 1;
    if (next < quizData.length) {
      setCurrent(next);
      setSelected(null);
      setFeedback("");
    } else {
      setIsFinished(true);
    }
  };

  return (
    <>
      <Navbar />
    

        {/* ===== Quiz Section ===== */}
        <div className="ka-quiz-container">
          {!isFinished ? (
            <>
              <h2>Quick Quiz</h2>
              <p>
                Question {current + 1} of {quizData.length}
              </p>
              <h3>{quizData[current].question}</h3>
              <div className="ka-options">
                {quizData[current].options.map((option, index) => {
                  let className = "ka-option-btn";
                  if (selected) {
                    if (option === quizData[current].answer) {
                      className += " correct";
                    } else if (option === selected) {
                      className += " wrong";
                    }
                  }
                  return (
                    <button
                      key={index}
                      className={className}
                      onClick={() => !selected && handleAnswer(option)}
                      disabled={!!selected}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Area */}
              {feedback && (
                <div className="ka-feedback">
                  <p>{feedback}</p>
                </div>
              )}
            </>
          ) : (
            <div className="ka-quiz-result">
              <h2>Quiz Completed 🎉</h2>
              <p>
                You scored <b>{score}</b> out of <b>{quizData.length}</b>
              </p>
              <button
                className="ka-back-button"
                onClick={() => {
                  setCurrent(0);
                  setScore(0);
                  setIsFinished(false);
                  setSelected(null);
                  setFeedback("");
                }}
              >
                🔄 Restart Quiz
              </button>
            </div>
          )}
        </div>

        <button className="ka-back-button" onClick={() => navigate("/courses")}>
          ← Back to Courses
        </button>
      
      <Footer />
    </>
  );
};

export default Ddomain1;
