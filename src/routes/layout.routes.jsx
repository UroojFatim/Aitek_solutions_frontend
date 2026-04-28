import { lazy } from 'react';
import {
  HomeIcon,
  MegaphoneIcon,
  UsersIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { LayoutDashboardIcon, ClipboardListIcon } from "lucide-react";
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/routes.constants';
import { USER_ROLES } from '@/constants/user.constants';

// Lazy load dashboard components
const Home = lazy(() => import('@/pages/dashboard/home'));
const Onboarding = lazy(() => import('@/pages/dashboard/Onboarding'));
const LeadGeneration = lazy(() => import('@/pages/dashboard/LeadGeneration'));
const Leads = lazy(() => import('@/pages/dashboard/Leads'));
const SmileSupport = lazy(() => import('@/pages/dashboard/SmileSupport'));
const WolfLabServices = lazy(() => import('@/pages/dashboard/WolfLabServices'));
const BrandEstablishment = lazy(() => import('@/pages/dashboard/BrandEstablishment'));
const ConsultCoaching = lazy(() => import('@/pages/dashboard/ConsultCoaching'));
const SurgicalObservation = lazy(() => import('@/pages/dashboard/SurgicalObservation'));
const ContentCreation = lazy(() => import('@/pages/dashboard/ContentCreation'));
const TrustedClinicalIt = lazy(() => import('@/pages/dashboard/TrustedClinicalIt'));
const Accounts = lazy(() => import('@/pages/dashboard/Accounts'));
const UserManagement = lazy(() => import('@/pages/dashboard/UserManagement'));
// const UserAudit = lazy(() => import('@/pages/dashboard/UserAudit'));
const GhlUserPipelines = lazy(() => import('@/pages/dashboard/GHL'));

// Lazy load admin components
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminAccounts = lazy(() => import('@/pages/admin/accounts'));
const AdminAssignPipeline = lazy(() => import('@/pages/admin/AdminAssignPipeline'));
const ClientDashboard = lazy(() => import('@/pages/admin/client_dashboard/Dashboard'));
const AdminsManagement = lazy(() => import('@/pages/admin/AdminsManagement'));
const AdminsAudit = lazy(() => import('@/pages/admin/AdminsAudit'));
const AdminAccountSheetPage = lazy(() => import('@/pages/admin/AdminAccountSheetPage'));
const GhlPipelines = lazy(() => import('@/pages/admin/GHL/index'));
const AdminBrandEstablishment = lazy(() => import('@/pages/admin/BrandEstablishment'));
const AdminServiceManagement = lazy(() => import('@/pages/admin/AdminServiceManagement'));
const AdminClientsView = lazy(() => import('@/pages/admin/Clients_View/AdminClientsView'));
const AdminUserManagement = lazy(() => import('@/pages/admin/AdminUserManagement'));

const icon = { className: "w-5 h-5 text-inherit" };

// Layout routes (with sidebar/navbar) - role-based arrays
export const userRoutes = [
  {
    path: ROUTE_PATHS.DASHBOARD.HOME,
    component: Home,
    name: ROUTE_NAMES.DASHBOARD.HOME,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.ONBOARDING,
    component: Onboarding,
    name: ROUTE_NAMES.DASHBOARD.ONBOARDING,
    allowedRoles: [USER_ROLES.SUPER_USER],
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.MANAGE_USERS,
    component: UserManagement,
    name: ROUTE_NAMES.DASHBOARD.MANAGE_USERS,
    allowedRoles: [USER_ROLES.SUPER_USER],
    showInNav: true,
  },
  // {
  //   path: ROUTE_PATHS.DASHBOARD.USER_AUDIT,
  //   component: UserAudit,
  //   name: ROUTE_NAMES.DASHBOARD.USER_AUDIT,
  //   allowedRoles: [USER_ROLES.SUPER_USER],
  //   showInNav: true,
  // },
  {
    path: ROUTE_PATHS.DASHBOARD.LEAD_GENERATION,
    component: LeadGeneration,
    name: ROUTE_NAMES.DASHBOARD.LEAD_GENERATION,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
    isServiceRoute: true,
    serviceKey: ROUTE_NAMES.DASHBOARD.LEAD_GENERATION,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.LEAD_MANAGEMENT,
    component: GhlUserPipelines,
    name: ROUTE_NAMES.DASHBOARD.LEAD_MANAGEMENT,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.SMILE_SUPPORT,
    component: SmileSupport,
    name: ROUTE_NAMES.DASHBOARD.SMILE_SUPPORT,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
    isServiceRoute: true,
    serviceKey: ROUTE_NAMES.DASHBOARD.SMILE_SUPPORT,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.WOLF_LAB_SERVICES,
    component: WolfLabServices,
    name: ROUTE_NAMES.DASHBOARD.WOLF_LAB_SERVICES,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
    isServiceRoute: true,
    serviceKey: ROUTE_NAMES.DASHBOARD.WOLF_LAB_SERVICES,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.BRAND_ESTABLISHMENT,
    component: BrandEstablishment,
    name: ROUTE_NAMES.DASHBOARD.BRAND_ESTABLISHMENT,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
    isServiceRoute: true,
    serviceKey: ROUTE_NAMES.DASHBOARD.BRAND_ESTABLISHMENT,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.CONSULT_COACHING,
    component: ConsultCoaching,
    name: ROUTE_NAMES.DASHBOARD.CONSULT_COACHING,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
    isServiceRoute: true,
    serviceKey: ROUTE_NAMES.DASHBOARD.CONSULT_COACHING,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.SURGICAL_OBSERVATION,
    component: SurgicalObservation,
    name: ROUTE_NAMES.DASHBOARD.SURGICAL_OBSERVATION,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
    isServiceRoute: true,
    serviceKey: ROUTE_NAMES.DASHBOARD.SURGICAL_OBSERVATION,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.CONTENT_CREATION,
    component: ContentCreation,
    name: ROUTE_NAMES.DASHBOARD.CONTENT_CREATION,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
    isServiceRoute: true,
    serviceKey: ROUTE_NAMES.DASHBOARD.CONTENT_CREATION,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.TRUSTED_CLINICAL_IT,
    component: TrustedClinicalIt,
    name: ROUTE_NAMES.DASHBOARD.TRUSTED_CLINICAL_IT,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
    isServiceRoute: true,
    serviceKey: ROUTE_NAMES.DASHBOARD.TRUSTED_CLINICAL_IT,
  },
  {
    path: ROUTE_PATHS.DASHBOARD.ACCOUNT,
    component: Accounts,
    name: ROUTE_NAMES.DASHBOARD.ACCOUNT,
    allowedRoles: [USER_ROLES.USER, USER_ROLES.SUPER_USER],
    showInNav: true,
  },
];

export const adminRoutes = [
  {
    path: ROUTE_PATHS.ADMIN.DASHBOARD,
    component: AdminDashboard,
    name: ROUTE_NAMES.ADMIN.DASHBOARD,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.ADMIN.CLIENT,
    component: AdminAccounts,
    name: ROUTE_NAMES.ADMIN.CLIENT,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    showInNav: true,
    navGroup: "clientsManagement",
  },
  {
    path: ROUTE_PATHS.ADMIN.USER_MANAGEMENT,
    component: AdminUserManagement,
    name: ROUTE_NAMES.ADMIN.USER_MANAGEMENT,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    showInNav: true,
    navGroup: "clientsManagement",
  },
    // ✅ Standalone: Service Management (tabs page)
  {
    path: ROUTE_PATHS.ADMIN.SERVICE_MANAGEMENT, // add path yourself
    component: AdminServiceManagement,
    name: ROUTE_NAMES.ADMIN.SERVICE_MANAGEMENT,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    showInNav: true,
  },

  // ✅ Standalone: Client’s View (tabs page)
  {
    path: ROUTE_PATHS.ADMIN.CLIENTS_VIEW, // add path yourself
    component: AdminClientsView,
    name: ROUTE_NAMES.ADMIN.CLIENTS_VIEW,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
    showInNav: true,
  },
  // {
  //   path: ROUTE_PATHS.ADMIN.CRM_ACCOUNT_MAPPING,
  //   component: AdminAssignPipeline,
  //   name: ROUTE_NAMES.ADMIN.CRM_ACCOUNT_MAPPING,
  //   allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  //   showInNav: true,
  // },
  // {
  //   path: ROUTE_PATHS.ADMIN.ADMIN_ACCOUNT_SHEET,
  //   component: AdminAccountSheetPage,
  //   name: ROUTE_NAMES.ADMIN.ADMIN_ACCOUNT_SHEET,
  //   allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  //   showInNav: true,
  // },
  // {
  //   path: ROUTE_PATHS.ADMIN.ADMIN_BRAND_ESTABLISHMENT,
  //   component: AdminBrandEstablishment,
  //   name: ROUTE_NAMES.ADMIN.ADMIN_BRAND_ESTABLISHMENT,
  //   allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  //   showInNav: true,
  // },
  // {
  //   path: ROUTE_PATHS.ADMIN.CLIENT_DASHBOARD,
  //   component: ClientDashboard,
  //   name: ROUTE_NAMES.ADMIN.CLIENT_DASHBOARD,
  //   allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  //   showInNav: true,
  // },
  // {
  //   path: ROUTE_PATHS.ADMIN.MARKETING,
  //   component: GhlPipelines,
  //   name: ROUTE_NAMES.ADMIN.MARKETING,
  //   allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  //   showInNav: true,
  // },
  {
    path: ROUTE_PATHS.ADMIN.ADMIN_MANAGEMENT,
    component: AdminsManagement,
    name: ROUTE_NAMES.ADMIN.ADMIN_MANAGEMENT,
    allowedRoles: [USER_ROLES.SUPER_ADMIN],
    showInNav: true,
  },
  {
    path: ROUTE_PATHS.ADMIN.ADMINS_AUDIT,
    component: AdminsAudit,
    name: ROUTE_NAMES.ADMIN.ADMINS_AUDIT,
    allowedRoles: [USER_ROLES.SUPER_ADMIN],
    showInNav: true,
  }
];

// Combined layout routes
export const layoutRoutes = [...userRoutes, ...adminRoutes];