import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "./Progresstab.css";
 // ✅ Import CSS file

export default function ProgressTab({ token }) {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchProgress = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/progress/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgressData(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [token]);

  if (loading) return <p>Loading progress...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!progressData) return <p>No progress data available.</p>;

  // ✅ Compliance chart calculation
  const compliance = Math.max(Math.min(progressData.compliance || 0, 100), 0); // clamp 0–100
  const complianceChartData = [
    { name: "Compliance", value: compliance },
    { name: "Remaining", value: 100 - compliance },
  ];

  // ✅ Green + White Theme
  const COMPLIANCE_COLORS = ["#4CAF50", "#FFFFFF"];

  return (
    <div className="dull-card-section">
      <h2>Overall Progress</h2>
      <p>
        Policies Acknowledged: {progressData.policiesAcknowledged || 0} /{" "}
        {progressData.totalPolicies || 0}
      </p>
      <p>
        Trainings Completed: {progressData.trainingsCompleted || 0} / {progressData.totalTrainings || 0}
      </p>
      <p>Quiz Average Score: {progressData.quizAvgScore || 0}%</p>
      <p>Compliance: {compliance}%</p>

      <h3>Compliance Score</h3>
      <div className="dew">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={complianceChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {complianceChartData.map((entry, index) => (
                <Cell key={`comp-${index}`} fill={COMPLIANCE_COLORS[index % COMPLIANCE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <h3>Detailed Progress:</h3>
      {progressData.details?.length > 0 ? (
        <ul>
          {progressData.details.map((d, idx) => (
            <li key={idx}>
              [{d.type}] {d.title} — {d.status} ({d.lastUpdated})
            </li>
          ))}
        </ul>
      ) : (
        <p>No detailed progress recorded.</p>
      )}
    </div>
  );
}
