import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../../Styles/Charts.css";

export default function QuizScoreChart({ data }) {
  return (
    <div className="sa02-chart-card">
      <h3>Average Quiz Score by Employee</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data.slice(0, 15)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="user" interval={0} angle={-25} textAnchor="end" height={80}/>
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Bar dataKey="avgScore" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
