// src/components/reporting/KPIs.jsx
import React from "react";
import "../Styles/KPIs.css";

export default function KPIs({ kpis }) {
  return (
    <section className="sa02-kpis">
      <div className="sa02-kpi-card">
        <div className="sa02-kpi-label">Total Assignments</div>
        <div className="sa02-kpi-value">{kpis.total}</div>
      </div>
      <div className="sa02-kpi-card">
        <div className="sa02-kpi-label">Compliant</div>
        <div className="sa02-kpi-value">{kpis.completed}</div>
      </div>
      <div className="sa02-kpi-card">
        <div className="sa02-kpi-label">Avg Completion</div>
        <div className="sa02-kpi-value">{kpis.avgCompletion}%</div>
      </div>
      <div className="sa02-kpi-card">
        <div className="sa02-kpi-label">Pending Acknowledgments</div>
        <div className="sa02-kpi-value">{kpis.pendingAck}</div>
      </div>
      <div className="sa02-kpi-card">
        <div className="sa02-kpi-label">Overdue</div>
        <div className="sa02-kpi-value sa02-kpi-alert">{kpis.overdue}</div>
      </div>
    </section>
  );
}
