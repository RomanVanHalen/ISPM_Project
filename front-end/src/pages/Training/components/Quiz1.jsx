import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Quiz1.css";

const questions = [
  // 1. Drag & Drop (Categorization)
  {
    type: "dragdrop-categorize",
    question: "Drag each item under the correct category.",
    categories: ["ISO 27001 / InfoSec Management", "Disaster Recovery & Business Continuity"],
    items: [
      "Risk management",
      "Encryption",
      "Access control",
      "Incident response",
      "Backups",
      "Emergency communication",
      "Resilience during cyberattacks",
    ],
    correct: {
      "ISO 27001 / InfoSec Management": ["Risk management", "Encryption", "Access control", "Incident response"],
      "Disaster Recovery & Business Continuity": ["Backups", "Emergency communication", "Resilience during cyberattacks"],
    },
  },

  // 2. Multiple Choice
  {
    type: "single",
    question: "Which of the following best describes the primary purpose of ISO 27001?",
    options: [
      "To enforce national cybersecurity laws",
      "To establish an information security management system (ISMS)",
      "To ensure faster internet speeds in organizations",
      "To design new programming languages",
    ],
    correct: 1,
  },

  // 3. Multiple Answer
  {
    type: "multi",
    question: "Which of these are key security controls under ISO 27001?",
    options: [
      "Encryption of sensitive data",
      "Physical access restrictions",
      "Color coding of documents",
      "Strong password policies",
      "Employee awareness training",
    ],
    correct: [0, 1, 3, 4],
  },

  // 4. True/False
  {
    type: "tf",
    question: "Disaster Recovery is only about restoring data backups and does not involve people or processes.",
    options: ["True", "False"],
    correct: 1,
  },

  // 5. Scenario (Multiple Choice)
  {
    type: "single",
    question:
      "World Vision Lanka experiences a cyberattack that disrupts access to donor records. Which framework primarily guides the recovery and continuity of operations?",
    options: [
      "ISO 27001 Information Security Management",
      "Business Continuity & Disaster Recovery Framework",
      "International Accounting Standards",
      "Organizational HR Policy",
    ],
    correct: 1,
  },

  // 6. Fill in the Blank
  {
    type: "fill",
    question: "The process of identifying, analyzing, and minimizing security threats to an organization is known as __________.",
    correct: "Risk Management",
  },

  // 7. Multiple Answer
  {
    type: "multi",
    question: "Which are important elements of a Disaster Recovery Plan?",
    options: [
      "Regular data backups",
      "Emergency communication channels",
      "Encryption algorithms",
      "Alternate office/work locations",
      "Incident response drills",
    ],
    correct: [0, 1, 3, 4],
  },

  // 8. Drag & Drop (Match Concepts)
  {
    type: "dragdrop-match",
    question: "Match the term with its description.",
    pairs: {
      Encryption: "Protecting data by converting it into unreadable code",
      "Access Control": "Restricting entry to systems and information",
      "Incident Response": "Steps taken to manage and reduce damage during a cyberattack",
      Backups: "Copies of data stored separately for recovery",
    },
  },

  // 9. Multiple Choice
  {
    type: "single",
    question: "Why is emergency communication important in Business Continuity?",
    options: [
      "To reduce electricity costs",
      "To ensure staff, donors, and partners receive critical updates during disruptions",
      "To increase email storage space",
      "To comply with marketing regulations",
    ],
    correct: 1,
  },

  // 10. Multiple Answer
  {
    type: "multi",
    question: "How does ISO 27001 help a humanitarian organization like World Vision Lanka?",
    options: [
      "Protects sensitive beneficiary data",
      "Builds donor confidence by ensuring data security",
      "Ensures faster delivery of food aid",
      "Establishes clear roles in case of security incidents",
      "Reduces risk of cyberattacks disrupting services",
    ],
    correct: [0, 1, 3, 4],
  },
];

export default function TrainingModule() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [dropZones, setDropZones] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [matched, setMatched] = useState({});

  const navigate = useNavigate();

  const currentQuestion = questions[step];
  const totalQuestions = questions.length;

useEffect(() => {
  if (step >= totalQuestions) {
    const saveProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        // Save quiz score
        await axios.post(
          "/api/score",
          {
            score,
            total: totalQuestions,
            module: "Core Information Security Standards", // <- your module title
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Mark training as completed in progress
        await axios.post(
          "/api/progress/complete-training",
          { moduleName: "domain1" }, // <-- change this per module
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Score and module completion saved!");
      } catch (err) {
        console.error("Error saving progress:", err);
      }
    };

    saveProgress();
  }
}, [step, score, totalQuestions]);

  const handleNext = (points = 0) => {
    setScore(score + points);
    setStep(step + 1);
  };

  const handleAnswer = (isCorrect) => {
    handleNext(isCorrect ? 1 : 0);
  };

  const handleMultiAnswer = (selected) => {
    const correctSet = new Set(currentQuestion.correct);
    const selectedSet = new Set(selected);
    const isCorrect =
      selected.length === correctSet.size &&
      [...selectedSet].every((v) => correctSet.has(v));
    handleNext(isCorrect ? 1 : 0);
  };

  const handleFillAnswer = (value) => {
    const isCorrect =
      value.trim().toLowerCase() === currentQuestion.correct.toLowerCase();
    handleNext(isCorrect ? 1 : 0);
  };

  // ---------- Drag & Drop (Categorize) ----------
  const handleDropCategorize = (zone) => {
    if (!draggedItem) return;
    setDropZones((prev) => {
      const updated = { ...prev, [zone]: [...(prev[zone] || []), draggedItem] };
      return updated;
    });
    setDraggedItem(null);
  };

  const checkCategorizeAnswer = () => {
    const correct = currentQuestion.correct;
    let correctCount = 0;
    Object.keys(correct).forEach((zone) => {
      const placed = dropZones[zone] || [];
      if (
        placed.length === correct[zone].length &&
        placed.every((item) => correct[zone].includes(item))
      ) {
        correctCount++;
      }
    });
    handleNext(correctCount === Object.keys(correct).length ? 1 : 0);
    setDropZones({});
  };

  // ---------- Drag & Drop (Match) ----------
  const handleMatch = (term, desc) => {
    setMatched({ ...matched, [term]: desc });
  };
  const checkMatchAnswer = () => {
    const pairs = currentQuestion.pairs;
    let correctCount = 0;
    Object.keys(pairs).forEach((term) => {
      if (matched[term] === pairs[term]) {
        correctCount++;
      }
    });
    handleNext(correctCount === Object.keys(pairs).length ? 1 : 0);
    setMatched({});
  };

  // ---------- Progress ----------
  const progressPercentage = Math.round((score / totalQuestions) * 100);

// ---------- Render ----------
if (step >= totalQuestions) {
    
  return (
    <div className="sa06-training-wrapper">
      <div className="sa06-training-complete">
        <h2>Training Complete!</h2>
        <h3>
          Your Score: {score} / {totalQuestions}
        </h3>
        <div className="sa06-progress-bar">
          <div
            className="sa06-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p>{progressPercentage}%</p>

        {/* ✅ Back Button */}
        <button
            className="sa06-button"
            onClick={() => navigate("/training/Courses")}  // <-- change path as needed
        >
          Back to Modules
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="sa06-training-container">
      <div className="sa06-header-score">
        Question {step + 1} of {totalQuestions} | Score: {score}
      </div>

      {/* ✅ Progress Bar */}
      <div className="sa06-progress-bar">
        <div
          className="sa06-progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p>{progressPercentage}%</p>

      {/* Drag & Drop Categorization */}
      {currentQuestion.type === "dragdrop-categorize" && (
        <div className="sa06-drag-drop-container">
          <h3>{currentQuestion.question}</h3>
          <div className="sa06-zones">
            {currentQuestion.categories.map((cat) => (
              <div
                key={cat}
                className="sa06-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropCategorize(cat)}
              >
                <h4>{cat}</h4>
                {(dropZones[cat] || []).map((item, idx) => (
                  <div key={idx} className="sa06-dropped-item">
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="sa06-draggable-items">
            {currentQuestion.items
              .filter(
                (item) =>
                  !Object.values(dropZones)
                    .flat()
                    .includes(item)
              )
              .map((item) => (
                <div
                  key={item}
                  className="sa06-draggable-item"
                  draggable
                  onDragStart={() => setDraggedItem(item)}
                >
                  {item}
                </div>
              ))}
          </div>
          <button className="sa06-button" onClick={checkCategorizeAnswer}>
            Submit
          </button>
        </div>
      )}

      {/* Drag & Drop Match */}
      {currentQuestion.type === "dragdrop-match" && (
        <div className="sa06-drag-drop-container">
          <h3>{currentQuestion.question}</h3>
          {Object.entries(currentQuestion.pairs).map(([term, desc]) => (
            <div key={term} className="sa06-quiz-option">
              <strong>{term}:</strong>
              <select
                value={matched[term] || ""}
                onChange={(e) => handleMatch(term, e.target.value)}
              >
                <option value="">Select description</option>
                {Object.values(currentQuestion.pairs).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button className="sa06-button" onClick={checkMatchAnswer}>
            Submit
          </button>
        </div>
      )}

      {/* Single Choice */}
      {currentQuestion.type === "single" && (
        <div className="sa06-quiz-container">
          <h3>{currentQuestion.question}</h3>
          {currentQuestion.options.map((opt, idx) => (
            <label key={idx} className="sa06-quiz-option">
              <input
                type="radio"
                name={`q-${step}`}
                onChange={() => handleAnswer(idx === currentQuestion.correct)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {/* Multiple Answer */}
      {currentQuestion.type === "multi" && (
        <div className="sa06-quiz-container">
          <h3>{currentQuestion.question}</h3>
          {currentQuestion.options.map((opt, idx) => (
            <label key={idx} className="sa06-quiz-option">
              <input
                type="checkbox"
                checked={(answers[step] || []).includes(idx)}
                onChange={(e) => {
                  const selected = new Set(answers[step] || []);
                  if (e.target.checked) selected.add(idx);
                  else selected.delete(idx);
                  setAnswers({ ...answers, [step]: [...selected] });
                }}
              />
              {opt}
            </label>
          ))}
          <button
            className="sa06-button"
            onClick={() => handleMultiAnswer(answers[step] || [])}
          >
            Submit
          </button>
        </div>
      )}

      {/* True/False */}
      {currentQuestion.type === "tf" && (
        <div className="sa06-quiz-container">
          <h3>{currentQuestion.question}</h3>
          {currentQuestion.options.map((opt, idx) => (
            <label key={idx} className="sa06-quiz-option">
              <input
                type="radio"
                name={`q-${step}`}
                onChange={() => handleAnswer(idx === currentQuestion.correct)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {/* Fill in the Blank */}
      {currentQuestion.type === "fill" && (
        <div className="sa06-quiz-container">
          <h3>{currentQuestion.question}</h3>
          <input
            type="text"
            className="sa06-fill-blank-input"
            onKeyDown={(e) =>
              e.key === "Enter" && handleFillAnswer(e.target.value)
            }
          />
          <button
            className="sa06-button"
            onClick={() =>
              handleFillAnswer(
                document.querySelector(".sa06-fill-blank-input").value
              )
            }
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}



