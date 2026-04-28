import { Card, CardBody, Typography } from "@material-tailwind/react";
import Table from "@/shared/components/table/Table";
import BookedShowStatusPie from "./charts/BookedShowStatusPie";
import BookedLocationBar from "./charts/BookedLocationBar";
import BookedStats from "./stats/BookedStats";
import BookedKPIs from "./stats/BookedKPIs";

const BookedTrackerSection = ({ rows, loading }) => {

    const columns = [
        { header: "Date Received", accessor: "date_lead_received" },
        { header: "Date Scheduled", accessor: "date_scheduled" },
        { header: "Appt Date", accessor: "appt_date" },
        { header: "Appt Time", accessor: "appt_time" },
        { header: "First Name", accessor: "first_name" },
        { header: "Last Name", accessor: "last_name" },
        { header: "Phone", accessor: "phone" },
        { header: "Location", accessor: "location" },
        { header: "Procedure", accessor: "procedure" },
        { header: "Show Status", accessor: "show_status" },
        { header: "Treatment Status", accessor: "treatment_status" },
        { header: "Consult Notes", accessor: "clinic_notes_from_consult" },
        { header: "ATS Notes", accessor: "woa_notes" },
    ];
    return (
        <div className="space-y-6">

            <BookedKPIs rows={rows} />

            {/* Keep original summary / legacy stats for now */}
            {/* <BookedStats rows={rows} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BookedShowStatusPie rows={rows} />
                <BookedLocationBar rows={rows} />
            </div> */}

            <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                <CardBody>
                    <Typography variant="h6" className="text-light-text dark:text-dark-text">Booked Tracker</Typography>

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

export default BookedTrackerSection;
