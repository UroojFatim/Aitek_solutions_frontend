import { fetchBusinessDetails } from '@/redux/actions/business.actions';
import { fetchStepDetails, trackStepProgress } from '@/redux/actions/onboarding.actions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OnboardingStatus, OnboardingStatusLabels } from '@/constants/onboarding.constants';
import { CheckCircleIcon, ClockIcon, XCircleIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import OnboardingFormModal from './components/OnboardingFormModal';

const getStatusConfig = (status) => {
  switch (status) {
    case OnboardingStatus.COMPLETED:
      return {
        bgColor: 'bg-green-500/10',
        icon: <CheckCircleIcon className="w-4 h-4" />,
        textColor: 'text-green-500',
        borderColor: 'border-green-500',
        label: OnboardingStatusLabels[OnboardingStatus.COMPLETED]
      };
    case OnboardingStatus.IN_PROGRESS:
      return {
        bgColor: 'bg-blue-500/10',
        icon: <ArrowPathIcon className="w-4 h-4" />,
        textColor: 'text-blue-500',
        borderColor: 'border-blue-500',
        label: OnboardingStatusLabels[OnboardingStatus.IN_PROGRESS]
      };
    case OnboardingStatus.SKIPPED:
      return {
        bgColor: 'bg-gray-500/10',
        icon: <XCircleIcon className="w-4 h-4" />,
        textColor: 'text-gray-500',
        borderColor: 'border-gray-500',
        label: OnboardingStatusLabels[OnboardingStatus.SKIPPED]
      };
    default:
      return {
        bgColor: 'bg-amber-500/10',
        icon: <ClockIcon className="w-4 h-4" />,
        textColor: 'text-amber-500',
        borderColor: 'border-amber-500',
        label: OnboardingStatusLabels[OnboardingStatus.NOT_STARTED]
      };
  }
};

const OnboardingPage = () => {
  const dispatch = useDispatch();
  const { businessDetails } = useSelector((state) => state.business);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchBusinessDetails());
  }, [dispatch]);

  const handleOpenModal = async (step) => {
    try {
      await Promise.all([
        dispatch(fetchStepDetails(step.id)),
        dispatch(trackStepProgress(step.id))
      ]);
      
      setSelectedStep(step);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading step details:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedStep(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-16 bg-light-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Typography variant="h4" className="text-light-text dark:text-dark-text">
           {businessDetails?.name}
          </Typography>
          <Typography variant="h2" className="text-light-text dark:text-dark-text">
            Welcome to Onboarding
          </Typography>
          <Typography variant="paragraph" className="mt-2 text-light-muted dark:text-dark-muted">
            Let's walk through each step to launch and grow your clinic.
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...(businessDetails?.onboardingSteps || [])]
            .sort((a, b) => a.step_order - b.step_order)
            .map((step) => {
              const status = step.status || OnboardingStatus.NOT_STARTED;
              const statusConfig = getStatusConfig(status);
              
              return (
                <Card
                  key={step.id}
                  className="cursor-pointer hover:shadow-lg transition bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border"
                >
                  <CardBody className="p-6 flex flex-col gap-4">
                    {/* Top section: Step number and status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-14 min-w-[3.5rem] h-14 min-h-[3.5rem] rounded-full flex items-center justify-center font-semibold shadow-md bg-primary text-white select-none">
                        Step {step.step_order}
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.borderColor} ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Title and subtitle section */}
                    <div>
                      <Typography variant="h5" className="text-light-text dark:text-dark-text">
                        {step.step_title}
                      </Typography>
                      <Typography variant="small" className="text-light-text dark:text-dark-text mt-1">
                        {step.step_subtitle}
                      </Typography>
                    </div>

                    {/* Description section */}
                    <Typography variant="small" className="text-light-muted dark:text-dark-muted">
                      {step?.step_description}
                    </Typography>

                    {/* Start Here button - only show for first two steps and IN_PROGRESS status */}
                    {step.step_order <= 2 && status === OnboardingStatus.IN_PROGRESS && (
                      <button 
                        className="group flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                        onClick={(e) => {
                          handleOpenModal(step);
                        }}
                      >
                        <span className="border-b border-primary group-hover:border-primary/80">
                          Start Here
                        </span>
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </button>
                    )}
                  </CardBody>
                </Card>
              );
            })}
        </div>
      </div>

      <OnboardingFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default OnboardingPage; 