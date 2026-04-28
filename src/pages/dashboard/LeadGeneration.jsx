import { fetchServices } from "@/redux/actions/serviceOnboarding.actions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ROUTE_NAMES } from "@/constants/routes.constants";
import LeadGenerationLogo from "@/shared/components/serviceIcons/LeadGenerationLogo";
import ServicePageWrapper from "@/shared/ServicePages/ServicePageWrapper";
import UnderConstruction from "@/shared/components/UnderConstruction/UnderConstruction";

const LeadGeneration = () => {
  const dispatch = useDispatch();
  const [serviceDetail, setServiceDetail] = useState(null);

  const ServiceData = useSelector((state) => state.service_onboarding.pages);

  // Get the service name from route constants dynamically
  const SERVICE_NAME = ROUTE_NAMES.DASHBOARD.LEAD_GENERATION;

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (!ServiceData) return;
    const servicePage = ServiceData.find(
      (page) => page.name?.trim() === SERVICE_NAME?.trim()
    );
    setServiceDetail(servicePage);
  }, [ServiceData, SERVICE_NAME]);

  return (
    <>
    <ServicePageWrapper
      serviceDetail={serviceDetail}
      lightLogo={<LeadGenerationLogo styling={{color: "white"}} />}
      darkLogo={<LeadGenerationLogo styling={{color: "black"}} />}
      isEnrollmentEnabled={false}
      activatedPageComponent={UnderConstruction}
    />
    </>
  );
};

export default LeadGeneration;