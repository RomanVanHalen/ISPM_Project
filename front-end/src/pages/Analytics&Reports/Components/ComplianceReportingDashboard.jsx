//Admin
import React, { useMemo, useState } from "react"; // ✅ removed unused useEffect

import Filters from "./Filters";
import KPIs from "./KPIs";
import ExportButtons from "./ExportButtons";

import CompletionTrendChart from "./Charts/CompletionTrendChart";
import ComplianceGapsChart from "./Charts/ComplianceGapsChart";
import StatusBreakdownChart from "./Charts/StatusBreakdownChart";
import QuizScoreChart from "./Charts/QuizScoreChart";

import ReportTable from "./ReportTable";
import "../Styles/ComplianceReportingDashboard.css";

const fmt = new Intl.NumberFormat();
const todayISO = () => new Date().toISOString().slice(0, 10);
const toISO = (d) => new Date(d).toISOString().slice(0, 10);

export default function ComplianceReportingDashboard() {
  const [rows] = useState([]);      // ✅ no setter until API is enabled
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return toISO(d);
  });
  const [dateTo, setDateTo] = useState(todayISO());
  const [course, setCourse] = useState("All");
  const [reportType, setReportType] = useState("management");
  const [courses] = useState([]);   // ✅ no setter until API is enabled

  // --- API fetch is commented, re-enable later ---

  // Filtered rows
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const withinDate =
        (!dateFrom || r.dueDate >= dateFrom) &&
        (!dateTo || r.dueDate <= dateTo);
      const courseOk = course === "All" || r.course === course;
      return withinDate && courseOk;
    });
  }, [rows, dateFrom, dateTo, course]);

  // KPIs
  const kpis = useMemo(() => {
    const total = filtered.length;
    const completed = filtered.filter((r) => r.status === "Compliant").length;
    const pendingAck = filtered.filter((r) => r.ackPending).length;
    const overdue = filtered.filter((r) => r.status === "Overdue").length;
    const avgCompletion = total
      ? Math.round(
          filtered.reduce((a, r) => a + r.completionRate, 0) / total
        )
      : 0;
    return { total, completed, pendingAck, overdue, avgCompletion };
  }, [filtered]);

  // Charts data (unchanged) ...
  const completionTrend = useMemo(() => {
    const map = new Map();
    for (const r of filtered) {
      const key = r.dueDate;
      if (!map.has(key)) map.set(key, { date: key, avg: 0, count: 0 });
      const e = map.get(key);
      e.avg += r.completionRate;
      e.count += 1;
    }
    return Array.from(map.values())
      .map((d) => ({ date: d.date, avg: Math.round(d.avg / d.count) }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [filtered]);

  const gapsByCourse = useMemo(() => {
    return courses.map((c) => ({
      course: c,
      gaps: filtered.filter((r) => r.course === c && r.status !== "Compliant").length
    }));
  }, [filtered, courses]);

  const statusBreakdown = useMemo(() => {
    const statuses = ["Compliant", "In Progress", "Overdue"];
    return statuses.map((s) => ({
      name: s,
      value: filtered.filter((r) => r.status === s).length
    }));
  }, [filtered]);

  const avgQuizByUser = useMemo(() => {
    const map = new Map();
    for (const r of filtered) {
      if (!map.has(r.user)) map.set(r.user, { user: r.user, total: 0, count: 0 });
      const e = map.get(r.user);
      e.total += r.quizScore;
      e.count += 1;
    }
    return Array.from(map.values()).map((v) => ({
      user: v.user,
      avgScore: Math.round(v.total / v.count),
    }));
  }, [filtered]);

  const exportCSV = () => {};
  const exportPDF = () => {};

  return (
    <div className="sa02-body">
      <div className="sa02-container">
        <header className="sa02-header">
          <div>
            <h1>Training & Compliance Reporting</h1>
            <p className="sa02-sub">Real-time dashboards, acknowledgments, and gap tracking</p>
          </div>
          <ExportButtons exportCSV={exportCSV} exportPDF={exportPDF} />
        </header>

        <Filters
          dateFrom={dateFrom} setDateFrom={setDateFrom}
          dateTo={dateTo} setDateTo={setDateTo}
          course={course} setCourse={setCourse}
          reportType={reportType} setReportType={setReportType}
          courses={["All", ...courses]}
        />

        <KPIs kpis={kpis} />

        <section className="sa02-charts">
          <CompletionTrendChart data={completionTrend} />
          <ComplianceGapsChart data={gapsByCourse} />
          <StatusBreakdownChart data={statusBreakdown} />
          <QuizScoreChart data={avgQuizByUser} />
        </section>

        <ReportTable rows={filtered} fmt={fmt} />
      </div>
    </div>
  );
}
