import React from 'react';

const stageColors = ['#60a5fa', '#34d399', '#f59e0b', '#ef4444'];

const ConversionFunnel = ({ stages = {} }) => {
  // stages: { leads, booked, showed, treatment }
  const values = [stages.leads || 0, stages.booked || 0, stages.showed || 0, stages.treatment || 0];
  const max = Math.max(...values, 1);

  const labels = ['Leads Received', 'Appointments Booked', 'Patient Showed', 'Treatment Started'];

  return (
    <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-4 rounded text-light-text dark:text-dark-text">
      <div className="mb-2 text-sm text-light-muted dark:text-dark-muted">Conversion Funnel</div>
      <div className="space-y-2">
        {values.map((v, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-40 text-sm text-light-muted dark:text-dark-muted">{labels[idx]}</div>
            <div className="flex-1 bg-light-background dark:bg-dark-background h-4 rounded overflow-hidden">
              <div style={{ width: `${(v / max) * 100}%` }} className="h-4" title={`${v}`}>
                <div style={{ background: stageColors[idx], height: '100%' }} />
              </div>
            </div>
            <div className="w-12 text-right font-semibold text-light-text dark:text-dark-text">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionFunnel;