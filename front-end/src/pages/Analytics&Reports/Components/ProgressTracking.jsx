//Employee
import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import "../Styles/ProgressTracking.css";

// ✅ Example static data (moved outside component so no dependency warning)
const exampleData = {
  policiesAcknowledged: 0,
  totalPolicies: 0,
  trainingsCompleted: 0,
  totalTrainings: 0,
  quizAvgScore: 0,
  compliance: 0,
  details: [],
};

// ✅ Animated number counter
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value || 0);
    const increment = end / (duration / 20);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(Math.floor(start));
    }, 20);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{displayValue}%</span>;
};

// ✅ Animated bar progress
const AnimatedBar = ({ progress }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(progress || 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="sa01progress-bar">
      <div
        className="sa01progress-fill"
        style={{ width: `${width}%`, transition: "width 1s ease-in-out" }}
      ></div>
    </div>
  );
};

const ProgressTracking = () => {
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    // For now, just set static data
    setUserProgress(exampleData);
  }, []); // ✅ no dependency warning now

  if (!userProgress) return null;

  const policyProgress =
    (userProgress.policiesAcknowledged / userProgress.totalPolicies) * 100 || 0;
  const trainingProgress =
    (userProgress.trainingsCompleted / userProgress.totalTrainings) * 100 || 0;

  const quizData = [
    { name: "Quiz Avg Score", value: userProgress.quizAvgScore || 0, fill: "#16a34a" },
  ];

  const complianceData = [
    { name: "Compliance", value: userProgress.compliance || 0, fill: "#16a34a" },
  ];

  return (
    <main className="sa01progress-container">
      <h2 className="sa01progress-title">📊 My Progress </h2>

      <div className="sa01progress-grid">
        {/* Policies */}
        <div className="sa01progress-card">
          <h4>Policies Acknowledged</h4>
          <AnimatedBar progress={policyProgress} />
          <p>
            {userProgress.policiesAcknowledged}/{userProgress.totalPolicies}
          </p>
        </div>

        {/* Trainings */}
        <div className="sa01progress-card">
          <h4>Trainings Completed</h4>
          <AnimatedBar progress={trainingProgress} />
          <p>
            {userProgress.trainingsCompleted}/{userProgress.totalTrainings}
          </p>
        </div>

        {/* Quiz Avg Score */}
        <div className="sa01progress-card sa01chart-card" style={{ position: "relative" }}>
          <h4>Quiz Avg Score</h4>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={12}
              data={quizData}
            >
              <RadialBar minAngle={15} clockWise dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            <AnimatedNumber value={userProgress.quizAvgScore} />
          </div>
        </div>

        {/* Compliance */}
        <div className="sa01progress-card sa01chart-card" style={{ position: "relative" }}>
          <h4>Compliance</h4>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              barSize={12}
              data={complianceData}
            >
              <RadialBar minAngle={15} clockWise dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            <AnimatedNumber value={userProgress.compliance} />
          </div>
        </div>
      </div>

      {/* Detailed Progress */}
      <div className="sa01progress-details">
        <h3>📖 Detailed Progress</h3>
        <table>
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Title</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {userProgress.details?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.type}</td>
                <td className="sa01highlight">{item.title}</td>
                <td>{item.status}</td>
                <td>{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="sa01download-btn">⬇ Download My Report</button>
      </div>
    </main>
  );
};

export default ProgressTracking;
