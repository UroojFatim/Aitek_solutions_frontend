// src/components/google/components/stats/BookedStats.jsx
import React, { useMemo } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const BookedStats = ({ rows = [] }) => {
    const { totalAppointments, uniquePatients, locationsCount } = useMemo(() => {
        const totalAppointments = rows.length;

        const patientSet = new Set(
            rows.map((r) =>
                `${(r.first_name || "").toLowerCase()}|${(r.last_name || "").toLowerCase()}`
            )
        );

        const locationSet = new Set(
            rows.map((r) => (r.location || "Unknown").toString())
        );

        return {
            totalAppointments,
            uniquePatients: patientSet.size,
            locationsCount: locationSet.size,
        };
    }, [rows]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="bg-[#141414] text-white shadow-md">
                <CardBody className="space-y-1">
                    <Typography variant="small" className="text-gray-400">
                        Total Appointments
                    </Typography>
                    <Typography variant="h5" className="font-semibold">
                        {totalAppointments}
                    </Typography>
                </CardBody>
            </Card>

            <Card className="bg-[#141414] text-white shadow-md">
                <CardBody className="space-y-1">
                    <Typography variant="small" className="text-gray-400">
                        Unique Patients
                    </Typography>
                    <Typography variant="h5" className="font-semibold">
                        {uniquePatients}
                    </Typography>
                </CardBody>
            </Card>

            <Card className="bg-[#141414] text-white shadow-md">
                <CardBody className="space-y-1">
                    <Typography variant="small" className="text-gray-400">
                        Locations
                    </Typography>
                    <Typography variant="h5" className="font-semibold">
                        {locationsCount}
                    </Typography>
                </CardBody>
            </Card>
        </div>
    );
};

export default BookedStats;
