import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../../Styles/Charts.css";

export default function ComplianceGapsChart({ data }) {
  return (
    <div className="sa02-chart-card">
      <h3>Compliance Gaps by Course</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="course" interval={0} angle={-15} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="gaps" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
