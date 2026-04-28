import { useEffect, useMemo, useState } from "react";

export const useRoadMapData = ({ businessId, phases }) => {
  const [activePhase, setActivePhase] = useState(null);

  // Set first phase active by default
  useEffect(() => {
    if (phases?.length && !activePhase) setActivePhase(phases[0].id);
  }, [phases, activePhase]);

  const current = useMemo(() => {
    if (!phases?.length) return null;
    return phases.find((p) => p.id === activePhase) || phases[0];
  }, [phases, activePhase]);

  const weeks = current?.weeks || [];

  return { activePhase, setActivePhase, current, weeks };
};
