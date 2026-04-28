import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AppointmentTrendsLine = ({ data = [] }) => {
  // data: [{ date: 'YYYY-MM-DD', count: number }, ...]
  return (
    <div className="text-light-text dark:text-dark-text" style={{ width: '100%', height: 140 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" strokeOpacity={0.35} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
          <YAxis allowDecimals={false} tick={{ fill: '#6B7280' }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentTrendsLine;