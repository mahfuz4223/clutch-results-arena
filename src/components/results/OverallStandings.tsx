
import React from "react";
import { Team, Match, Day } from "@/types";
import { calculateOverallStandings, getWWCDCount } from "@/utils/pointCalculator";

interface OverallStandingsProps {
  teams: Team[];
  days: Day[];
  selectedDay?: string; // day ID or "all" for all days
  className?: string;
  style?: "default" | "pubg-official";
}

const OverallStandings: React.FC<OverallStandingsProps> = ({ 
  teams, 
  days, 
  selectedDay = "all",
  className = "",
  style = "default" 
}) => {
  // Get all matches based on selected day
  const matches = selectedDay === "all" 
    ? days.flatMap(day => day.matches)
    : days.find(day => day.id === selectedDay)?.matches || [];

  // Calculate standings
  const standings = calculateOverallStandings(teams, matches);

  // Determine if we should use the PUBG official style
  const isPubgStyle = style === "pubg-official";

  return (
    <div className={`overflow-x-auto rounded-lg ${className}`}>
      <table className={`w-full text-sm text-left ${isPubgStyle ? "border-collapse border-2 border-teal-500/50" : ""}`}>
        <thead className={`text-xs uppercase tracking-wider ${isPubgStyle ? "bg-black text-teal-400 border-b-2 border-teal-500/50" : ""}`}>
          <tr>
            <th scope="col" className={`px-3 py-3 ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
              {isPubgStyle ? "RANK" : "Rank"}
            </th>
            <th scope="col" className={`px-3 py-3 ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
              {isPubgStyle ? "TEAM" : "Team"}
            </th>
            <th scope="col" className={`px-3 py-3 text-center ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
              WWCD
            </th>
            <th scope="col" className={`px-3 py-3 text-center ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
              {isPubgStyle ? "PLACE" : "Place Pts"}
            </th>
            <th scope="col" className={`px-3 py-3 text-center ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
              {isPubgStyle ? "ELIMS" : "Elims"}
            </th>
            <th scope="col" className="px-3 py-3 text-center">
              {isPubgStyle ? "TOTAL" : "Total"}
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => (
            <tr 
              key={standing.teamId} 
              className={`border-b transition-colors 
                ${isPubgStyle 
                  ? `${index % 2 === 0 ? "bg-black/60" : "bg-black/40"} border-teal-700/30` 
                  : ""}
                ${index < 3 ? "font-medium" : ""}
                ${index === 0 && isPubgStyle ? "bg-yellow-900/30" : ""}
                ${index === 1 && isPubgStyle ? "bg-gray-700/30" : ""}
                ${index === 2 && isPubgStyle ? "bg-amber-800/30" : ""}
              `}
            >
              <td className={`px-3 py-2 font-bold ${isPubgStyle ? "border-r border-teal-700/30 text-teal-400" : ""}`}>
                #{standing.rank}
              </td>
              <td className={`px-3 py-2 font-medium flex items-center ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
                {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                {standing.teamName}
              </td>
              <td className={`px-3 py-2 text-center ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
                {standing.wwcd}
              </td>
              <td className={`px-3 py-2 text-center ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
                {standing.totalPlacementPoints}
              </td>
              <td className={`px-3 py-2 text-center ${isPubgStyle ? "border-r border-teal-700/30" : ""}`}>
                {standing.totalKills}
              </td>
              <td className={`px-3 py-2 text-center font-bold ${isPubgStyle ? "text-teal-400" : ""}`}>
                {standing.totalPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OverallStandings;
