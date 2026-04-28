import { fetchServices } from "@/redux/actions/serviceOnboarding.actions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WolfLabServicesLogo from "@/shared/components/serviceIcons/WolfLabServicesLogo";
import { ROUTE_NAMES } from "@/constants/routes.constants";
import ServicePageWrapper from "@/shared/ServicePages/ServicePageWrapper";
import UnderConstruction from "@/shared/components/UnderConstruction/UnderConstruction";

const WolfLabServices = () => {
  const dispatch = useDispatch();
  const [serviceDetail, setServiceDetail] = useState(null);

  const ServiceData = useSelector((state) => state.service_onboarding.pages);

  // Get the service name from route constants dynamically
  const SERVICE_NAME = ROUTE_NAMES.DASHBOARD.WOLF_LAB_SERVICES;

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (!ServiceData) return;

    const servicePage = ServiceData.find(
      (page) => page.name?.trim() === SERVICE_NAME?.trim()
    );
    setServiceDetail(servicePage);
  }, [ServiceData]);

  return (
    <>
    <ServicePageWrapper
      serviceDetail={serviceDetail}
      lightLogo={<WolfLabServicesLogo styling={{color: "white"}} />}
      darkLogo={<WolfLabServicesLogo styling={{color: "black"}} />}
      isEnrollmentEnabled={false}
      activatedPageComponent={UnderConstruction}
    />
    </>
  );
};

export default WolfLabServices;