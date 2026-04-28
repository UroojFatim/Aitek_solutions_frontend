import { useLocation, Link } from "react-router-dom";
import React, { useState } from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  BellIcon,
  ClockIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { useTheme } from "./../../context/ThemeContext";
import { useSelector } from "react-redux";
import { ChangePasswordModal } from "@/shared/modals";
import { useNotifications } from "@/context/NotificationsContext";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const { darkMode, setDarkMode } = useTheme();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return "";
    }
  };

  const formatRelativeTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`;
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} day ago`;
      
      return date.toLocaleDateString();
    } catch {
      return "";
    }
  };

  return (
    <Navbar
      className={`rounded-xl transition-all shadow-none 
        ${fixedNavbar
          ? "sticky top-0 z-40 py-3 px-4 bg-light-surface dark:bg-dark-surface"
          : "px-4 py-2 bg-transparent"} text-light-text dark:text-dark-text`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 w-full">

        {/* LEFT: Breadcrumb (hidden on mobile) */}
        <div className="hidden md:flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <Breadcrumbs className="bg-transparent p-0 text-sm">
            <Link to={`/${layout}/home`}>
              <Typography
                variant="small"
                className="text-light-muted dark:text-dark-muted font-medium hover:text-primary transition-colors"
              >
                {layout.charAt(0).toUpperCase() + layout.slice(1)}
              </Typography>
            </Link>
            <Typography
              variant="small"
              className="text-light-text dark:text-dark-text font-semibold"
            >
              {page?.charAt(0)?.toUpperCase() + page?.slice(1)}
            </Typography>
          </Breadcrumbs>
        </div>

        {/* RIGHT: Actions (hamburger + icons + logo all in one row) */}
        <div className="flex flex-row items-center justify-between gap-3 w-full lg:w-auto">

          {/* Sidebar toggle (mobile only) */}
          <IconButton
            variant="text"
            className="xl:hidden text-light-muted dark:text-dark-muted"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6" />
          </IconButton>

          {/* Actions group */}
          <div className="flex flex-row items-center gap-3 sm:gap-4 ml-auto">

            {/* User Info (only visible on xl) */}
            {isAuthenticated ? (
              <div className="hidden xl:flex items-center gap-2 px-2 text-light-muted dark:text-dark-muted">
                <UserCircleIcon className="h-5 w-5" />
                <Typography
                  variant="small"
                  className="font-medium truncate max-w-[120px]"
                >
                  {user.email}
                </Typography>
              </div>
            ) : (
              <Link to="/">
                <Button
                  variant="text"
                  className="hidden xl:flex items-center gap-1 px-4 normal-case text-light-muted dark:text-dark-muted"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Notifications - Fixed Height with Scroll */}
            <div className="relative">
              <Menu open={isNotifOpen} handler={(open) => { setIsNotifOpen(open); if (open) markAllRead(); }}>
                <MenuHandler>
                  <IconButton variant="text" className="text-light-muted dark:text-dark-muted">
                    <BellIcon className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="w-96 max-h-[500px] border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text p-0 overflow-hidden">
                  
                  {/* Header - Fixed at top */}
                  <div className="sticky top-0 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-4 py-3 z-10">
                    <div className="flex items-center gap-2">
                      <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <Typography variant="small" className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                        Notifications ({notifications.length})
                      </Typography>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                            No notifications yet
                          </Typography>
                        </div>
                      </div>
                    ) : (
                      notifications.map((item, idx) => (
                        <MenuItem 
                          key={item.id || idx} 
                          className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            !item.isRead ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                          } cursor-pointer`}
                        >
                          <div className="flex items-start justify-between gap-3 w-full">
                            <div className="flex-1 min-w-0">
                              <Typography 
                                variant="small" 
                                className={`mb-1 font-medium text-gray-800 dark:text-gray-200 text-sm ${
                                  !item.isRead ? 'font-semibold' : ''
                                }`}
                              >
                                {item.title}
                              </Typography>
                              <Typography 
                                variant="small" 
                                className="text-xs text-gray-600 dark:text-gray-300 mb-2 leading-relaxed"
                              >
                                {item.message}
                              </Typography>
                              <Typography
                                variant="small"
                                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
                              >
                                <ClockIcon className="h-3 w-3" />
                                {formatTime(item.time)}
                              </Typography>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Typography
                                variant="small"
                                className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                              >
                                {formatRelativeTime(item.time)}
                              </Typography>
                              {!item.isRead && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </MenuItem>
                      ))
                    )}
                  </div>



                </MenuList>
              </Menu>
              
              {/* Unread count badge */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-center text-[12px] border border-white dark:border-gray-800 flex items-center justify-center font-medium"
                  aria-label="unread notifications"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </button>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <IconButton
              variant="text"
              className="text-light-muted dark:text-dark-muted"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </IconButton>

            {/* Settings Dropdown */}
            <Menu>
              <MenuHandler>
                <IconButton variant="text" className="text-light-muted dark:text-dark-muted">
                  <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>
              </MenuHandler>
              <MenuList className="w-max border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text">
                <MenuItem 
                  className="flex items-center gap-3"
                  onClick={() => setChangePasswordOpen(true)}
                >
                  <Typography variant="small" className="font-normal">
                    Change Password
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>

            {/* Logo */}
            <img
              src={darkMode ? "/img/aitek_logo_light.png" : "/img/aitek_logo_dark.png"}
              alt="Logo"
              className="h-6 sm:h-8 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={changePasswordOpen}
        handleOpen={() => setChangePasswordOpen(!changePasswordOpen)}
      />
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;