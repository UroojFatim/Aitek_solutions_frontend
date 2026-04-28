// src/components/google/components/charts/LeadByMonthBar.jsx
import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const MUTED_PURPLE = "#8B5CF6";

const LeadByMonthBar = ({ rows = [] }) => {
    const data = useMemo(() => {
        const map = new Map();

        rows.forEach((r) => {
            if (!r.date_lead_received) return;
            const d = new Date(r.date_lead_received);
            if (isNaN(d.getTime())) return;

            const y = d.getUTCFullYear();
            const m = String(d.getUTCMonth() + 1).padStart(2, "0");
            const key = `${y}-${m}`;
            const label = d.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
                timeZone: "UTC",
            });

            const cur = map.get(key) || { monthKey: key, monthLabel: label, total: 0 };
            cur.total += 1;
            map.set(key, cur);
        });

        return Array.from(map.values()).sort((a, b) =>
            a.monthKey.localeCompare(b.monthKey)
        );
    }, [rows]);

    return (
        <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
            <CardBody>
                <Typography variant="small" className="mb-2 text-light-muted dark:text-dark-muted">
                    Leads by Month
                </Typography>
                <div style={{ width: "100%", height: 300 }}>
                    {data.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-xs text-light-muted dark:text-dark-muted">
                            No data yet.
                        </div>
                    ) : (
                        <ResponsiveContainer>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="monthLabel" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="total" fill={MUTED_PURPLE} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default LeadByMonthBar;
