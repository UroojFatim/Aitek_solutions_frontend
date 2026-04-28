// src/components/google/components/charts/BookedShowStatusPie.jsx
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

const BookedShowStatusPie = ({ rows = [] }) => {
    const data = useMemo(() => {
        const map = new Map();
        rows.forEach((r) => {
            const key = normalize(r.show_status) || "unknown";
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
        <Card className="bg-[#141414] text-white shadow-md">
            <CardBody>
                <Typography variant="small" className="mb-2 text-gray-300">
                    Show Status Split
                </Typography>
                <div style={{ width: "100%", height: 260 }}>
                    {data.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-xs text-gray-500">
                            No data yet.
                        </div>
                    ) : (
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={90}
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

export default BookedShowStatusPie;
