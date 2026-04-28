import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinessServiceStatus } from "@/redux/actions/services.actions";
import { BusinessServiceStatus } from "@/constants/services.constants";
import ServiceUnassignedPage from "./SrviceUnassignedPage";
import ServiceOnboardingInitialPage from "./ServiceOnboardingInitialPage";
import ServiceAssignedPage from "./ServiceAssignedPage";
import ServiceCancelledPage from "./ServiceCancelledPage";
import ServiceCompletedPage from "./ServiceCompletedPage";

/**
 * ServicePageWrapper - Wrapper component that displays different service pages based on service status
 *
 * @param {Object} props
 * @param {Object} props.serviceDetail - Service detail object from service onboarding (contains id, name, description)
 * @param {React.Component} props.lightLogo - Logo component for dark mode
 * @param {React.Component} props.darkLogo - Logo component for light mode
 * @param {boolean} props.isEnrollmentEnabled - Whether enrollment is enabled
 * @param {React.Component} props.activatedPageComponent - Optional custom component to render when service is activated
 */
const ServicePageWrapper = ({
  serviceDetail,
  lightLogo,
  darkLogo,
  isEnrollmentEnabled,
  activatedPageComponent: ActivatedPageComponent
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const serviceStatusData = useSelector((state) => state.services.serviceStatus);
  useEffect(() => {
    // Fetch service status using the service ID from serviceDetail prop
    const fetchStatus = async () => {
      if (!serviceDetail?.id) {
        console.error("Service detail or service ID not provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await dispatch(fetchBusinessServiceStatus(serviceDetail.id));
      setIsLoading(false);
    };

    fetchStatus();
  }, [dispatch, serviceDetail?.id]);

  // If service status not found, show unassigned page
  if (!serviceStatusData) {
    return <ServiceUnassignedPage />;
  }

  // Get the service status
  const serviceStatus = serviceStatusData.status;

  // Render appropriate page based on status
  switch (serviceStatus) {
    case BusinessServiceStatus.UNASSIGNED:
      return <ServiceUnassignedPage />;

    case BusinessServiceStatus.INITIAL:
      return <ServiceAssignedPage />;

    case BusinessServiceStatus.ONBOARDING:
      return (
        <ServiceOnboardingInitialPage
          serviceDetail={serviceDetail}
          lightLogo={lightLogo}
          darkLogo={darkLogo}
          isEnrollmentEnabled={isEnrollmentEnabled}
        />
      );

    case BusinessServiceStatus.ACTIVATED:
      // Use custom activated page component if provided, otherwise fallback to ServiceAssignedPage
      return ActivatedPageComponent ? <ActivatedPageComponent /> : <ServiceAssignedPage />;

    case BusinessServiceStatus.DEACTIVATED:
      return <ServiceCancelledPage />;

    case BusinessServiceStatus.FINISHED:
      return <ServiceCompletedPage />;

    default:
      // Fallback to unassigned page for unknown status
      return <ServiceUnassignedPage />;
  }
};

export default ServicePageWrapper;
