import Table from "@/shared/components/table/Table";
import LeadStats from "./stats/LeadStats";
import LeadBookedPie from "./charts/LeadBookedPie";
import LeadCallStatusBar from "./charts/LeadCallStatusBar";
import LeadByMonthBar from "./charts/LeadByMonthBar";
import LeadAgeDistribution from "./charts/LeadAgeDistribution";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const LeadTrackerSection = ({ rows, loading }) => {

    const columns = [
        {
            header: "Date Lead Received", accessor: "date_lead_received", render: (r) => {
                const v = r.date_lead_received || r.createdAt || null;
                if (!v) return '—';
                const d = new Date(v);
                return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
            }
        },
        {
            header: "Date Lead Called", accessor: "date_lead_called", render: (r) => {
                const v = r.date_lead_called || r.date_lead_called || null;
                if (!v) return '—';
                const d = new Date(v);
                return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
            }
        },
        { header: "First Name", accessor: "first_name" },
        { header: "Last Name", accessor: "last_name" },
        { header: "Phone", accessor: "phone" },
        { header: "Procedure", accessor: "procedure" },
        { header: "Caller", accessor: "caller" },
        { header: "Location", accessor: "locations" },
        { header: "Call Status", accessor: "call_status" },
        { header: "Booked Status", accessor: "booked_status" },
        { header: "VA Call Note", accessor: "dental_va_call_note" },
        { header: "Time Lead Received", accessor: "time_lead_received" },
        { header: "Time Lead Called", accessor: "time_lead_called" },
        { header: "Timing", accessor: "timing" },
        { header: "DentalPro VA", accessor: "dentalpro_va" },
        { header: "Time Difference", accessor: "time_difference" },
        { header: "Notes", accessor: "notes" },
        { header: "Day 1 Note", accessor: "day1_note" },
        { header: "Day 2 Note", accessor: "day2_note" },
        { header: "Day 3 Note", accessor: "day3_note" },
        { header: "Day 4 Note", accessor: "day4_note" },
        { header: "Day 5 Note", accessor: "day5_note" },
        { header: "Day 6 Note", accessor: "day6_note" },
        { header: "Day 7 Note", accessor: "day7_note" },
        { header: "Callback 8", accessor: "callback_8" },
        { header: "Callback 9", accessor: "callback_9" },
        { header: "Callback 10", accessor: "callback_10" },
        { header: "Follow Up Note", accessor: "follow_up_note" },
    ];

    return (
        <div className="space-y-6">

            <LeadStats rows={rows} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <LeadBookedPie rows={rows} />
                <LeadCallStatusBar rows={rows} />
                <LeadAgeDistribution rows={rows} />
                <LeadByMonthBar rows={rows} />
            </div>

            <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                <CardBody>
                    <Typography variant="h6" className="text-light-text dark:text-dark-text">Lead Tracker</Typography>

                    <Table
                        columns={columns}
                        rows={rows}
                        loading={loading}
                    />
                </CardBody>
            </Card>
        </div>
    );
};

export default LeadTrackerSection;
