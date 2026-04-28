import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function ServiceCompletedPage() {
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
        Service Completed 
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg text-light-muted dark:text-dark-muted max-w-lg">
        Great job! Your service has been successfully completed.  
        <br />
        Thank you for choosing us — we’re glad to have been part of your journey.  
        <br />
        You can view the final report or start another service anytime.
      </p>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button
          className="px-6 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          View Report
        </button>
        <button
          className="px-6 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Start New Service
        </button>
      </div>
    </div>
  );
}

export default ServiceCompletedPage;
