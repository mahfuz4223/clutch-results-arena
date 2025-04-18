
import React from "react";
import { ThemeOption } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
import { Team, Match } from "@/types";

interface StandingsContentProps {
  teams: Team[];
  matches: Match[];
  theme: ThemeOption;
}

const StandingsContent: React.FC<StandingsContentProps> = ({ teams, matches, theme }) => {
  // Calculate standings
  const standings = calculateOverallStandings(teams, matches);
  
  // Split standings into two columns
  const halfIndex = Math.ceil(standings.length / 2);
  const leftColumnStandings = standings.slice(0, halfIndex);
  const rightColumnStandings = standings.slice(halfIndex);

  return (
    <div className="px-8 pb-8 pt-4" style={{ backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)" }}>
      <div className="flex justify-between gap-4">
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

// StandingsTable Component
interface StandingsTableProps {
  standings: any[];
  theme: ThemeOption;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings, theme }) => {
  return (
    <div className="rounded-md overflow-hidden">
      <table className="w-full border-collapse">
        <thead className={`text-sm uppercase ${theme.headerBg} text-white`}>
          <tr>
            <th className="py-3 px-3 text-left">#</th>
            <th className="py-3 px-3 text-left">Team</th>
            <th className="py-3 px-3 text-center">WWCD</th>
            <th className="py-3 px-3 text-center">Place Pts</th>
            <th className="py-3 px-3 text-center">Elims</th>
            <th className="py-3 px-3 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr 
              key={standing.teamId} 
              className={`border-b ${theme.borderColor} ${standing.rank <= 8 ? `${theme.tableBg}` : `${theme.tableBg}`} text-white`}
            >
              <td className="py-3 px-3 font-bold text-center">#{standing.rank}</td>
              <td className="py-3 px-3 font-medium flex items-center">
                {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                {standing.teamName}
              </td>
              <td className="py-3 px-3 text-center">{standing.wwcd}</td>
              <td className="py-3 px-3 text-center">{standing.totalPlacementPoints}</td>
              <td className="py-3 px-3 text-center">{standing.totalKills}</td>
              <td className="py-3 px-3 text-center font-bold text-yellow-300">{standing.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsContent;
