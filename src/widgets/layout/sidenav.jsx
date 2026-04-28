import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/actions/auth.action";
import { USER_ROLES } from "@/constants/user.constants";
import { layoutRoutes } from "@/routes";
import { ROUTE_PATHS } from "@/constants/routes.constants";

export function Sidenav({ brandImg, brandName }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;

  const dispatch1 = useDispatch();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { businessDetails } = useSelector((state) => state.business);

  const isAdmin =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN;

  const isUserRole =
    user?.role === USER_ROLES.USER || user?.role === USER_ROLES.SUPER_USER;

  const isOnlyUser = user?.role === USER_ROLES.USER;

  const businessStatus = String(businessDetails?.status || "").toLowerCase();
  const isOnboardingStatus = businessStatus === "onboarding";
  const isActiveStatus = businessStatus === "active";

  /**
   * ✅ Updated dropdowns:
   * - userManagement (client side: Manage Users + User Audit)
   * - services (client side: service routes)
   * - clientsManagement (admin side: Client Accounts + User Management)
   */
  const [openSections, setOpenSections] = useState({
    userManagement: false,
    services: false,
    clientsManagement: false,
  });

  // Close sidenav on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 1280 && openSidenav) {
      setOpenSidenav(dispatch, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    dispatch1(logout());
  };

  // Routes allowed for current role
  const routes = useMemo(() => {
    return (layoutRoutes || []).filter((route) =>
      route.allowedRoles?.includes(user?.role)
    );
  }, [user?.role]);

  // Business services (name list lowercased) for "User" role restriction
  const businessServiceNames = useMemo(() => {
    return (businessDetails?.services || []).map((s) =>
      (s?.name || "").toLowerCase()
    );
  }, [businessDetails?.services]);

  // Check if a service exists AND is ACTIVE
  const isServiceActive = (serviceName) => {
    const s = (businessDetails?.services || []).find(
      (x) => (x?.name || "").toLowerCase() === serviceName.toLowerCase()
    );

    const status = s?.status;
    const active =
      String(status).toLowerCase() === "active" || status === 4 || status === true;

    return Boolean(s) && active;
  };

  /**
   * ✅ Lead Management should show ONLY if:
   * - client side (User + SuperUser)
   * - business status is ACTIVE (NOT onboarding)
   * - required services are ACTIVE
   */
  const shouldShowLeadManagement = useMemo(() => {
    if (isAdmin) return false;
    if (!isUserRole) return false;
    if (!isActiveStatus) return false; // ✅ IMPORTANT: hide on onboarding

    return (
      isServiceActive("Lead Generation") ||
      isServiceActive("24/7 Smile Support") ||
      isServiceActive("Consult Coaching")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isUserRole, isActiveStatus, businessDetails?.services]);

  /**
   * ✅ Filter routes for nav visibility + status rules
   *
   * RULES YOU ASKED:
   * 1) When status = onboarding -> show ONLY "Onboarding" + "Account"
   * 2) Do NOT show Lead Management when status = onboarding
   * 3) When status = active -> hide Onboarding page from nav
   */
  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      if (route.showInNav === false) return false;

      const routeName = (route.name || "").toLowerCase();

      // ✅ If onboarding status: show ONLY onboarding + account (for non-admin)
      if (!isAdmin && isOnboardingStatus) {
        return routeName === "onboarding" || routeName === "account";
      }

      // ✅ Lead Management rule (only when business is active)
      if (routeName === "lead management") {
        return shouldShowLeadManagement;
      }

      // ✅ Hide Onboarding from nav when Active (everyone)
      if (routeName === "onboarding" && isActiveStatus) {
        return false;
      }

      // ✅ Non-admin and business NOT active (and not onboarding) -> only allow account + onboarding
      // (kept as safety for other statuses like inactive/suspended)
      if (!isAdmin && !isActiveStatus) {
        return routeName === "account" || routeName === "onboarding";
      }

      // ✅ For "User" role only, restrict service routes by business services list
      if (isOnlyUser && route.isServiceRoute) {
        if (!businessDetails) return false;

        const key = (route.serviceKey || route.name || "").toLowerCase();
        return businessServiceNames.includes(key);
      }

      return true;
    });
  }, [
    routes,
    isAdmin,
    isOnlyUser,
    businessDetails,
    businessServiceNames,
    isOnboardingStatus,
    isActiveStatus,
    shouldShowLeadManagement,
  ]);

  // ---------------- GROUPING LOGIC ----------------

  // CLIENT SIDE: Services dropdown
  const serviceRoutes = useMemo(() => {
    return filteredRoutes.filter((route) => route.isServiceRoute);
  }, [filteredRoutes]);

  // CLIENT SIDE: User management dropdown
  const userManagementRoutes = useMemo(() => {
    return filteredRoutes.filter(
      (route) =>
        route.path === ROUTE_PATHS.DASHBOARD.MANAGE_USERS ||
        route.path === ROUTE_PATHS.DASHBOARD.USER_AUDIT
    );
  }, [filteredRoutes]);

  // ADMIN SIDE: Clients Management dropdown
  const adminClientsManagementRoutes = useMemo(() => {
    return filteredRoutes.filter(
      (route) => route.navGroup === "clientsManagement"
    );
  }, [filteredRoutes]);

  // Standalone routes (everything not in dropdowns)
  const mainRoutes = useMemo(() => {
    return filteredRoutes.filter(
      (route) =>
        !serviceRoutes.includes(route) &&
        !userManagementRoutes.includes(route) &&
        !adminClientsManagementRoutes.includes(route)
    );
  }, [filteredRoutes, serviceRoutes, userManagementRoutes, adminClientsManagementRoutes]);

  return (
    <>
      {/* Mobile backdrop */}
      {openSidenav && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        />
      )}

      <aside
        className={`bg-light-surface text-light-text dark:bg-dark-surface dark:text-dark-text
        ${openSidenav ? "translate-x-0" : "-translate-x-80"}
        fixed inset-y-0 left-0 z-50 h-full w-72 transition-transform duration-300
        xl:translate-x-0 xl:sticky xl:top-4 xl:h-[calc(100vh-32px)] xl:ml-4 xl:rounded-xl
        border border-light-border dark:border-dark-border overflow-y-auto`}
      >
        <div className="relative">
          <Link
            to={isAdmin ? ROUTE_PATHS.ADMIN.DASHBOARD : ROUTE_PATHS.DASHBOARD.HOME}
            className="py-6 px-8 text-center block"
          >
            <img
              src={brandImg}
              alt={brandName}
              className="mx-auto h-10 object-contain"
            />
          </Link>

          {/* Close icon for mobile */}
          <div className="absolute top-4 right-4 xl:hidden">
            <button
              onClick={() => setOpenSidenav(dispatch, false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-background focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>

        <div className="m-4 flex flex-col h-[calc(100%-80px)]">
          <ul className="mb-4 flex flex-col gap-1">
            {/* 1) STANDALONE ROUTES */}
            {mainRoutes.map((route, idx) => (
              <li key={route.path || idx}>
                <NavLink to={route.path}>
                  {({ isActive }) => (
                    <Button
                      className={`flex items-center gap-4 px-4 py-3 capitalize rounded-lg w-full text-left shadow-none
                      border border-light-border dark:border-dark-border
                      ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-transparent text-light-muted dark:text-dark-muted hover:bg-light-background dark:hover:bg-dark-background"
                      }`}
                    >
                      {route.icon}
                      <Typography color="inherit" className="font-medium capitalize">
                        {route.name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}

            {/* 2) CLIENT: USER MANAGEMENT DROPDOWN */}
            {userManagementRoutes.length > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => toggleSection("userManagement")}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg w-full text-left
                  border border-light-border dark:border-dark-border
                  ${
                    openSections.userManagement
                      ? "bg-primary text-white"
                      : "bg-transparent text-light-muted dark:text-dark-muted hover:bg-light-background dark:hover:bg-dark-background"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium capitalize">User Management</span>
                  </span>

                  {openSections.userManagement ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>

                {openSections.userManagement && (
                  <ul className="mt-2 ml-4 flex flex-col gap-1">
                    {userManagementRoutes.map((route) => (
                      <li key={route.path}>
                        <NavLink to={route.path}>
                          {({ isActive }) => (
                            <Button
                              className={`flex items-center gap-4 px-4 py-3 capitalize rounded-lg w-full text-left shadow-none
                              border border-light-border dark:border-dark-border
                              ${
                                isActive
                                  ? "bg-primary text-white"
                                  : "bg-transparent text-light-muted dark:text-dark-muted hover:bg-light-background dark:hover:bg-dark-background"
                              }`}
                            >
                              {route.icon}
                              <Typography color="inherit" className="font-medium capitalize">
                                {route.name}
                              </Typography>
                            </Button>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}

            {/* 3) CLIENT: SERVICES DROPDOWN */}
            {serviceRoutes.length > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => toggleSection("services")}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg w-full text-left
                  border border-light-border dark:border-dark-border
                  ${
                    openSections.services
                      ? "bg-primary text-white"
                      : "bg-transparent text-light-muted dark:text-dark-muted hover:bg-light-background dark:hover:bg-dark-background"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium capitalize">Services</span>
                  </span>

                  {openSections.services ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>

                {openSections.services && (
                  <ul className="mt-2 ml-4 flex flex-col gap-1">
                    {serviceRoutes.map((route) => (
                      <li key={route.path}>
                        <NavLink to={route.path}>
                          {({ isActive }) => (
                            <Button
                              className={`flex items-center gap-4 px-4 py-3 capitalize rounded-lg w-full text-left shadow-none
                              border border-light-border dark:border-dark-border
                              ${
                                isActive
                                  ? "bg-primary text-white"
                                  : "bg-transparent text-light-muted dark:text-dark-muted hover:bg-light-background dark:hover:bg-dark-background"
                              }`}
                            >
                              {route.icon}
                              <Typography color="inherit" className="font-medium capitalize">
                                {route.name}
                              </Typography>
                            </Button>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}

            {/* 4) ADMIN: CLIENTS MANAGEMENT DROPDOWN */}
            {isAdmin && adminClientsManagementRoutes.length > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => toggleSection("clientsManagement")}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg w-full text-left
                  border border-light-border dark:border-dark-border
                  ${
                    openSections.clientsManagement
                      ? "bg-primary text-white"
                      : "bg-transparent text-light-muted dark:text-dark-muted hover:bg-light-background dark:hover:bg-dark-background"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium capitalize">Clients Management</span>
                  </span>

                  {openSections.clientsManagement ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>

                {openSections.clientsManagement && (
                  <ul className="mt-2 ml-4 flex flex-col gap-1">
                    {adminClientsManagementRoutes.map((route) => (
                      <li key={route.path}>
                        <NavLink to={route.path}>
                          {({ isActive }) => (
                            <Button
                              className={`flex items-center gap-4 px-4 py-3 capitalize rounded-lg w-full text-left shadow-none
                              border border-light-border dark:border-dark-border
                              ${
                                isActive
                                  ? "bg-primary text-white"
                                  : "bg-transparent text-light-muted dark:text-dark-muted hover:bg-light-background dark:hover:bg-dark-background"
                              }`}
                            >
                              {route.icon}
                              <Typography color="inherit" className="font-medium capitalize">
                                {route.name}
                              </Typography>
                            </Button>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}
          </ul>

          {/* Logout */}
          {isAuthenticated && (
            <div className="mt-auto pt-4">
              <Button
                onClick={handleLogout}
                className="w-full bg-primary text-white hover:opacity-90"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

Sidenav.defaultProps = {
  brandImg: "./img/aitek_logo_light.png",
  brandName: "Aitek Solutions",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
};

export default Sidenav;
