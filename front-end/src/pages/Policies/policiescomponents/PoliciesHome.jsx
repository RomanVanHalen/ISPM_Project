import React from "react";
import Navbar from "../../../components/Navbar";
import "./PoliciesHome.css";
import PolicyImg from "../images/Awareness2.jpg";

function PoliciesHome({ onContinue }) {
    return (
        <div className="dee-container">
            <Navbar />

            <div className="dee-main">
                {/* Left Column - Text */}
                <div className="dee-left">
                    <h1 className="dee-title">
                        <span>Policies and Awareness</span>
                    </h1>
                    <p className="dee-text">
                        Welcome to the Policies Awareness training. This program helps you understand 
                        company policies, workplace safety, and best practices. By completing this 
                        training, you will gain the knowledge needed to act responsibly, comply with 
                        regulations, and contribute to a safe and ethical work environment
                    </p>

                    {/* Continue button */}
                    <section className="dee-actions">
                        <button
                            className="dee-btn"
                            onClick={onContinue}
                        >
                            Continue to Policies
                        </button>
                    </section>

                    <p className="dee-footer">
                        Policy Awareness for a Safer Workplace.
                    </p>
                </div>

                {/* Right Column - Image */}
                <div className="dee-right">
                    <img
                        src={PolicyImg}
                        alt="Policy Training"
                        className="dee-image"
                    />
                </div>
            </div>
        </div>
    );
}

export default PoliciesHome;

