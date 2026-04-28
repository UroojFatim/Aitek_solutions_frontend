import React, { useMemo, useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const normalize = (v) => String(v || "").trim().toLowerCase();

const fmtPct = (v) => (v === null || v === undefined ? "—" : `${(v).toFixed(1)}%`);
const fmtNum = (v) => (v === null || v === undefined ? "—" : v);
const fmtMinutes = (m) => (m === null || m === undefined ? "—" : (m < 60 ? `${Math.round(m)} min` : `${Math.round(m / 60 * 10) / 10} hr`));

const LeadStats = ({ rows = [], initialPeriodDays = 30 }) => {
    const now = new Date();
    const [periodKey, setPeriodKey] = useState(String(initialPeriodDays));
    const periodDays = periodKey === "all" ? null : Number(periodKey);

    const {
        kpis,
        usedPeriodLabel,
    } = useMemo(() => {
        // period window (for change vs prior)
        let startCurrent = null;
        let startPrev = null;
        let usedPeriodLabel = "All time";

        if (periodDays) {
            startCurrent = new Date(now);
            startCurrent.setDate(now.getDate() - periodDays + 1);
            startCurrent.setHours(0, 0, 0, 0);

            startPrev = new Date(startCurrent);
            startPrev.setDate(startCurrent.getDate() - periodDays);

            usedPeriodLabel = `${periodDays} days`;
        }

        const inRange = (d, start, end) => {
            if (!d) return false;
            const dd = new Date(d);
            if (isNaN(dd.getTime())) return false;
            if (!start || !end) return true;
            const dateOnly = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate());
            return dateOnly >= start && dateOnly <= end;
        };

        // Count totals
        let curr = {
            leads: 0,
            booked: 0,
            called: 0,
            contactedFirstCall: 0,
            totalCallAttemptsForLeads: 0, // sum of attempts per lead
            leadsWithAttemptsCounted: 0,
            timeDiffsMinutes: [],
        };

        let prev = { leads: 0 };

        rows.forEach((r) => {
            const leadDate = r.date_lead_received || r.createdAt || null;
            const calledDate = r.date_lead_called || null;

            // Determine if booked
            const bookedRaw = normalize(r.booked_status);
            const isBooked = bookedRaw === "booked" || bookedRaw === "scheduled" || bookedRaw === "scheduled";

            // Count previous period
            if (periodDays && leadDate && inRange(leadDate, startPrev, new Date(startCurrent.getTime() - 1))) {
                prev.leads += 1;
            }

            // Current period by lead received
            if (leadDate && inRange(leadDate, startCurrent, now)) {
                curr.leads += 1;
                if (isBooked) curr.booked += 1;
                if (calledDate) curr.called += 1;

                // first call contact rate: contacted on first call and no day2_note
                const callStatus = normalize(r.call_status);
                const day2 = (r.day2_note || r.day_2_note);
                if (callStatus === "contacted" && !day2) curr.contactedFirstCall += 1;

                // call attempts count across day1..day7 and callback_8..10
                const attemptFields = [
                    "day1_note",
                    "day2_note",
                    "day3_note",
                    "day4_note",
                    "day5_note",
                    "day6_note",
                    "day7_note",
                    "callback_8",
                    "callback_9",
                    "callback_10",
                ];
                const attempts = attemptFields.reduce((acc, key) => acc + (String(r[key] || "").trim() ? 1 : 0), 0);
                curr.totalCallAttemptsForLeads += attempts;
                curr.leadsWithAttemptsCounted += 1;

                // response time: prefer time_difference if present (assumed minutes), else compute using date+time
                let td = null;
                if (r.time_difference) {
                    const parsed = Number(r.time_difference);
                    if (!isNaN(parsed)) td = parsed; // assume minutes
                } else if (r.time_lead_received && r.time_lead_called && r.date_lead_received && r.date_lead_called) {
                    try {
                        const start = new Date(`${r.date_lead_received}T${r.time_lead_received}`);
                        const end = new Date(`${r.date_lead_called}T${r.time_lead_called}`);
                        const diffMin = (end - start) / (1000 * 60);
                        if (!isNaN(diffMin)) td = diffMin;
                    } catch (e) {
                        td = null;
                    }
                }
                if (td !== null) curr.timeDiffsMinutes.push(td);
            }
        });

        const totalLeads = curr.leads;
        const prevLeads = periodDays ? prev.leads : null;
        const totalChangePct = prevLeads === null || prevLeads === 0 ? null : ((totalLeads - prevLeads) / prevLeads) * 100;

        const leadToBookingRate = totalLeads === 0 ? null : (curr.booked / totalLeads) * 100;
        const avgResponseMin = curr.timeDiffsMinutes.length ? curr.timeDiffsMinutes.reduce((a, b) => a + b, 0) / curr.timeDiffsMinutes.length : null;
        const firstCallContactRate = curr.called === 0 ? null : (curr.contactedFirstCall / curr.called) * 100;
        const avgCallAttemptsPerLead = curr.leadsWithAttemptsCounted === 0 ? null : (curr.totalCallAttemptsForLeads / curr.leadsWithAttemptsCounted);

        // Stale Lead Rate (across all rows): leads older than 30 days with no booking / leads with no booking
        const staleCutoff = new Date();
        staleCutoff.setDate(now.getDate() - 30);
        let staleCount = 0;
        let unbookedCount = 0;
        rows.forEach((r) => {
            const ld = r.date_lead_received ? new Date(r.date_lead_received) : null;
            const bookedRaw = normalize(r.booked_status);
            const booked = bookedRaw === "booked" || bookedRaw === "scheduled";
            if (!booked) {
                unbookedCount += 1;
                if (ld && ld < staleCutoff) staleCount += 1;
            }
        });
        const staleRate = unbookedCount === 0 ? null : (staleCount / unbookedCount) * 100;

        return {
            kpis: {
                totalLeads: totalLeads,
                totalChangePct,
                leadToBookingRate,
                avgResponseMin,
                firstCallContactRate,
                avgCallAttemptsPerLead,
                staleRate,
            },
            usedPeriodLabel,
        };
    }, [rows, periodDays]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-light-muted dark:text-dark-muted">Showing: <span className="font-semibold text-light-text dark:text-dark-text">{periodKey === 'all' ? 'All time' : `${periodKey} days`}</span></div>
                <div className="flex gap-2">
                    <button onClick={() => setPeriodKey('30')} className={`px-3 py-1 rounded text-sm border border-light-border dark:border-dark-border ${periodKey === '30' ? 'bg-primary text-white border-primary' : 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text'}`}>30d</button>
                    <button onClick={() => setPeriodKey('90')} className={`px-3 py-1 rounded text-sm border border-light-border dark:border-dark-border ${periodKey === '90' ? 'bg-primary text-white border-primary' : 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text'}`}>90d</button>
                    <button onClick={() => setPeriodKey('all')} className={`px-3 py-1 rounded text-sm border border-light-border dark:border-dark-border ${periodKey === 'all' ? 'bg-primary text-white border-primary' : 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text'}`}>All time</button>
                </div>
            </div>

            {kpis.totalLeads === 0 && periodKey !== 'all' && (
                <div className="p-3 rounded bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-center justify-between">
                    <div className="text-sm text-light-text dark:text-dark-text">No leads received in this period.</div>
                    <div>
                        <button onClick={() => setPeriodKey('all')} className="px-3 py-1 rounded bg-primary text-white text-sm">Show all time metrics</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Total Leads</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtNum(kpis.totalLeads)}</Typography>
                        <Typography variant="small" className="text-xs text-light-muted dark:text-dark-muted">{kpis.totalChangePct === null ? 'No prior data' : `${kpis.totalChangePct.toFixed(1)}% vs prior period`}</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Lead → Booking Conversion</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtPct(kpis.leadToBookingRate)}</Typography>
                        <Typography variant="small" className="text-xs text-light-muted dark:text-dark-muted">Target: 30-50%</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Avg Lead Response Time</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtMinutes(kpis.avgResponseMin)}</Typography>
                        <Typography variant="small" className={`text-xs ${kpis.avgResponseMin !== null && kpis.avgResponseMin < 5 ? 'text-emerald-400' : kpis.avgResponseMin !== null && kpis.avgResponseMin <= 30 ? 'text-amber-400' : 'text-red-400'}`}>Target: &lt;5 min</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">First Call Contact Rate</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtPct(kpis.firstCallContactRate)}</Typography>
                        <Typography variant="small" className="text-xs text-light-muted dark:text-dark-muted">Measures call effectiveness</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Avg Call Attempts per Lead</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{kpis.avgCallAttemptsPerLead === null ? '—' : kpis.avgCallAttemptsPerLead.toFixed(1)}</Typography>
                        <Typography variant="small" className="text-xs text-light-muted dark:text-dark-muted">Avg attempts</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Stale Lead Rate</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtPct(kpis.staleRate)}</Typography>
                        <Typography variant="small" className={`text-xs ${kpis.staleRate !== null && kpis.staleRate > 20 ? 'text-red-400' : 'text-light-muted dark:text-dark-muted'}`}>Alert if &gt; 20%</Typography>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default LeadStats;
