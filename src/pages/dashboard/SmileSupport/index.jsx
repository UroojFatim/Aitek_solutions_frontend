import { fetchServices } from "@/redux/actions/serviceOnboarding.actions";
import ServicePageWrapper from "@/shared/ServicePages/ServicePageWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SmileSupportLogo from "@/shared/components/serviceIcons/SmileSupportLogo";
import { ROUTE_NAMES } from "@/constants/routes.constants";
import Trackers from "./Trackers";

const SmileSupportPage = () => {
  const dispatch = useDispatch();
  const [serviceDetail, setServiceDetail] = useState(null);

  const ServiceData = useSelector((state) => state.service_onboarding.pages);

  // Get the service name from route constants dynamically
  const SERVICE_NAME = ROUTE_NAMES.DASHBOARD.SMILE_SUPPORT;

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
    <ServicePageWrapper
      serviceDetail={serviceDetail}
      lightLogo={<SmileSupportLogo styling={{color: "white"}} />}
      darkLogo={<SmileSupportLogo styling={{color: "black"}} />}
      isEnrollmentEnabled={true}
      activatedPageComponent={Trackers}
    />
  );
};

export default SmileSupportPage;
