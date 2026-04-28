import { fetchServices } from "@/redux/actions/serviceOnboarding.actions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ROUTE_NAMES } from "@/constants/routes.constants";
import ServicePageWrapper from "@/shared/ServicePages/ServicePageWrapper";
import UnderConstruction from "@/shared/components/UnderConstruction/UnderConstruction";

const TrustedClinicalIt = () => {
  const dispatch = useDispatch();
  const [serviceDetail, setServiceDetail] = useState(null);

  const ServiceData = useSelector((state) => state.service_onboarding.pages);

  const SERVICE_NAME = ROUTE_NAMES.DASHBOARD.TRUSTED_CLINICAL_IT;

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
      lightLogo={<img
          src="/img/aitek_logo_light.png"
          alt="Aitek (light)"
          className="w-56 h-auto select-none"
          draggable="false"
        />}
      darkLogo={<img
          src="/img/aitek_logo_dark.png"
          alt="Aitek (dark)"
          className="w-56 h-auto select-none"
          draggable="false"
        />}
      isEnrollmentEnabled={false}
      activatedPageComponent={UnderConstruction}
    />
    </>
  )
}


export default TrustedClinicalIt;