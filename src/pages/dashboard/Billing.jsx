import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { BoltIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const stats = {
  balanceDue: "$1,234.99",
  spendingThisMonth: "$1,045.00",
};

const invoices = [
  { month: "April 2025", amount: "$2,300" },
  { month: "Mar 2025", amount: "$1,500" },
];

const paymentMethods = [
  { card: "Visa ****1546", expiry: "07/27" },
];

export default function Billing() {
  return (
    <div className="p-6 md:p-10 min-h-screen bg-light-background dark:bg-dark-background transition-colors space-y-10">

      {/* Stat Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: "Balance Due", value: stats.balanceDue },
          { label: "Spending this month", value: stats.spendingThisMonth },
        ].map(({ label, value }) => (
          <Card
            key={label}
            className="rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-light-muted dark:text-dark-muted">
              <BoltIcon className="w-5 h-5" />
              <Typography className="font-semibold">{label}</Typography>
            </div>
            <Typography variant="h4" className="text-light-text dark:text-dark-text">
              {value}
            </Typography>
          </Card>
        ))}
      </div> */}

      {/* Invoices Section */}
      {/* <Card className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
        <CardHeader floated={false} shadow={false} className="flex items-center justify-between p-6 pb-2 bg-transparent">
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Invoices
          </Typography>
          <IconButton variant="text" size="sm">
            <EllipsisVerticalIcon className="w-5 h-5 text-light-muted dark:text-dark-muted" />
          </IconButton>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <table className="w-full text-sm text-light-text dark:text-dark-text">
            <tbody>
              {invoices.map((invoice, index) => (
                <tr
                  key={index}
                  className="border-b border-light-border dark:border-dark-border hover:bg-light-background dark:hover:bg-dark-background transition-colors"
                >
                  <td className="py-3">{invoice.month}</td>
                  <td className="py-3">{invoice.amount}</td>
                  <td className="py-3 text-right">
                    <a href="#" className="text-light-text dark:text-dark-text underline text-sm">
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card> */}

      {/* Payment Methods Section */}
      {/* <Card className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
        <CardHeader floated={false} shadow={false} className="flex items-center justify-between p-6 pb-2 bg-transparent">
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Payment Methods
          </Typography>
          <IconButton variant="text" size="sm">
            <EllipsisVerticalIcon className="w-5 h-5 text-light-muted dark:text-dark-muted" />
          </IconButton>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <table className="w-full text-sm text-light-text dark:text-dark-text">
            <tbody>
              {paymentMethods.map((method, index) => (
                <tr key={index} className="border-b border-light-border dark:border-dark-border">
                  <td className="py-3">{method.card}</td>
                  <td className="py-3">{method.expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card> */}

    Billing:UnderConsutruction
    </div>
  );
}
