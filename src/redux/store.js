import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './reducers/business.reducer';
import servicesReducer from './reducers/services.reducer';
import { systemReducer } from './reducers/system.reducers';
import documentReducer from './reducers/document.reducer';
import authReducer from './reducers/auth.reducer';
import onboardingReducer from './reducers/onboarding.reducers';
import userReducer from './reducers/user.reducers';
import  businessOnboardingReducer  from './reducers/businessOnboarding.reducer';
import ghlBusinessReducer from './reducers/ghl_business.reducer';
import serviceOnboardingReducer from './reducers/serviceOnboarding.reducers'
import auditReducer from './reducers/audit.reducer';
import sheetsReducer from './reducers/sheets.reducer';
import userAuditReducer from "./reducers/userAudit.reducer";
import ghlReducer from './reducers/ghl.reducer';
import brandPlanReducer from "./reducers/brandPlan.reducer";
import brandTaskDocumentReducer from "./reducers/brandTaskDocument.reducer.js";

export const store = configureStore({
  reducer: {
    business: businessReducer,
    services: servicesReducer,
    system: systemReducer,
    documents: documentReducer,
    auth: authReducer,
    onboarding: onboardingReducer,
    user: userReducer,
    ghl_business: ghlBusinessReducer,
    businessOnboarding: businessOnboardingReducer,
    service_onboarding:serviceOnboardingReducer,
    audit: auditReducer,
    sheets: sheetsReducer,
    userAudit: userAuditReducer,
    ghl: ghlReducer,
    brandPlan: brandPlanReducer,
    brandTaskDocuments: brandTaskDocumentReducer,
    // Add other reducers here as needed
  },
});

export default store;