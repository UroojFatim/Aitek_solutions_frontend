import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function ServiceAssignedPage() {
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
        Your service has been assigned
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg text-light-muted dark:text-dark-muted max-w-lg">
        You have successfully signed up for this service. Please wait while we prepare your onboarding.
      </p>
    </div>
  );
}

export default ServiceAssignedPage;
