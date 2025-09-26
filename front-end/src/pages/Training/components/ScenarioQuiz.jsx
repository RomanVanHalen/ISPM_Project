import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios
import "../styles/ScenarioQuiz.css";

export default function ScenarioQuiz({ onComplete }) {
  const questions = [
    {
      id: 1,
      scenario:
        "Your NGO staff member uploads a picture of children at a school event to Facebook. The photo shows full names and the school’s address.",
      options: [
        "Blur or anonymize details and get written consent before posting.",
        "Leave the photo as it is since it promotes NGO work.",
        "Ask for consent later, after posting.",
        "Just tag the NGO page without naming the children.",
      ],
      correct: 0,
    },
    {
      id: 2,
      scenario:
        "A long-time donor emails: 'I want all of my personal information deleted from your records immediately.'",
      options: [
        "Delete the donor’s data across all systems and confirm deletion.",
        "Keep the data but remove it from the main database only.",
        "Say data can’t be deleted once collected.",
        "Charge the donor a fee for deleting data.",
      ],
      correct: 0,
    },
    {
      id: 3,
      scenario:
        "A staff laptop with sensitive child protection data is stolen. What should you do?",
      options: [
        "Report the incident, notify authorities, and alert affected individuals.",
        "Keep quiet to avoid damaging NGO reputation.",
        "Wait to see if the thief misuses the data.",
        "Recreate the data from backups and ignore the laptop.",
      ],
      correct: 0,
    },
    {
      id: 4,
      scenario:
        "You receive an email from a donor asking you to update banking details via a link. The email looks slightly suspicious.",
      options: [
        "Verify the email sender and contact donor through official channels.",
        "Click the link to quickly update the information.",
        "Forward the email to all staff members.",
        "Ignore the email completely without reporting.",
      ],
      correct: 0,
    },
    {
      id: 5,
      scenario:
        "An NGO staff member stores donor details (names, phone numbers, addresses) in an unencrypted Excel file on a shared drive.",
      options: [
        "Move the file to an encrypted system and restrict access.",
        "Keep the file as is since it’s on an internal network.",
        "Print the file and lock it in a cabinet only.",
        "Email the file to staff so everyone has a copy.",
      ],
      correct: 0,
    },
    {
      id: 6,
      scenario:
        "During a field project, a volunteer asks to copy children’s data to their personal USB for 'backup purposes'.",
      options: [
        "Deny the request and explain official backup procedures.",
        "Allow it if the USB is password protected.",
        "Allow it since they are trusted staff.",
        "Tell them to email the data to their personal Gmail account.",
      ],
      correct: 0,
    },
    {
      id: 7,
      scenario:
        "A hacker threatens to leak donor data unless the NGO pays money. What’s the correct response?",
      options: [
        "Report the incident to authorities and follow incident response plan.",
        "Pay immediately to protect reputation.",
        "Ignore it and hope the hacker gives up.",
        "Negotiate for a smaller payment.",
      ],
      correct: 0,
    },
    {
      id: 8,
      scenario:
        "Staff members share one common password for accessing the donor management system.",
      options: [
        "Implement individual accounts with strong authentication.",
        "Continue since it’s convenient.",
        "Keep the same password but change it every year.",
        "Share the password only with senior staff.",
      ],
      correct: 0,
    },
    {
      id: 9,
      scenario:
        "An NGO website contact form collects names and emails but does not mention how the data will be used.",
      options: [
        "Add a privacy notice explaining data usage and get consent.",
        "Keep collecting data without changes.",
        "Only inform donors if they ask later.",
        "Delete the form entirely.",
      ],
      correct: 0,
    },
    {
      id: 10,
      scenario:
        "A staff member receives a USB drive as a 'gift' from an unknown supplier. What should they do?",
      options: [
        "Avoid using it and hand it to IT/security for checking.",
        "Plug it in to see what’s inside.",
        "Share it with colleagues as free storage.",
        "Use it for personal files only.",
      ],
      correct: 0,
    },
  ];

  // ✅ State variables
  const [current, setCurrent] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  // ✅ Handle answer selection
  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === questions[current].correct;
    const newQuestionsAnswered = questionsAnswered + 1;
    const newCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;

    setQuestionsAnswered(newQuestionsAnswered);
    setCorrectAnswers(newCorrectAnswers);

    setFeedback(isCorrect ? "✅ Correct answer!" : "❌ This answer is wrong.");
  };

  // ✅ Save score to backend
  const saveScore = async (score, total) => {
    try {
      const token = localStorage.getItem("token"); // ✅ assuming token is stored in localStorage
      await axios.post(
        "http://localhost:5000/api/score", // change if different backend URL
        {
          score,
          total,
          module: "Data Privacy & Protection",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error saving score:", err.response?.data || err.message);
    }
  };

  // ✅ Go to next question
  const handleNextQuestion = () => {
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setSelectedOption(null);
      setFeedback("");
    } else {
      setSubmitted(true);
      if (onComplete) onComplete(questionsAnswered, correctAnswers);
      saveScore(correctAnswers, questions.length); // ✅ save when quiz finishes
    }
  };

  return (
    <div className="quiz-container">
      {/* ✅ Live score */}
      <h2 className="header-score">
        Questions Answered: {questionsAnswered} / {questions.length} | Correct
        Answers: {correctAnswers}
      </h2>

      {submitted ? (
        <div className="score-section">
          <h3>🎉 Quiz Completed!</h3>
          <p>
            Questions Answered: {questionsAnswered} / {questions.length}
          </p>
          <p>
            Correct Answers: {correctAnswers} / {questions.length}
          </p>
          <button
            className="back-button"
            onClick={() => navigate("/training/Courses")}
          >
            ← Back to Courses
          </button>
        </div>
      ) : (
        <>
          <h3>Scenario {current + 1}</h3>
          <p>{questions[current].scenario}</p>

          <div className="options">
            {questions[current].options.map((option, index) => {
              let className = "";
              if (selectedOption !== null) {
                if (index === questions[current].correct) className = "correct";
                else if (
                  index === selectedOption &&
                  index !== questions[current].correct
                )
                  className = "incorrect";
              }
              return (
                <button
                  key={index}
                  className={className}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedOption !== null}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {feedback && <p className="feedback">{feedback}</p>}

          <button
            className="next-button"
            disabled={selectedOption === null}
            onClick={handleNextQuestion}
          >
            Next →
          </button>

          <button
            className="back-button"
            onClick={() => navigate("/training/Courses")}
          >
            ← Back to Courses
          </button>
        </>
      )}
    </div>
  );
}
