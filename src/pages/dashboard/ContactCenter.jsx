import React from 'react';
import { PhoneCall, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const stats = [
  {
    title: 'Inbound calls today',
    value: '0',
    subtitle: 'Total',
    icon: <PhoneCall className="w-5 h-5 text-blue-500" />,
  },
  {
    value: '0 sec',
    subtitle: 'Avg. wait time',
    icon: <Clock className="w-5 h-5 text-yellow-500" />,
  },
  {
    title: 'Call metrics',
    value: '0 min',
    subtitle: (
      <div className="text-sm flex flex-col">
        <span className="text-red-500 font-medium">▲ 0% vs yday</span>
        <span>Average call time</span>
      </div>
    ),
    icon: <Clock className="w-5 h-5 text-red-500" />,
  },
  {
    value: '0%',
    subtitle: 'Calls resolved',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  {
    title: 'Abandoned today',
    value: '0',
    subtitle: 'Total',
    icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  },
  {
    value: '0%',
    subtitle: 'Abandonment rate',
    icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  },
  // other stats...
];



const topCallers = [
  { name: 'Tom B', count: 0 },
  { name: 'Ella P', count: 0 },
  { name: 'Mark D', count: 0 },
  { name: 'Gabby T', count: 0 },
  { name: 'Jason B', count: 0 },
  { name: 'Trey B', count: 0 },
];

const Card = ({ title, value, subtitle, icon }) => (
  <div className="p-5 rounded-xl bg-white dark:bg-dark-surface text-light-text dark:text-dark-text shadow hover:shadow-lg transition duration-300">
    {title && <h3 className="text-sm font-semibold text-gray-500 dark:text-dark-muted mb-1">{title}</h3>}
    <div className="flex items-center justify-between">
      <div className="text-3xl font-bold">{value}</div>
      {icon && <div className="ml-2">{icon}</div>}
    </div>
    <div className="mt-1 text-sm text-light-muted dark:text-dark-muted">{subtitle}</div>
  </div>
);

const ContactCenter = () => {
  return (
    <div className="min-h-screen p-6 bg-light-background dark:bg-dark-background">
      <h1 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">24×7 Smile Support</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} {...stat} />
        ))}

        {/* Most Calls Resolved Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-dark-surface text-light-text dark:text-dark-text shadow hover:shadow-md transition">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-dark-muted mb-4">Most calls resolved</h3>
          <ul className="space-y-2 text-sm">
            {topCallers.map((caller, idx) => (
              <li
                key={idx}
                className={`flex justify-between border-b border-light-border dark:border-dark-border pb-1 ${
                  idx === 0 ? 'font-bold text-green-600 dark:text-green-400' : ''
                }`}
              >
                <span>{caller.name}</span>
                <span className="font-semibold">{caller.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactCenter;
