import { fetchServices } from "@/redux/actions/serviceOnboarding.actions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentCreationLogo from "@/shared/components/serviceIcons/ContentCreationLogo";
import { ROUTE_NAMES } from "@/constants/routes.constants";
import ServicePageWrapper from "@/shared/ServicePages/ServicePageWrapper";
import UnderConstruction from "@/shared/components/UnderConstruction/UnderConstruction";

const ContentCreation = () => {
  const dispatch = useDispatch();
  const [serviceDetail, setServiceDetail] = useState(null);

  const ServiceData = useSelector((state) => state.service_onboarding.pages);

  const SERVICE_NAME = ROUTE_NAMES.DASHBOARD.CONTENT_CREATION;

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
      lightLogo={<ContentCreationLogo styling={{color: "white"}} />}
      darkLogo={<ContentCreationLogo styling={{color: "black"}} />}
      isEnrollmentEnabled={false}
      activatedPageComponent={UnderConstruction}
    />
    </>
  );
};

export default ContentCreation;