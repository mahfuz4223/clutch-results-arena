
import React from "react";
import { Team, Match, Day } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";

interface OverallStandingsProps {
  teams: Team[];
  days: Day[];
  selectedDay?: string; // day ID or "all" for all days
  className?: string;
}

const OverallStandings: React.FC<OverallStandingsProps> = ({ 
  teams, 
  days, 
  selectedDay = "all",
  className = "" 
}) => {
  // Get all matches based on selected day
  const matches = selectedDay === "all" 
    ? days.flatMap(day => day.matches)
    : days.find(day => day.id === selectedDay)?.matches || [];

  // Calculate standings
  const standings = calculateOverallStandings(teams, matches);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase">
          <tr>
            <th scope="col" className="px-3 py-3">Rank</th>
            <th scope="col" className="px-3 py-3">Team</th>
            <th scope="col" className="px-3 py-3 text-center">WWCD</th>
            <th scope="col" className="px-3 py-3 text-center">Place Pts</th>
            <th scope="col" className="px-3 py-3 text-center">Elims</th>
            <th scope="col" className="px-3 py-3 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr key={standing.teamId} className="border-b">
              <td className="px-3 py-2 font-medium">#{standing.rank}</td>
              <td className="px-3 py-2 font-medium flex items-center">
                {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                {standing.teamName}
              </td>
              <td className="px-3 py-2 text-center">{standing.wwcd}</td>
              <td className="px-3 py-2 text-center">{standing.totalPlacementPoints}</td>
              <td className="px-3 py-2 text-center">{standing.totalKills}</td>
              <td className="px-3 py-2 text-center font-bold">{standing.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OverallStandings;
