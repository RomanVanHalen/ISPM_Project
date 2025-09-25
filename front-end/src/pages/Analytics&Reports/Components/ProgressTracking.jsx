// Employee
import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import api from "../../../api/axiosInstance";   // ✅ import axios instance
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../Styles/ProgressTracking.css";

// Components
import Header from "../../../components/Navbar";
import Footer from "../../../components/Footer2";

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
    const fetchProgress = async () => {
      try {
        // ✅ Get all scores from backend
        const res = await api.get("/score");
        const scores = res.data; // array of score objects

        // Example: compute quiz average
        let quizAvgScore = 0;
        if (scores.length > 0) {
          const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
          const totalMax = scores.reduce((sum, s) => sum + (s.total || 0), 0);
          quizAvgScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
        }

        // You can extend this with policies/trainings once you track them
        setUserProgress({
          policiesAcknowledged: 0,
          totalPolicies: 0,
          trainingsCompleted: 0,
          totalTrainings: 0,
          quizAvgScore,
          compliance: quizAvgScore, // for now use same as quiz average
          details: scores.map((s) => ({
            type: "Quiz",
            title: s.module,
            status: `${s.score}/${s.total}`,
            lastUpdated: new Date(s.updatedAt).toLocaleDateString(),
          })),
        });
      } catch (err) {
        console.error("❌ Failed to fetch progress:", err.response?.data || err.message);
      }
    };

    fetchProgress();
  }, []);

  // ✅ Generate PDF Report
  const downloadReport = () => {
    if (!userProgress) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("My Progress Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Quiz Average Score: ${userProgress.quizAvgScore}%`, 14, 35);
    doc.text(`Compliance: ${userProgress.compliance}%`, 14, 45);
    doc.text(
      `Policies Acknowledged: ${userProgress.policiesAcknowledged}/${userProgress.totalPolicies}`,
      14,
      55
    );
    doc.text(
      `Trainings Completed: ${userProgress.trainingsCompleted}/${userProgress.totalTrainings}`,
      14,
      65
    );

    // ✅ Add table for details
    autoTable(doc, {
     startY: 75,
     head: [["Item Type", "Title", "Status", "Last Updated"]],
     body: userProgress.details.map((item) => [
     item.type,
     item.title,
     item.status,
     item.lastUpdated,
   ]),
  });

    doc.save("progress_report.pdf");
  };

  if (!userProgress) return <p>Loading progress...</p>;

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
    <>
      <Header />

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
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
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
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
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

          {/* ✅ PDF download button */}
          <button className="sa01download-btn" onClick={downloadReport}>
            ⬇ Download My Report
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProgressTracking;




