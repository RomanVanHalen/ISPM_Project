import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/WelcomePage.css";
import AnalyticsImg from "../Images/Analytics.jpg";

function Analytics() {
    const navigate = useNavigate();

    const handleView = () => {
        navigate("/reports&analytics/ProgressTracking"); // redirect to Progress Tracking page
    };

    return (
        <div className="aktraining-container">
            {/* Left Section */}
            <div className="aktraining-left">
                <h1 className="aktraining-title">
                    <span> Check Your Progress </span>
                </h1>
                <p className="aktraining-text">
                    "Track your training journey and monitor completed courses, 
                    pending lessons, and overall progress. Stay updated and 
                    achieve your training goals efficiently."
                </p>

                <button className="aktraining-btn" onClick={handleView}>
                    VIEW PROGRESS
                </button>

                <p className="aktraining-footer">
                    Stay motivated. Track. Learn. Succeed.
                </p>
            </div>

            {/* Right Section */}
            <div className="aktraining-right">
                <img
                    src={AnalyticsImg}
                    alt="Progress Tracking"
                    className="aktraining-image"
                />
            </div>
        </div>
    );
}

export default Analytics;
