import React from "react";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl shadow-md bg-light-background dark:bg-dark-background border border-neutral-200 dark:border-neutral-800 ${className}`}
  >
    {children}
  </div>
);

export default Card;
