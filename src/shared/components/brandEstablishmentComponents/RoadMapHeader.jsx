import React from "react";
import { FileText, MessageSquare } from "lucide-react";

const RoadMapHeader = () => (
  <header className="sticky top-0 z-20 backdrop-blur bg-light-background dark:bg-dark-background">
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center border">
        <FileText size={18} />
      </div>

      <div className="flex-1">
        <h1 className="text-xl md:text-2xl font-bold">
          ATS 30-60-90 Brand Establishment Execution Plan
        </h1>
        <p className="text-xs md:text-sm opacity-70">
          Objective: Turn insights into strategy, and strategy into visibility, authority, and full-arch domination.
        </p>
      </div>
      </div>
  </header>
);

export default RoadMapHeader;
