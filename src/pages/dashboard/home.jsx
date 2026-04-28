import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function Home() {
  const { darkMode } = useTheme();

  return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen px-4">
      <img
        src={darkMode ? "/img/aitek_logo_light.png" : "/img/aitek_logo_dark.png"} 
        alt="Logo"
        className="w-32 sm:w-40 md:w-52 mb-6"
      />

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
        Welcome aboard!
      </h2>

      <p className="text-sm sm:text-base md:text-lg text-light-muted dark:text-dark-muted">
        You’re new here, so there’s not much to see just yet.
        <br />
        As you start using the portal and data comes in, this page will fill up
        with insights and updates.
        <br />
        If you’re still onboarding, head to Onboarding; otherwise, select a service from the left sidebar.
      </p>
    </div>
  );
}

export default Home;
