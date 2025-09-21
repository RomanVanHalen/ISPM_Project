// src/pages/Training.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landpage.css";
import TrainingImg from "../images/Training.jpg";

function Training() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/training/Courses"); // redirect to Courses page
    };

    return (
        <div className="katraining-container">
            {/* Left Section */}
            <div className="katraining-left">
                <h1 className="katraining-title">
                    <span> Training Courses </span>
                </h1>
                <p className="katraining-text"> 
                    "Gain the knowledge and skills to navigate company policies
                     effectively. This training ensures employees act responsibly and
                     maintain workplace integrity."
                </p>

                <button className="katraining-btn" onClick={handleStart}>
                    START
                </button>

                <p className="katraining-footer">
                    Policy Awareness for a Safer Workplace.
                </p>
            </div>

            {/* Right Section */}
            <div className="katraining-right">
                <img
                    src={TrainingImg}
                    alt="Training"
                    className="katraining-image"
                />
            </div>
        </div>
    );
}

export default Training;