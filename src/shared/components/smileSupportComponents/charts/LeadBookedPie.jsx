// src/components/google/components/charts/LeadBookedPie.jsx
import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const BOOKED_GREEN = "#16A34A";
const WOA_RED = "#D0021B";
const INFO_BLUE = "#3B82F6";
const MUTED_PURPLE = "#8B5CF6";
const ORANGE = "#F97316";
const CYAN = "#06B6D4";

const PIE_COLORS = [BOOKED_GREEN, WOA_RED, INFO_BLUE, MUTED_PURPLE, ORANGE, CYAN];

const normalize = (v) => String(v || "").trim().toLowerCase();

const LeadBookedPie = ({ rows = [] }) => {
    const data = useMemo(() => {
        const map = new Map();
        rows.forEach((r) => {
            const key = normalize(r.booked_status) || "unknown";
            map.set(key, (map.get(key) || 0) + 1);
        });

        return Array.from(map.entries()).map(([raw, value]) => ({
            name:
                raw === "unknown"
                    ? "Unknown"
                    : raw.replace(/\b\w/g, (c) => c.toUpperCase()),
            value,
        }));
    }, [rows]);

    return (
        <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
            <CardBody>
                <Typography variant="small" className="mb-2 text-light-muted dark:text-dark-muted">
                    Lead Booked Status
                </Typography>
                <div style={{ width: "100%", height: 300 }}>
                    {data.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-xs text-light-muted dark:text-dark-muted">
                            No data yet.
                        </div>
                    ) : (
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={80}
                                    label
                                >
                                    {data.map((_, idx) => (
                                        <Cell
                                            key={idx}
                                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default LeadBookedPie;
