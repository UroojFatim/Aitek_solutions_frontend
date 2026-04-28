import { fetchServices, trackServiceProgress } from "@/redux/actions/serviceOnboarding.actions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BrandEstablishmentLogo from "@/shared/components/serviceIcons/BrandEstablishmentLogo";
import { EnrollmentCompletionMessage } from "@/shared/ServicePages";
import { ROUTE_NAMES } from "@/constants/routes.constants";
import ServicePageWrapper from "@/shared/ServicePages/ServicePageWrapper";
import RoadMap from "./RoadMap";

const BrandEstablishment = () => {
  const dispatch = useDispatch();
  const [serviceDetail, setServiceDetail] = useState(null);

  const ServiceData = useSelector((state) => state.service_onboarding.pages);
  const { progressTracking } = useSelector(state => state.service_onboarding);

  // Get the service name from route constants dynamically
  const SERVICE_NAME = ROUTE_NAMES.DASHBOARD.BRAND_ESTABLISHMENT;

  // Step 1: Fetch services
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Step 2: Set service detail when ServiceData comes
  useEffect(() => {
    if (!ServiceData) return;

    const servicePage = ServiceData.find(
      (page) => page.name?.trim() === SERVICE_NAME?.trim()
    );
    setServiceDetail(servicePage || null);
  }, [ServiceData, SERVICE_NAME]);

  // Step 3: Dispatch progress tracking ONLY when serviceDetail is set
  useEffect(() => {
    if (serviceDetail?.id) {
      dispatch(trackServiceProgress(serviceDetail.id));
    }
  }, [serviceDetail, dispatch]);

  //  if (progressTracking?.total_sections && progressTracking.total_sections === progressTracking.completed_sections) {
  //   return <EnrollmentCompletionMessage />;
  // }

  return (
    <>
    <ServicePageWrapper
      serviceDetail={serviceDetail}
      lightLogo={<BrandEstablishmentLogo styling={{color: "white"}} />}
      darkLogo={<BrandEstablishmentLogo styling={{color: "black"}} />}
      isEnrollmentEnabled={true}
      activatedPageComponent={RoadMap}
    />
    </>
  );
};

export default BrandEstablishment;