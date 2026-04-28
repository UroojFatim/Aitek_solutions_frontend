import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";

const websites_info = [
  { url: "www.mywebsite1.com", status: "Active" },
  { url: "www.mywebsite2.com", status: "In construction" },
];

export default function Websites() {
  const [campaigns] = useState([
    { url: "www.mywebsite1.com", budget: "$3,000" },
    { url: "www.mywebsite3.com", budget: "$4,000" },
    { url: "www.mywebsite6.com", budget: "$5,000" },
    { url: "www.mywebsite8.com", budget: "$7,000" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [newBudget, setNewBudget] = useState("");

  const handleBudgetIncrease = () => {
    toast.success("Budget increase request sent!");
    setModalOpen(false);
    setSelectedCampaign("");
    setNewBudget("");
  };

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 min-h-screen flex flex-col gap-10 bg-light-background dark:bg-dark-background transition-colors">
      <Toaster position="top-right" />

      <div className="flex flex-col gap-6">
        {/* Websites Section */}
        <Card className="w-full rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
          <CardHeader
            floated={false}
            shadow={false}
            className="flex items-center justify-between p-6 pb-2 bg-transparent"
          >
            <Typography variant="h5" className="text-light-text dark:text-dark-text">
              Websites
            </Typography>
            <div className="flex items-center gap-2 flex-wrap">
              <IconButton variant="text" size="sm" className="text-light-muted dark:text-dark-muted">
                <EllipsisVerticalIcon className="w-5 h-5" />
              </IconButton>
            </div>
          </CardHeader>
          <CardBody className="px-6 py-4 overflow-x-auto">
            <div className="min-w-[400px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-light-muted dark:text-dark-muted border-b border-light-border dark:border-dark-border">
                    <th className="py-3 text-left">Domain</th>
                    <th className="py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {websites_info.map((site, index) => (
                    <tr
                      key={index}
                      className="hover:bg-light-background dark:hover:bg-dark-background transition-colors border-b border-light-border dark:border-dark-border"
                    >
                      <td className="py-3 text-light-text dark:text-dark-text break-words max-w-[150px]">{site.url}</td>
                      <td className="py-3 text-light-text dark:text-dark-text">{site.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Campaigns Section */}
        <Card className="w-full rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-md">
          <CardHeader
            floated={false}
            shadow={false}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 pb-2 bg-transparent gap-3 sm:gap-0"
          >
            <Typography variant="h5" className="text-light-text dark:text-dark-text">
              Campaigns
            </Typography>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setModalOpen(true)}
                className="flex items-center justify-center gap-2 border-primary bg-primary shadow-none hover:shadow-none text-xs sm:text-sm md:text-base px-3 py-2 rounded min-w-[140px] sm:min-w-[auto] w-full sm:w-auto"
                color="light-blue"
              >
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Increase Budget
              </Button>
              <IconButton variant="text" size="sm" className="self-end">
                <EllipsisVerticalIcon className="w-5 h-5 text-light-muted dark:text-dark-muted" />
              </IconButton>
            </div>
          </CardHeader>

          <CardBody className="px-6 py-4 overflow-x-auto">
            <div className="min-w-[400px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-light-muted dark:text-dark-muted border-b border-light-border dark:border-dark-border">
                    <th className="py-3 text-left">Domain</th>
                    <th className="py-3 text-left">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <tr
                      key={index}
                      className="hover:bg-light-background dark:hover:bg-dark-background transition-colors border-b border-light-border dark:border-dark-border"
                    >
                      <td className="py-3 text-light-text dark:text-dark-text break-words max-w-[150px]">
                        {campaign.url}
                      </td>
                      <td className="py-3 text-light-text dark:text-dark-text break-words max-w-[100px]">
                        {campaign.budget}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal for Budget Increase */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-dark-background rounded-lg p-6 shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">Increase Budget</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1 text-light-text dark:text-dark-text">Select Campaign</label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="border border-light-border dark:border-dark-border rounded p-2 w-full bg-light-surface dark:bg-dark-background text-light-text dark:text-dark-text"
              >
                <option value="">Select a campaign</option>
                {campaigns.map((campaign, index) => (
                  <option key={index} value={campaign.url}>
                    {campaign.url}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 text-light-text dark:text-dark-text">New Budget</label>
              <Input
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                size="sm"
                className="w-full dark:text-[#ebeaea] placeholder:text-[#adadad]"
                placeholder="Enter budget"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleBudgetIncrease}
                className="mr-2 border-2 border-primary bg-transparent shadow-none hover:shadow-none hover:bg-primary text-light-text hover:text-dark-text dark:text-dark-text"
              >
                Submit Request
              </Button>
              <Button
                onClick={() => setModalOpen(false)}
                className="shadow-none hover:shadow-none bg-primary border-2 border-primary hover:bg-transparent hover:text-light-text dark:hover:text-dark-text"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
