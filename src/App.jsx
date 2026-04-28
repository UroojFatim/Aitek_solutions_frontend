import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearRedirect, setLoading, setRedirectTo } from "./redux/reducers/auth.reducer.js";
import { validate } from "./redux/actions/auth.action.js";
import { fetchBusinessDetails } from "./redux/actions/business.actions.js";
import GlobalSpinner from "./shared/components/spinner/GlobalSpinner";
import { ROUTE_PATHS } from "./constants/routes.constants.js";
import { USER_ROLES } from "./constants/user.constants.js";
import { BusinessStatus } from "./constants/business.constants.js";
import { layoutRoutes, nonLayoutRoutes } from "./routes/index.js";
import { ChangePasswordModal } from "./shared/modals/index.js";
import MainLayout from "./layouts/layout.jsx";

// Function to get default route based on user role
const getDefaultRoute = (userRole) => {
  switch (userRole) {
    case USER_ROLES.ADMIN:
    case USER_ROLES.SUPER_ADMIN:
      return ROUTE_PATHS.ADMIN.DASHBOARD;
    case USER_ROLES.USER:
    case USER_ROLES.SUPER_USER:
      return ROUTE_PATHS.DASHBOARD.HOME;
    default:
      return ROUTE_PATHS.DASHBOARD.HOME;
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, redirectTo, isAuthenticated } = useSelector((state) => state.auth);
  const { businessDetails } = useSelector((state) => state.business);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showInitialPasswordModal, setShowInitialPasswordModal] = useState(false);

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
      dispatch(clearRedirect());
    }
  }, [redirectTo, navigate, dispatch]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(validate()).unwrap();
      } catch (error) {
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch, location.pathname]);

  // Check if user needs to change password (for all authenticated users)
  useEffect(() => {
    if (isAuthenticated && user && user.password_changed === false) {
      setShowInitialPasswordModal(true);
    } else {
      setShowInitialPasswordModal(false);
    }
  }, [isAuthenticated, user, location.pathname]);

  useEffect(() => {
    const loadBusinessDetails = async () => {
      if (isAuthenticated && user?.role?.toLowerCase() !== 'admin' && user?.role?.toLowerCase() !== 'superadmin') {
        try {
          await dispatch(fetchBusinessDetails()).unwrap();
        } catch (error) {
          console.error('Error fetching business details:', error);
        }
      }
    };

    loadBusinessDetails();
  }, [isAuthenticated, user?.role, dispatch]);

  // Handle redirect when business details are fetched and status is ONBOARDING
  useEffect(() => {
    if (businessDetails && businessDetails.status === BusinessStatus.ONBOARDING) {
      dispatch(setRedirectTo(ROUTE_PATHS.DASHBOARD.ONBOARDING));
    }
  }, [businessDetails, dispatch]);

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <GlobalSpinner />;
  }

  return (
    <>
      <GlobalSpinner />
      <Toaster />

      <Routes>
        {/* Root route handler */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(user?.role)} replace />
            ) : (
              <Navigate to={ROUTE_PATHS.AUTH.SIGN_IN} replace />
            )
          } 
        />

        {/* Non-layout routes (no sidebar/navbar) */}
        {nonLayoutRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<GlobalSpinner />}>
                <route.component />
              </Suspense>
            }
          />
        ))}

        {/* Layout routes (with sidebar/navbar) */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <MainLayout />
            ) : (
              <Navigate to={ROUTE_PATHS.AUTH.SIGN_IN} replace />
            )
          }
        >
          {layoutRoutes
            .filter(route => route.allowedRoles.includes(user?.role))
            .map((route) => (
              <Route
                key={route.path}
                path={route.path.replace('/', '')}
                element={
                  <Suspense fallback={<GlobalSpinner />}>
                    <route.component />
                  </Suspense>
                }
              />
            ))}
        </Route>
      </Routes>

      {/* Global Initial Password Change Modal */}
      <ChangePasswordModal
        open={showInitialPasswordModal}
        handleOpen={() => setShowInitialPasswordModal(!showInitialPasswordModal)}
        isInitialPasswordChange={true}
      />
    </>
  );
}

export default App;
