import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/routes.constants';
import { lazy } from 'react';

// Lazy load auth components
const SignIn = lazy(() => import('@/pages/auth/sign-in'));
const ResetPassword = lazy(() => import('@/pages/auth/reset-password'));
const Welcome = lazy(() => import('@/pages/auth/welcome'));
const NotFound = lazy(() => import('@/pages/404'));

// Auth routes (authentication related pages)
export const authRoutes = [
  {
    path: ROUTE_PATHS.AUTH.SIGN_IN,
    component: SignIn,
    name: ROUTE_NAMES.AUTH.SIGN_IN,
    public: true,
  },
  {
    path: ROUTE_PATHS.AUTH.RESET_PASSWORD,
    component: ResetPassword,
    name: ROUTE_NAMES.AUTH.RESET_PASSWORD,
    public: true,
  },
  {
    path: ROUTE_PATHS.AUTH.WELCOME,
    component: Welcome,
    name: ROUTE_NAMES.AUTH.WELCOME,
    public: true,
  },
];

// Public routes (other non-layout routes)
export const publicRoutes = [
  {
    path: '*',
    component: NotFound,
    name: 'Not Found',
    public: true,
  },
];

// Combined non-layout routes for backward compatibility
export const nonLayoutRoutes = [...authRoutes, ...publicRoutes];
