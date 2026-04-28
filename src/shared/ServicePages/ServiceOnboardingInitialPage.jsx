import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Typography } from "@material-tailwind/react";
import { fetchServiceDetails, trackServiceProgress } from '@/redux/actions/serviceOnboarding.actions';
import { ServiceOnboardingFormModal } from '@/shared/modals';
import { useTheme } from '@/context/ThemeContext';

const ServiceOnboardingInitialPage = ({ serviceDetail, lightLogo, darkLogo, isEnrollmentEnabled }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { darkMode } = useTheme();

  const handleOpenModal = async () => {
    try {
      await Promise.all([
        dispatch(fetchServiceDetails(serviceDetail.id)),
        dispatch(trackServiceProgress(serviceDetail.id))
      ]);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading step details:', error);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-24 bg-light-background dark:bg-dark-background flex flex-col gap-14">
      {/* Title */}
      <div className="mx-auto text-center max-w-3xl">
        <Typography
          variant="h2"
          className="text-light-text dark:text-dark-text font-bold text-2xl sm:text-3xl md:text-4xl"
        >
          Welcome to {serviceDetail?.name}
        </Typography>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 lg:gap-20">
        {/* Left Side - Logo */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-end">
          {darkMode ? lightLogo : darkLogo}
        </div>

        {/* Right Side - Button + Desc */}
        <div className="flex flex-col items-center md:items-start gap-6 w-full md:w-3/5 text-center md:text-left">
          <Button
            onClick={handleOpenModal}
            disabled={!isEnrollmentEnabled} // 👈 controlled by parent
            className={`font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-lg shadow-lg transition w-full sm:w-auto 
              ${isEnrollmentEnabled 
                ? 'bg-primary hover:bg-primary/90 text-white' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'}
            `}
          >
            Start Your Enrollment
          </Button>

          <div className="w-full max-w-lg dark:text-dark-text text-light-text leading-relaxed text-sm sm:text-base lg:text-lg">
            {serviceDetail?.description}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ServiceOnboardingFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ServiceOnboardingInitialPage;
