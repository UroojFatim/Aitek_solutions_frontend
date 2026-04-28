import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function ServiceCancelledPage() {
  const { darkMode } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen px-4">
      {/* Logo */}
      <img
        src={darkMode ? "/img/aitek_logo_light.png" : "/img/aitek_logo_dark.png"}
        alt="Logo"
        className="w-28 sm:w-36 md:w-48 mb-6"
      />

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
        Service Cancelled 
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg text-light-muted dark:text-dark-muted max-w-lg">
        Your service has been cancelled.  
        <br />
        We’re sorry to see you go.  
        <br />
        If this was a mistake, you can re-assign a service or contact our support team for help.
      </p>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button
            className="px-6 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
          Re-Assign Service
        </button>
        <button
          className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default ServiceCancelledPage;
