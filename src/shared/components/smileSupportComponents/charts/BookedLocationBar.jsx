// src/components/google/components/charts/BookedLocationBar.jsx
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

const BOOKED_GREEN = "#16A34A";

const BookedLocationBar = ({ rows = [] }) => {
    const data = useMemo(() => {
        const map = new Map();
        rows.forEach((r) => {
            const loc = (r.location || "Unknown").toString();
            map.set(loc, (map.get(loc) || 0) + 1);
        });

        return Array.from(map.entries()).map(([location, count]) => ({
            location,
            count,
        }));
    }, [rows]);

    return (
        <Card className="bg-[#141414] text-white shadow-md">
            <CardBody>
                <Typography variant="small" className="mb-2 text-gray-300">
                    Appointments by Location
                </Typography>
                <div style={{ width: "100%", height: 260 }}>
                    {data.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-xs text-gray-500">
                            No data yet.
                        </div>
                    ) : (
                        <ResponsiveContainer>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="location" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill={BOOKED_GREEN} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default BookedLocationBar;
