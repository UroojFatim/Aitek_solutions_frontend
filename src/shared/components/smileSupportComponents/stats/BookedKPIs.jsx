import React, { useMemo, useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import AppointmentTrendsLine from "../charts/AppointmentTrendsLine";
import ConversionFunnel from "../charts/ConversionFunnel";

const BookedKPIs = ({ rows = [], initialPeriodDays = 30 }) => {
    const now = new Date();
    const [periodKey, setPeriodKey] = useState(String(initialPeriodDays)); // '30', '90', 'all'
    const periodDays = periodKey === 'all' ? null : Number(periodKey);

    const getDateOnly = (d) => {
        if (!d) return null;
        const dt = new Date(d);
        if (isNaN(dt)) return null;
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    };

    const { kpis, trendData, byLocation, funnel, usedPeriodLabel } = useMemo(() => {
        let startCurrent = null;
        let startPrev = null;
        let usedPeriodLabel = 'All time';

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
            const dd = getDateOnly(d);
            if (!start || !end) return true; // when periodDays === null (all time)
            return dd >= start && dd <= end;
        };

        let curr = { totalAppointments: 0, leads: 0, shown: 0, noShow: 0, treatment: 0, responseTimes: [] };
        let prev = { totalAppointments: 0 };

        const dateCounts = {}; // for trend
        const locations = {};

        rows.forEach((r) => {
            // Normalize dates: prefer explicit lead/scheduled dates, fallback to createdAt for leads
            const leadDate = r.date_lead_received || r.date_lead_recieved || r.createdAt || null;
            const schedDate = r.date_scheduled || r.appt_date || null;
            const showStatus = (r.show_status || "").toString();
            const treatmentStatus = (r.treatment_status || "").toString();

            // Count for previous period (by scheduled date presence) — only when using a bounded period
            if (periodDays && schedDate && inRange(schedDate, startPrev, new Date(startCurrent.getTime() - 1))) {
                prev.totalAppointments += 1;
            }

            // Current period (by scheduled date presence)
            if (schedDate && inRange(schedDate, startCurrent, now)) {
                curr.totalAppointments += 1;

                // trend by day
                const dayKey = getDateOnly(schedDate)?.toISOString().slice(0, 10);
                if (dayKey) dateCounts[dayKey] = (dateCounts[dayKey] || 0) + 1;

                // locations
                const loc = (r.location || "Unknown").toString();
                locations[loc] = (locations[loc] || 0) + 1;

                // show / noshow (match any 'show' word, and 'no show' variants)
                if (/\bshow\b/i.test(showStatus)) curr.shown += 1;
                if (/no[- ]?show/i.test(showStatus)) curr.noShow += 1;

                // treatment (treat 'in progress' as active)
                if (/active|completed|in progress|inprogress/i.test(treatmentStatus)) curr.treatment += 1;

                // response time (only if we have a lead date)
                if (leadDate && schedDate) {
                    const diffMs = new Date(schedDate) - new Date(leadDate);
                    if (!isNaN(diffMs)) curr.responseTimes.push(diffMs / (1000 * 60 * 60)); // hours
                }
            }

            // leads count (use lead received or createdAt as fallback)
            if (leadDate && inRange(leadDate, startCurrent, now)) {
                curr.leads += 1;
            }
        });

        // Prepare trend array
        let trendArr = [];
        if (periodDays) {
            for (let i = periodDays - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const key = getDateOnly(d)?.toISOString().slice(0, 10);
                trendArr.push({ date: key, count: dateCounts[key] || 0 });
            }
        } else {
            // All time -> show monthly counts for last 12 months
            const months = [];
            for (let m = 11; m >= 0; m--) {
                const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
                months.push(d.toISOString().slice(0, 7)); // YYYY-MM
            }

            const monthCounts = {};
            rows.forEach((r) => {
                const schedDate = r.date_scheduled || r.appt_date || null;
                if (!schedDate) return;
                const k = getDateOnly(schedDate)?.toISOString().slice(0, 7);
                if (k) monthCounts[k] = (monthCounts[k] || 0) + 1;
            });

            trendArr = months.map((k) => ({ date: k, count: monthCounts[k] || 0 }));
        }

        // KPIs
        const totalAppointments = curr.totalAppointments;
        const prevTotal = periodDays ? prev.totalAppointments : null; // only meaningful when periodDays is set
        const totalChangePct = prevTotal === null || prevTotal === 0 ? null : ((totalAppointments - prevTotal) / prevTotal) * 100;
        const bookingConversionRate = curr.leads === 0 ? null : (curr.totalAppointments / curr.leads) * 100;
        const showRate = curr.totalAppointments === 0 ? null : (curr.shown / curr.totalAppointments) * 100;
        const noShowRate = curr.totalAppointments === 0 ? null : (curr.noShow / curr.totalAppointments) * 100;
        const avgResponseHours = curr.responseTimes.length ? (curr.responseTimes.reduce((a, b) => a + b, 0) / curr.responseTimes.length) : null;
        const treatmentConv = curr.shown === 0 ? null : (curr.treatment / curr.shown) * 100;

        // by location array
        const byLocationArr = Object.keys(locations).map(k => ({ location: k, count: locations[k] }));

        // funnel
        const funnelStages = {
            leads: curr.leads,
            booked: curr.totalAppointments,
            showed: curr.shown,
            treatment: curr.treatment,
        };

        return {
            kpis: {
                totalAppointments,
                totalChangePct,
                bookingConversionRate,
                showRate,
                noShowRate,
                avgResponseHours,
                treatmentConv,
            },
            trendData: trendArr,
            byLocation: byLocationArr,
            funnel: funnelStages,
        };
    }, [rows, periodDays]);

    const fmtPct = (v) => (v === null || v === undefined ? '—' : `${(v).toFixed(1)}%`);
    const fmtNum = (v) => (v === null || v === undefined ? '—' : v);
    const fmtHours = (v) => (v === null || v === undefined ? '—' : `${Math.round(v * 10) / 10} hr`);

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

            {kpis.totalAppointments === 0 && periodKey !== 'all' && (
                <div className="p-3 rounded bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-center justify-between">
                    <div className="text-sm text-light-text dark:text-dark-text">No scheduled appointments in this period.</div>
                    <div>
                        <button onClick={() => setPeriodKey('all')} className="px-3 py-1 rounded bg-primary text-white text-sm">Show all time metrics</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Total Appointments</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{kpis.totalAppointments}</Typography>
                        <Typography variant="small" className="text-xs text-light-muted dark:text-dark-muted">{kpis.totalChangePct === null ? 'No prior data' : `${kpis.totalChangePct.toFixed(1)}% vs prior period`}</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Booking Conversion Rate</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtPct(kpis.bookingConversionRate)}</Typography>
                        <Typography variant="small" className="text-xs text-light-muted dark:text-dark-muted">Target: 20-40%</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Show Rate</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtPct(kpis.showRate)}</Typography>
                        <Typography variant="small" className={`text-xs ${kpis.showRate !== null && kpis.showRate > 80 ? 'text-emerald-400' : kpis.showRate !== null && kpis.showRate >= 70 ? 'text-amber-400' : 'text-red-400'}`}>Color coded</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">No-Show Rate</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtPct(kpis.noShowRate)}</Typography>
                        <Typography variant="small" className={`text-xs ${kpis.noShowRate !== null && kpis.noShowRate > 25 ? 'text-red-400' : 'text-light-muted dark:text-dark-muted'}`}>Alert if &gt; 25%</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Avg Lead Response Time</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtHours(kpis.avgResponseHours)}</Typography>
                        <Typography variant="small" className={`text-xs ${kpis.avgResponseHours !== null && kpis.avgResponseHours < 24 ? 'text-emerald-400' : 'text-light-muted dark:text-dark-muted'}`}>Target: &lt;24 hours</Typography>
                    </CardBody>
                </Card>

                <Card className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border border-light-border dark:border-dark-border shadow-sm">
                    <CardBody className="space-y-1">
                        <Typography variant="small" className="text-light-muted dark:text-dark-muted">Treatment Conversion Rate</Typography>
                        <Typography variant="h5" className="font-semibold text-light-text dark:text-dark-text">{fmtPct(kpis.treatmentConv)}</Typography>
                        <Typography variant="small" className="text-xs text-light-muted dark:text-dark-muted">Show → Treatment</Typography>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-light-surface dark:bg-dark-surface p-4 rounded border border-light-border dark:border-dark-border text-light-text dark:text-dark-text">
                    <Typography variant="small" className="text-light-muted dark:text-dark-muted">Appointment Volume (last 30 days)</Typography>
                    <div className="h-36">
                        <AppointmentTrendsLine data={trendData} />
                    </div>

                    <div className="mt-3">
                        <ConversionFunnel stages={funnel} />
                    </div>
                </div>

                <div className="bg-light-surface dark:bg-dark-surface p-4 rounded border border-light-border dark:border-dark-border text-light-text dark:text-dark-text">
                    <Typography variant="small" className="text-light-muted dark:text-dark-muted">By Location</Typography>
                    {byLocation.length ? (
                        <ul className="mt-2 text-sm space-y-1">
                            {byLocation.map((l) => (
                                <li key={l.location} className="flex justify-between"><span className="text-light-text dark:text-dark-text">{l.location}</span><span className="font-semibold text-light-text dark:text-dark-text">{l.count}</span></li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-xs text-light-muted dark:text-dark-muted mt-2">No location data</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default BookedKPIs;