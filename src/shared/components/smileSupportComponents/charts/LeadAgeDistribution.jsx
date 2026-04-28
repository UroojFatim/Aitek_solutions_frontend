import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const COLORS = ["#16A34A", "#F97316", "#8B5CF6", "#3B82F6"];

const LeadAgeDistribution = ({ rows = [] }) => {
    const data = useMemo(() => {
        const buckets = { Hot: 0, Warm: 0, Aging: 0, Cold: 0 };
        const now = new Date();

        rows.forEach((r) => {
            if (!r.date_lead_received) return;
            const d = new Date(r.date_lead_received);
            if (isNaN(d.getTime())) return;
            const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
            if (diff <= 1) buckets.Hot += 1;
            else if (diff <= 7) buckets.Warm += 1;
            else if (diff <= 30) buckets.Aging += 1;
            else buckets.Cold += 1;
        });

        return Object.keys(buckets).map((k, i) => ({ name: k, value: buckets[k], fill: COLORS[i % COLORS.length] }));
    }, [rows]);

    const total = data.reduce((s, d) => s + d.value, 0);

    return (
        <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
            <CardBody>
                <Typography variant="small" className="mb-2 text-light-muted dark:text-dark-muted">
                    Lead Age Distribution
                </Typography>
                <div style={{ width: "100%", height: 300 }}>
                    {total === 0 ? (
                        <div className="flex h-full items-center justify-center text-xs text-light-muted dark:text-dark-muted">No data yet.</div>
                    ) : (
                        <ResponsiveContainer>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value">
                                    {data.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default LeadAgeDistribution;
