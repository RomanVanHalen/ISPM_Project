import React, { useMemo, useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer2 from "../../../components/Footer2";

import KPIs from "./KPIs";
import ExportButtons from "./ExportButtons";

import CompletionTrendChart from "./Charts/CompletionTrendChart";
import ComplianceGapsChart from "./Charts/ComplianceGapsChart";
import StatusBreakdownChart from "./Charts/StatusBreakdownChart";
import QuizScoreChart from "./Charts/QuizScoreChart";
import ReportTable from "./ReportTable";

import api from "../../../api/axiosInstance"; // ✅ use the same axios instance
import "../Styles/ComplianceReportingDashboard.css";

const fmt = new Intl.NumberFormat();

export default function ComplianceReportingDashboard() {
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Fetching admin progress data...");

        const res = await api.get("/admin/progress"); // use your axios instance
        const data = res.data;

        console.log("✅ Admin data received:", data);

        if (!data || !Array.isArray(data)) {
          setRows([]);
          setCourses([]);
        } else {
          const processedRows = processApiData(data);
          setRows(processedRows);

          const courseSet = new Set(processedRows.map((row) => row.course));
          setCourses(Array.from(courseSet));
        }
      } catch (err) {
        console.error("❌ Failed to fetch admin data:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message);
        setRows([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const processApiData = (data) => {
    const rows = [];
    data.forEach((user, userIndex) => {
      const userName = user?.name || user?.email || `User ${userIndex + 1}`;
      const userDetails = user?.details || [];

      userDetails.forEach((detail) => {
        if (!detail) return;
        let status = "In Progress";
        let completionRate = 0;
        let quizScore = detail.quizScore ?? 0;

        if (detail.status && typeof detail.status === "string") {
          if (detail.status.includes("/")) {
            const [completed, total] = detail.status.split("/").map(Number);
            completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
            status = completionRate === 100 ? "Compliant" : "In Progress";
            if (!quizScore) quizScore = completionRate;
          } else if (detail.status === "Compliant" || detail.status === "Completed") {
            status = "Compliant";
            completionRate = 100;
            if (!quizScore) quizScore = 100;
          } else if (detail.status === "Overdue") {
            status = "Overdue";
            completionRate = 0;
            if (!quizScore) quizScore = 0;
          }
        }

        const dueDate = detail.lastUpdated
          ? new Date(detail.lastUpdated).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10);

        rows.push({
          id: `${userName}-${Date.now()}-${Math.random()}`,
          dueDate,
          course: detail.title || "Unknown Course",
          type: detail.type || "Training",
          status,
          completionRate,
          quizScore,
          user: userName,
          ackPending: detail.ackPending ?? false,
        });
      });
    });

    return rows;
  };

  // Derived data
  const completionTrend = useMemo(
    () => rows.slice(0, 5).map((row, index) => ({
      date: row.dueDate,
      completion: row.completionRate,
      name: `Day ${index + 1}`,
    })),
    [rows]
  );

  const usersAccessedByCourse = useMemo(() => {
    const courseMap = {};
    rows.forEach((row) => {
      if (!courseMap[row.course]) courseMap[row.course] = new Set();
      courseMap[row.course].add(row.user);
    });
    return Object.entries(courseMap).map(([course, usersSet]) => ({
      course,
      gaps: usersSet.size,
    }));
  }, [rows]);

  const statusBreakdown = useMemo(() => {
    const statuses = ["Compliant", "In Progress", "Overdue"];
    return statuses.map((status) => ({
      name: status,
      value: rows.filter((row) => row.status === status).length,
    }));
  }, [rows]);

  const avgQuizByCourse = useMemo(() => {
    const courseMap = {};
    rows.forEach((row) => {
      if (!courseMap[row.course]) courseMap[row.course] = { sum: 0, count: 0 };
      courseMap[row.course].sum += row.quizScore;
      courseMap[row.course].count += 1;
    });
    return Object.entries(courseMap).map(([course, { sum, count }]) => ({
      course,
      avgScore: count > 0 ? Math.round(sum / count) : 0,
    }));
  }, [rows]);

  const kpis = useMemo(() => {
    const total = rows.length;
    const completed = rows.filter((r) => r.status === "Compliant").length;
    const pendingAck = rows.filter((r) => r.ackPending).length;
    const overdue = rows.filter((r) => r.status === "Overdue").length;
    const avgCompletion = total ? Math.round(rows.reduce((a, r) => a + r.completionRate, 0) / total) : 0;
    return { total, completed, pendingAck, overdue, avgCompletion };
  }, [rows]);

  const exportCSV = () => console.log("Export CSV not implemented yet.");
  const exportPDF = () => window.open("/progress/report", "_blank");

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="sa02-body">
        <div className="sa02-container">
          <header className="sa02-header">
            <div>
              <h1>Training & Compliance Reporting</h1>
              <p className="sa02-sub">Administrator Dashboard</p>
              {error && <div className="sa02-error">⚠ {error}</div>}
              <div className="sa02-debug">
                Debug: {rows.length} rows, {courses.length} courses loaded
              </div>
            </div>
            <ExportButtons exportCSV={exportCSV} exportPDF={exportPDF} />
          </header>

          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>Loading dashboard data...</div>
          ) : (
            <>
              <KPIs kpis={kpis} />
              <section className="sa02-charts">
                <CompletionTrendChart data={completionTrend} xKey="date" yKey="completion" label="Completion Rate" />
                <ComplianceGapsChart data={usersAccessedByCourse} />
                <StatusBreakdownChart data={statusBreakdown} />
                <QuizScoreChart data={avgQuizByCourse} xKey="course" yKey="avgScore" label="Avg Quiz Score" />
              </section>
              <ReportTable rows={rows} fmt={fmt} />
            </>
          )}
        </div>
      </div>
      <Footer2 />
    </div>
  );
}
