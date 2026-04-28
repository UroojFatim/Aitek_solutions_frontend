import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const BusinessDetails = () => {
  const { businessDetails } = useSelector((state) => state.business);

  return (
    <div className="grid gap-10">
      {/* Account Details */}
      <Card className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
        <CardHeader floated={false} shadow={false} className="flex items-center justify-between p-6 pb-2 bg-transparent">
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Account Details
          </Typography>
          <IconButton variant="text" size="sm">
            <EllipsisVerticalIcon className="w-5 h-5 text-light-muted dark:text-dark-muted" />
          </IconButton>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <table className="w-full text-sm">
            <tbody className="text-light-text dark:text-dark-text">
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-3 pr-4 font-medium">NPI Number:</td>
                <td className="py-3">{businessDetails?.npi_number}</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-3 pr-4 font-medium">Practice Name:</td>
                <td className="py-3">{businessDetails?.name}</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-3 pr-4 font-medium">Address:</td>
                <td className="py-3">{businessDetails?.address}</td>
              </tr>
              <tr className="border-b border-light-border dark:border-dark-border">
                <td className="py-3 pr-4 font-medium">Main Contact:</td>
                <td className="py-3">{businessDetails?.email}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Phone:</td>
                <td className="py-3">{businessDetails?.phone &&
    `(${businessDetails.phone.slice(0,3)}) ${businessDetails.phone.slice(3,6)} - ${businessDetails.phone.slice(6,10)}`}
</td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Services Enrolled */}
      <Card className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
        <CardHeader floated={false} shadow={false} className="flex items-center justify-between p-6 pb-2 bg-transparent">
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Services Enrolled
          </Typography>
        </CardHeader>
        <CardBody className="px-6 py-4 flex flex-wrap gap-3">
          {businessDetails?.services?.map((service) => (
            <span
              key={service.id}
              className="text-sm font-medium px-4 py-1 rounded-full border"
              style={{
                borderColor: "#ff0000",
                color: "#ff0000",
                backgroundColor: "#ff000010"
              }}
            >
              {service.name}
            </span>
          ))}
        </CardBody>
      </Card>

      {/* Account Users */}
      <Card className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
        <CardHeader floated={false} shadow={false} className="flex items-center justify-between p-6 pb-2 bg-transparent">
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Account Users
          </Typography>
          <IconButton variant="text" size="sm">
            <EllipsisVerticalIcon className="w-5 h-5 text-light-muted dark:text-dark-muted" />
          </IconButton>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <table className="w-full text-sm text-light-text dark:text-dark-text">
            <thead>
              <tr className="text-light-muted dark:text-dark-muted border-b border-light-border dark:border-dark-border">
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {businessDetails?.users?.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-light-background dark:hover:bg-dark-background transition-colors border-b border-light-border dark:border-dark-border"
                >
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default BusinessDetails; 