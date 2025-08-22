import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Reporting.css";
import Header from "../../components/Navbar";
import Footer from "../../components/Footer2";

// --- Utilities --------------------------------------------------------------
const fmt = new Intl.NumberFormat();
const todayISO = () => new Date().toISOString().slice(0, 10);
const toISO = (d) => new Date(d).toISOString().slice(0, 10);

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toCSV(rows) {
  const headers = [
    "User",
    "Course",
    "Status",
    "Completion %",
    "Acknowledgment Pending",
    "Completion Date",
    "Due Date",
    "Compliance Gap",
  ];
  const lines = rows.map((r) =>
    [
      r.user,
      r.course,
      r.status,
      r.completionRate,
      r.ackPending ? "Yes" : "No",
      r.completedOn || "",
      r.dueDate,
      r.gapReason || "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

// --- Mock Data --------------------------------------------------------------
const COURSES = [
  "Code of Conduct",
  "Data Privacy",
  "Anti-Harassment",
  "Cybersecurity Basics",
  "Workplace Safety",
];

function seedRows() {
  const users = Array.from({ length: 42 }, (_, i) => `User ${i + 1}`);
  const rows = [];
  for (const u of users) {
    for (const c of COURSES) {
      const due = new Date();
      due.setDate(due.getDate() + Math.floor(Math.random() * 30) - 10);
      const completionRate = Math.floor(Math.random() * 101);
      const completedOn = completionRate === 100 ? toISO(new Date()) : "";
      const status =
        completionRate === 100
          ? "Compliant"
          : due < new Date()
          ? "Overdue"
          : "In Progress";
      const ackPending = Math.random() < 0.2; // 20% need acknowledgment
      const gapReason =
        status !== "Compliant"
          ? status === "Overdue"
            ? "Past due"
            : "<100% complete"
          : "";
      rows.push({
        user: u,
        course: c,
        status,
        completionRate,
        ackPending,
        completedOn,
        dueDate: toISO(due),
        gapReason,
      });
    }
  }
  return rows;
}

// --- Component --------------------------------------------------------------
export default function ComplianceReportingDashboard() {
  const [rows, setRows] = useState(seedRows());
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return toISO(d);
  });
  const [dateTo, setDateTo] = useState(todayISO());
  const [course, setCourse] = useState("All");
  const [reportType, setReportType] = useState("management");

  // Simulate "real-time" updates by nudging random rows
  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) => {
        const next = [...prev];
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * next.length);
          const r = { ...next[idx] };
          if (Math.random() < 0.5 && r.completionRate < 100) {
            r.completionRate = Math.min(
              100,
              r.completionRate + 5 + Math.floor(Math.random() * 15)
            );
            if (r.completionRate === 100) {
              r.status = "Compliant";
              r.completedOn = todayISO();
              r.gapReason = "";
              r.ackPending = Math.random() < 0.1; // some still need ack
            } else if (new Date(r.dueDate) < new Date()) {
              r.status = "Overdue";
              r.gapReason = "Past due";
            } else {
              r.status = "In Progress";
              r.gapReason = "<100% complete";
            }
          }
          next[idx] = r;
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Filtered view
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

  // Charts data
  const completionTrend = useMemo(() => {
    const map = new Map();
    for (const r of filtered) {
      const key = r.dueDate;
      if (!map.has(key)) map.set(key, { date: key, avg: 0, count: 0 });
      const e = map.get(key);
      e.avg += r.completionRate;
      e.count += 1;
    }
    const arr = Array.from(map.values())
      .map((d) => ({ date: d.date, avg: Math.round(d.avg / d.count) }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
    return arr;
  }, [filtered]);

  const gapsByCourse = useMemo(() => {
    const byCourse = COURSES.map((c) => ({ course: c, gaps: 0 }));
    for (const r of filtered) {
      if (r.status !== "Compliant") {
        const idx = byCourse.findIndex((x) => x.course === r.course);
        byCourse[idx].gaps += 1;
      }
    }
    return byCourse;
  }, [filtered]);

  const statusBreakdown = useMemo(() => {
    const statuses = ["Compliant", "In Progress", "Overdue"];
    return statuses.map((s) => ({
      name: s,
      value: filtered.filter((r) => r.status === s).length,
    }));
  }, [filtered]);

  // Exports
  function exportCSV() {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const tag =
      course === "All"
        ? "all-courses"
        : course.replace(/\s+/g, "-").toLowerCase();
    downloadBlob(
      `compliance-report_${tag}_${dateFrom}_to_${dateTo}.csv`,
      blob
    );
  }

  function exportPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const title =
      reportType === "audit"
        ? "Audit Detail Report"
        : "Management Summary Report";

    doc.setFontSize(16);
    doc.text(title, 40, 40);
    doc.setFontSize(10);
    doc.text(`Date Range: ${dateFrom} to ${dateTo}`, 40, 60);
    doc.text(`Course: ${course}`, 40, 75);

    if (reportType === "management") {
      doc.setFontSize(12);
      doc.text("KPIs", 40, 105);
      doc.autoTable({
        startY: 115,
        head: [["Metric", "Value"]],
        body: [
          ["Total Assignments", fmt.format(kpis.total)],
          ["Compliant", fmt.format(kpis.completed)],
          ["Pending Acknowledgments", fmt.format(kpis.pendingAck)],
          ["Overdue", fmt.format(kpis.overdue)],
          ["Average Completion %", `${kpis.avgCompletion}%`],
        ],
        theme: "striped",
      });
    } else {
      // Audit detail: full table
      const head = [
        [
          "User",
          "Course",
          "Status",
          "Completion %",
          "Ack Pending",
          "Completed On",
          "Due Date",
          "Gap",
        ],
      ];
      const body = filtered.map((r) => [
        r.user,
        r.course,
        r.status,
        r.completionRate,
        r.ackPending ? "Yes" : "No",
        r.completedOn || "",
        r.dueDate,
        r.gapReason || "",
      ]);
      doc.autoTable({ startY: 95, head, body, styles: { fontSize: 8 } });
    }

    doc.save(
      `${title.replace(/\s+/g, "-").toLowerCase()}_${dateFrom}_to_${dateTo}.pdf`
    );
  }

  return (
    <div className="sa02-body">
      <Header/>
      <div className="sa02-container">
        <header className="sa02-header">
          <div>
            <h1>Training & Compliance Reporting</h1>
            <p className="sa02-sub">
              Real-time dashboards, acknowledgments, and gap tracking
            </p>
          </div>
          <div className="sa02-actions">
            <button
              className="sa02-btn"
              onClick={exportCSV}
              title="Export visible data to CSV"
            >
              Export CSV
            </button>
            <button
              className="sa02-btn sa02-btn-primary"
              onClick={exportPDF}
              title="Export report to PDF"
            >
              Export PDF
            </button>
          </div>
        </header>

        <section className="sa02-filters">
          <div className="sa02-filter">
            <label>Date from</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="sa02-filter">
            <label>Date to</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="sa02-filter">
            <label>Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="All">All Courses</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="sa02-filter">
            <label>Report preset</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="management">Management summary</option>
              <option value="audit">Audit detail</option>
            </select>
          </div>
        </section>

        <section className="sa02-kpis">
          <div className="sa02-kpi-card">
            <div className="sa02-kpi-label">Total Assignments</div>
            <div className="sa02-kpi-value">{fmt.format(kpis.total)}</div>
          </div>
          <div className="sa02-kpi-card">
            <div className="sa02-kpi-label">Compliant</div>
            <div className="sa02-kpi-value">{fmt.format(kpis.completed)}</div>
          </div>
          <div className="sa02-kpi-card">
            <div className="sa02-kpi-label">Avg Completion</div>
            <div className="sa02-kpi-value">{kpis.avgCompletion}%</div>
          </div>
          <div className="sa02-kpi-card">
            <div className="sa02-kpi-label">Pending Acknowledgments</div>
            <div className="sa02-kpi-value">
              {fmt.format(kpis.pendingAck)}
            </div>
          </div>
          <div className="sa02-kpi-card">
            <div className="sa02-kpi-label">Overdue</div>
            <div className="sa02-kpi-value sa02-kpi-alert">
              {fmt.format(kpis.overdue)}
            </div>
          </div>
        </section>

        <section className="sa02-charts">
          <div className="sa02-chart-card">
            <h3>Completion Trend (Avg % by Due Date)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={completionTrend}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="avg" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="sa02-chart-card">
            <h3>Compliance Gaps by Course</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={gapsByCourse}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="course"
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="gaps" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="sa02-chart-card">
            <h3>Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="sa02-table">
          <div className="sa02-table-head">
            <h3>Assignments ({fmt.format(filtered.length)})</h3>
            <div className="sa02-table-actions">
              <button className="sa02-btn" onClick={exportCSV}>
                Export Visible CSV
              </button>
              <button className="sa02-btn" onClick={exportPDF}>
                Export Visible PDF
              </button>
            </div>
          </div>
          <div className="sa02-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Completion %</th>
                  <th>Ack Pending</th>
                  <th>Completed On</th>
                  <th>Due Date</th>
                  <th>Gap</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={i}
                    className={r.status === "Overdue" ? "sa02-row-alert" : undefined}
                  >
                    <td>{r.user}</td>
                    <td>{r.course}</td>
                    <td>{r.status}</td>
                    <td>{r.completionRate}%</td>
                    <td>{r.ackPending ? "Yes" : "No"}</td>
                    <td>{r.completedOn}</td>
                    <td>{r.dueDate}</td>
                    <td>{r.gapReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="sa02-footer">
        </footer>
      </div>
      <Footer/>
    </div>
  );
}






