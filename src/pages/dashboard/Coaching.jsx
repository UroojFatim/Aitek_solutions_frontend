import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

const services = [
  {
    title: "LEAD MANAGEMENT: Keeping Your Consult Calendar Full",
    description: "Get exclusive access to Aitek Solutions’ proven marketing strategies designed to fill your consultation schedule efficiently. We’ll show you how to align your marketing efforts with front desk strategies to maximize the number of consults booked and ultimately, the number of cases closed.",
    available: true,
  },
  {
    title: "REMOTE CONSULTATIVE SALES: Closing Arches Over the Phone",
    description: "Turning a phone call into a booked, financially qualified patient takes skill. Our Aitek Solutions team has developed and refined a proven, scripted, approach that makes callers feel at ease, builds trust, and leads to higher case acceptance. Let us handle your new patient line and convert calls into real treatment opportunities.",
    available: true,
  },
  {
    title: "CONSISTENT CONTENT CREATION",
    description: "Branding is more than just a logo — it’s about storytelling. Our professional videography team will help capture your patients’ stories. From before-and-after photography to cinematic patient testimonial videos, we create high-quality content that turns viewers into booked appointments. The team will come back monthly to keep your content current and unique!",
    available: true,
  },
  {
    title: "IMPROVING YOUR LAB EFFIENCIES",
    description: "An efficient full arch practice isn’t just about leads — it’s about clinical efficiency too. Our team helps optimize in-house labs, workflows, and digital case planning, so your practice can deliver predictable, high-quality results at scale. Whether it’s refining your implant workflow, integrating intraoral scanners, or perfecting the art of staining and glazing, we ensure your practice is running at peak efficiency.",
    available: true,
  },
  {
    title: "SURGICAL OBSERVATION: Experience the ACE WAY, Firsthand!",
    description: "Join us in Chicago for an exclusive opportunity to observe Dr. Saeed in surgery and gain firsthand insight into the streamlined workflow of his practice. Spend time with the team to see how they manage patient consults, optimize logistics, and create a seamless clinical experience. You’ll walk away with practical strategies and key takeaways that you can implement in your own practice for greater efficiency and success!",
    available: false,
  },
];

const Coaching = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleOpen = () => setOpen(!open);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    // Add your form submission logic here
    setOpen(false); // close modal
    setFormData({ name: '', email: '', phone: '' }); // reset
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-light-background dark:bg-dark-background transition-colors">
      <Typography variant="h4" className="mb-6 text-light-text dark:text-dark-text text-center">
        Practice Growth
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card
            key={index}
            className="group transform transition-all duration-300 rounded-2xl border border-light-border dark:border-dark-border p-6 shadow-md bg-light-surface dark:bg-dark-surface flex items-start gap-4 hover:scale-[1.02] hover:border-[#ff0000] hover:shadow-[0_4px_20px_rgba(255,0,0,0.25)] hover:bg-[#ff0000]/5"
          >
            {/* {service.available ? (
              <CheckCircleIcon className="icon-transition h-6 w-6 mt-1" style={{ color: "#ff0000" }} />
            ) : (
              <ClockIcon className="icon-transition h-6 w-6 mt-1" style={{ color: "#ff0000" }} />
            )} */}
            <CardBody className="p-0">
              <Typography variant="h6" className="text-light-text dark:text-dark-text">
                {service.title}
              </Typography>
              <Typography className="text-sm mt-2 text-light-muted dark:text-dark-muted">
                {service.description}
              </Typography>
              {/* {!service.available && (
                <Typography className="text-xs mt-1" style={{ color: "#ff0000" }}>
                  Coming soon
                </Typography>
              )} */}

            </CardBody>
            <style jsx>{`
              .icon-transition {
                transition: color 0.3s ease;
              }
              .group:hover .icon-transition {
                color: #000000 !important;
              }
            `}</style>
          </Card>
        ))}
      </div>

      {/* Sign Up Button */}
      <Button
        onClick={handleOpen}
        className="flex items-center justify-center gap-2 border-primary bg-primary shadow-none hover:shadow-none text-xs sm:text-sm md:text-base px-3 py-2 rounded min-w-[140px] sm:min-w-[auto] w-full sm:w-auto mt-14 mx-auto"
        color="light-blue"
      >
        Sign up
      </Button>

      {/* Popup Modal */}
      <Dialog open={open} handler={handleOpen} className="bg-transparent shadow-none">
        <Card className="w-full mx-auto p-4 bg-light-surface text-light-text dark:bg-dark-surface dark:text-dark-text rounded-xl shadow-lg">
          <DialogHeader className="text-lg font-semibold dark:text-dark-text">
            How exciting!
          </DialogHeader>

          <DialogBody className="flex flex-col gap-4">
            <Typography className="text-sm text-light-muted dark:text-dark-muted">
              Let us know who we should contact to start this program with your practice.
            </Typography>

            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="!text-light-text dark:!text-dark-text"
              labelProps={{ className: "text-light-text dark:text-dark-text" }}
              color="red"
            />
            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="!text-light-text dark:!text-dark-text"
              labelProps={{ className: "text-light-text dark:text-dark-text" }}
              color="red"
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="!text-light-text dark:!text-dark-text"
              labelProps={{ className: "text-light-text dark:text-dark-text" }}
              color="red"
            />
          </DialogBody>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            {/* Cancel Button */}
            <Button
              onClick={handleOpen}
              className="bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Button>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="bg-[#ff0000] text-white hover:bg-red-600 transition-colors"
            >
              Submit
            </Button>
          </DialogFooter>

        </Card>
      </Dialog>


    </div>
  );
};

export default Coaching;
