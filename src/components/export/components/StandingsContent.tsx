
import React from "react";
import StandingsTable from "./StandingsTable";
import { TeamStanding } from "../types/standings";
import { ThemeOption } from "@/types";

interface StandingsContentProps {
  standings: TeamStanding[];
  theme: ThemeOption;
}

const StandingsContent: React.FC<StandingsContentProps> = ({ standings, theme }) => {
  // Split standings into two columns
  const halfIndex = Math.ceil(standings.length / 2);
  const leftColumnStandings = standings.slice(0, halfIndex);
  const rightColumnStandings = standings.slice(halfIndex);

  return (
    <div className="px-8 pb-8">
      <div className="flex justify-between">
        {/* Left Column */}
        <div className="w-[48%]">
          <StandingsTable standings={leftColumnStandings} theme={theme} />
        </div>

        {/* Right Column */}
        <div className="w-[48%]">
          <StandingsTable standings={rightColumnStandings} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default StandingsContent;
