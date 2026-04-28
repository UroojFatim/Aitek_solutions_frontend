import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Select as MaterialSelect,
  Button,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, PencilIcon, NoSymbolIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useDispatch } from 'react-redux';
import { updateOnboardingSteps, fetchBusinessById } from '../../../../redux/actions/business.actions';
import { fetchBusinessStepDetails } from '@/redux/actions/onboarding.actions';
import { fetchBusinessServiceDetails } from '@/redux/actions/serviceOnboarding.actions';
import ViewStepDetailsModal from '../components/ViewStepDetailsModal';
import { BusinessServiceStatus, BusinessServiceStatusLabels } from '@/constants/services.constants';
import { OnboardingStatus, OnboardingStatusLabels } from '@/constants/onboarding.constants';
import { updateBusinessServices } from '@/redux/actions/services.actions';
import ViewServiceDetailsModal from '../components/ViewServiceDetailsModal';

const BusinessDetails = ({ selectedBusiness, handleOpenEdit }) => {
  const dispatch = useDispatch();
  const [pendingSteps, setPendingSteps] = useState({});
  const [pendingServiceStatuses, setPendingServiceStatuses] = useState({});
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isLoadingStepDetails, setIsLoadingStepDetails] = useState(false);
  const [viewServiceModalOpen, setViewServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoadingServiceDetails, setIsLoadingServiceDetails] = useState(false);


  const handleStepChange = (stepId, value) => {
    setPendingSteps({
      ...pendingSteps,
      [stepId]: parseInt(value)
    });
  };
  const handleServiceChange = (stepId, value) => {
    setPendingServiceStatuses({
      ...pendingServiceStatuses,
      [stepId]: parseInt(value)
    });
  };

  const handleOnboardingSaveChanges = () => {
    if (Object.keys(pendingSteps).length === 0) return;

    const steps = Object.entries(pendingSteps).map(([stepId, status]) => ({
      stepId,
      status
    }));

    dispatch(updateOnboardingSteps({
      businessId: selectedBusiness.id,
      steps,
      callback: () => {
        dispatch(fetchBusinessById(selectedBusiness.id));
        setPendingSteps({}); // Clear pending changes
      }
    }));
  };

  const handleServicesSaveChanges = () => {
    if (Object.keys(pendingServiceStatuses).length === 0) return;

    const businessServices = Object.entries(pendingServiceStatuses).map(([serviceId, status]) => ({
      serviceId,
      status
    }));

    dispatch(updateBusinessServices({
      businessId: selectedBusiness.id,
      businessServices,
      callback: () => {
        dispatch(fetchBusinessById(selectedBusiness.id));
        setPendingServiceStatuses({});
      }
    }));
  };

  const handleViewStep = async (step) => {
    try {
      setIsLoadingStepDetails(true);
      setSelectedStep(step);
      await dispatch(fetchBusinessStepDetails({
        stepId: step.id,
        businessId: selectedBusiness.id
      })).unwrap();
      setViewModalOpen(true);
    } catch (error) {
      console.error('Error fetching step details:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoadingStepDetails(false);
    }
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedStep(null);
  };

  const handleViewService = async (service) => {
    try {
      setIsLoadingServiceDetails(true);
      setSelectedService(service);
      await dispatch(fetchBusinessServiceDetails({
        serviceId: service.id,
        businessId: selectedBusiness.id
      })).unwrap();
      setViewServiceModalOpen(true);
    } catch (error) {
      console.error('Error fetching service details:', error);
      // toast.error("Failed to fetch service details");
    } finally {
      setIsLoadingServiceDetails(false);
    }
  };

  const handleCloseServiceModal = () => {
    setViewServiceModalOpen(false);
    setSelectedService(null);
  };


  if (!selectedBusiness) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12">
        <NoSymbolIcon className="w-16 h-16 text-gray-400 mb-4" />
        <Typography variant="h5" className="text-light-text dark:text-dark-text text-center">
          Please select a business to view details
        </Typography>
        <Typography className="text-light-muted dark:text-dark-muted text-center mt-2">
          Choose a business from the dropdown menu above
        </Typography>
      </div>
    );
  }

  const hasOnboardingChanges = Object.keys(pendingSteps).length > 0;
  const hasServicesChanges = Object.keys(pendingServiceStatuses).length > 0;

  return (
    <>
      {/* Client Account Details Card */}
      <Card className="mb-8 rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          className="flex items-center justify-between rounded-none p-6 !bg-light-surface dark:!bg-dark-surface"
        >
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Client Account Details
          </Typography>
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton variant="text" className="text-light-muted dark:text-dark-muted">
                <EllipsisVerticalIcon className="h-6 w-6" />
              </IconButton>
            </MenuHandler>
            <MenuList className="!bg-light-surface dark:!bg-dark-surface border-light-border dark:border-dark-border">
              <MenuItem
                className="flex items-center gap-2 text-light-text dark:text-dark-text hover:!bg-light-background dark:hover:!bg-dark-background"
                onClick={handleOpenEdit}
              >
                <PencilIcon className="h-4 w-4" /> Edit
              </MenuItem>
            </MenuList>
          </Menu>
        </CardHeader>
        <CardBody className="px-6 pt-0 !bg-light-surface dark:!bg-dark-surface">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="small" className="font-semibold text-light-muted dark:text-dark-muted">
                NPI Number:
              </Typography>
              <Typography className="text-light-text dark:text-dark-text">
                {selectedBusiness?.npi_number}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="font-semibold text-light-muted dark:text-dark-muted">
                Name:
              </Typography>
              <Typography className="text-light-text dark:text-dark-text">
                {selectedBusiness?.name}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="font-semibold text-light-muted dark:text-dark-muted">
                Phone:
              </Typography>
              <Typography className="text-light-text dark:text-dark-text">
                {selectedBusiness?.phone &&
                  `(${selectedBusiness.phone.slice(0, 3)}) ${selectedBusiness.phone.slice(3, 6)} - ${selectedBusiness.phone.slice(6, 10)}`}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="font-semibold text-light-muted dark:text-dark-muted">
                Email:
              </Typography>
              <Typography className="text-light-text dark:text-dark-text">
                {selectedBusiness?.email}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="font-semibold text-light-muted dark:text-dark-muted">
                Address:
              </Typography>
              <Typography className="text-light-text dark:text-dark-text">
                {selectedBusiness?.address}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Onboarding Steps Card */}
      <Card className="mb-8 rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-6 !bg-light-surface dark:!bg-dark-surface flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
        >
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Initial Onboarding Steps
          </Typography>
          <Button
            size="sm"
            className={`${hasOnboardingChanges ? 'bg-primary' : 'bg-gray-400'} hover:opacity-90 w-full sm:w-auto`}
            onClick={handleOnboardingSaveChanges}
            disabled={!hasOnboardingChanges}
          >
            Save Changes
          </Button>
        </CardHeader>

        <CardBody className="px-6 pt-0 !bg-light-surface dark:!bg-dark-surface">
          <div className="space-y-4">
            {selectedBusiness?.onboardingSteps?.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <Typography className="text-light-text dark:text-dark-text">
                  {step.step_name}
                </Typography>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  {(index === 0 || index === 1) && (
                    <IconButton
                      variant="text"
                      size="sm"
                      className="text-light-muted dark:text-dark-muted hover:text-primary"
                      onClick={() => handleViewStep(step)}
                      disabled={isLoadingStepDetails}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </IconButton>
                  )}
                  <div className="w-full sm:w-48">
                    <MaterialSelect
                      value={((pendingSteps[step.id] ?? step.status) ?? OnboardingStatus.NOT_STARTED).toString()}
                      onChange={(value) => handleStepChange(step.id, value)}
                      className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                      labelProps={{
                        className:
                          "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                      }}
                      menuProps={{
                        className: "!bg-light-surface dark:!bg-dark-surface",
                      }}
                    >
                      {Object.entries(OnboardingStatusLabels).map(([value, label]) => (
                        <Option
                          key={value}
                          value={value}
                          className="text-light-text dark:text-dark-text hover:!bg-light-background dark:hover:!bg-dark-background"
                        >
                          {label}
                        </Option>
                      ))}
                    </MaterialSelect>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="mb-8 rounded-xl border border-light-border dark:border-dark-border !bg-light-surface dark:!bg-dark-surface shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none p-6 !bg-light-surface dark:!bg-dark-surface flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
        >
          <Typography variant="h5" className="text-light-text dark:text-dark-text">
            Business Services
          </Typography>
          <Button
            size="sm"
            className={`${hasServicesChanges ? 'bg-primary' : 'bg-gray-400'} hover:opacity-90 w-full sm:w-auto`}
            onClick={handleServicesSaveChanges}
            disabled={!hasServicesChanges}
          >
            Save Changes
          </Button>
        </CardHeader>
        <CardBody className="px-6 pt-0 !bg-light-surface dark:!bg-dark-surface">
          <div className="space-y-4">
            {selectedBusiness?.services?.map((service) => (
              <div
                key={service.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <Typography className="text-light-text dark:text-dark-text">
                  {service.name}
                </Typography>


                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  {(service.name === "Brand Establishment" || service.name === "24/7 Smile Support") && (
                    <IconButton
                      variant="text"
                      size="sm"
                      className="text-light-muted dark:text-dark-muted hover:text-primary"
                      onClick={() => handleViewService(service)}
                      disabled={isLoadingServiceDetails}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </IconButton>
                  )}

                  <div className="w-full sm:w-48">
                    <MaterialSelect
                      value={((pendingServiceStatuses[service.id] ?? service.status) ?? BusinessServiceStatus.NOT_STARTED).toString()}
                      onChange={(value) => handleServiceChange(service.id, value)}
                      className="!text-light-text dark:!text-dark-text !bg-light-surface dark:!bg-dark-surface"
                      labelProps={{
                        className:
                          "!text-light-text dark:!text-dark-text peer-placeholder-shown:!text-light-text/70 dark:peer-placeholder-shown:!text-dark-text/70",
                      }}
                      menuProps={{
                        className: "!bg-light-surface dark:!bg-dark-surface",
                      }}
                    >
                      {Object.entries(BusinessServiceStatusLabels).map(([value, label]) => (
                        <Option
                          key={value}
                          value={value}
                          className="text-light-text dark:text-dark-text hover:!bg-light-background dark:hover:!bg-dark-background"
                        >
                          {label}
                        </Option>
                      ))}
                    </MaterialSelect>
                  </div>
                </div>

              </div>
            ))}
          </div>
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
              {selectedBusiness?.users?.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-light-background dark:hover:bg-dark-background transition-colors border-b border-light-border dark:border-dark-border"
                >
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    {user.role}
                    {user.status === 'deleted' && <span className="text-gray-500"> (Deleted)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* View Step Details Modal */}
      <ViewStepDetailsModal
        open={viewModalOpen}
        handleOpen={handleCloseViewModal}
        stepId={selectedStep?.id}
        businessId={selectedBusiness?.id}
      />


      <ViewServiceDetailsModal
        open={viewServiceModalOpen}
        handleOpen={handleCloseServiceModal}
        serviceId={selectedService?.id}
        businessId={selectedBusiness?.id}
      />

    </>
  );
};

export default BusinessDetails;
