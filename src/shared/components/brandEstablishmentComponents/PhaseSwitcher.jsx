import React from "react";

const PhaseSwitcher = ({ phases = [], activePhase, setActivePhase }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {phases.map((p) => (
        <button
          key={p.id}
          onClick={() => setActivePhase(p.id)}
          className={`p-3 rounded-2xl border shadow-sm transition-all ${
            activePhase === p.id ? "scale-[1.02] ring-2 ring-primary" : "hover:shadow-lg"
          }`}
        >
          <div className="text-left">
            <div className="text-sm opacity-70">Phase</div>
            <div className="font-semibold">{p.title}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default PhaseSwitcher;
