// src/components/reporting/ReportTable.jsx
import React from "react";
import "../Styles/ReportTable.css";

export default function ReportTable({ rows, fmt }) {
  return (
    <section className="sa02-table">
      <div className="sa02-table-head">
        <h3>Assignments ({rows.length})</h3>
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
              <th>Quiz Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={r.status === "Overdue" ? "sa02-row-alert" : undefined}>
                <td>{r.user}</td>
                <td>{r.course}</td>
                <td>{r.status}</td>
                <td>{r.completionRate}%</td>
                <td>{r.ackPending ? "Yes" : "No"}</td>
                <td>{r.completedOn}</td>
                <td>{r.dueDate}</td>
                <td>{r.gapReason}</td>
                <td>{r.quizScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
