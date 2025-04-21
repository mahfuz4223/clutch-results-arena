
import React from "react";
import { Team, Match, Day } from "@/types";
import { calculateOverallStandings, getWWCDCount } from "@/utils/pointCalculator";

interface OverallStandingsProps {
  teams: Team[];
  days: Day[];
  selectedDay?: string; // day ID or "all" for all days
  className?: string;
  style?: "default" | "pubg-official" | "pmgo-2025";
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

  // Determine if we should use the PUBG official or PMGO 2025 style
  const isPubgStyle = style === "pubg-official";
  const isPmgoStyle = style === "pmgo-2025";

  return (
    <div className={`overflow-x-auto rounded-lg ${className}`}>
      <table className={`w-full text-sm text-left ${
        isPmgoStyle 
          ? "border-collapse border-2 border-blue-500/50" 
          : isPubgStyle 
            ? "border-collapse border-2 border-teal-500/50" 
            : ""
      }`}>
        <thead className={`text-xs uppercase tracking-wider ${
          isPmgoStyle 
            ? "bg-gradient-to-r from-blue-900 to-cyan-800 text-cyan-300 border-b-2 border-blue-500/50" 
            : isPubgStyle 
              ? "bg-black text-teal-400 border-b-2 border-teal-500/50" 
              : ""
        }`}>
          <tr>
            <th scope="col" className={`px-3 py-3 ${
              isPmgoStyle 
                ? "border-r border-blue-700/30" 
                : isPubgStyle 
                  ? "border-r border-teal-700/30" 
                  : ""
            }`}>
              {isPmgoStyle || isPubgStyle ? "RANK" : "Rank"}
            </th>
            <th scope="col" className={`px-3 py-3 ${
              isPmgoStyle 
                ? "border-r border-blue-700/30" 
                : isPubgStyle 
                  ? "border-r border-teal-700/30" 
                  : ""
            }`}>
              {isPmgoStyle || isPubgStyle ? "TEAM" : "Team"}
            </th>
            <th scope="col" className={`px-3 py-3 text-center ${
              isPmgoStyle 
                ? "border-r border-blue-700/30" 
                : isPubgStyle 
                  ? "border-r border-teal-700/30" 
                  : ""
            }`}>
              WWCD
            </th>
            <th scope="col" className={`px-3 py-3 text-center ${
              isPmgoStyle 
                ? "border-r border-blue-700/30" 
                : isPubgStyle 
                  ? "border-r border-teal-700/30" 
                  : ""
            }`}>
              {isPmgoStyle 
                ? "PLACE" 
                : isPubgStyle 
                  ? "PLACE" 
                  : "Place Pts"}
            </th>
            <th scope="col" className={`px-3 py-3 text-center ${
              isPmgoStyle 
                ? "border-r border-blue-700/30" 
                : isPubgStyle 
                  ? "border-r border-teal-700/30" 
                  : ""
            }`}>
              {isPmgoStyle || isPubgStyle ? "ELIMS" : "Elims"}
            </th>
            <th scope="col" className="px-3 py-3 text-center">
              {isPmgoStyle || isPubgStyle ? "TOTAL" : "Total"}
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => (
            <tr 
              key={standing.teamId} 
              className={`border-b transition-colors 
                ${isPmgoStyle 
                  ? `${index % 2 === 0 ? "bg-blue-900/60" : "bg-blue-900/40"} border-blue-700/30` 
                  : isPubgStyle 
                    ? `${index % 2 === 0 ? "bg-black/60" : "bg-black/40"} border-teal-700/30` 
                    : ""}
                ${index < 3 ? "font-medium" : ""}
                ${index === 0 && isPmgoStyle ? "bg-gradient-to-r from-yellow-700/30 to-amber-800/30" : ""}
                ${index === 1 && isPmgoStyle ? "bg-gradient-to-r from-gray-600/30 to-gray-700/30" : ""}
                ${index === 2 && isPmgoStyle ? "bg-gradient-to-r from-amber-700/30 to-amber-800/30" : ""}
                ${index === 0 && isPubgStyle ? "bg-yellow-900/30" : ""}
                ${index === 1 && isPubgStyle ? "bg-gray-700/30" : ""}
                ${index === 2 && isPubgStyle ? "bg-amber-800/30" : ""}
              `}
            >
              <td className={`px-3 py-2 font-bold ${
                isPmgoStyle 
                  ? "border-r border-blue-700/30 text-cyan-300" 
                  : isPubgStyle 
                    ? "border-r border-teal-700/30 text-teal-400" 
                    : ""
              }`}>
                #{standing.rank}
              </td>
              <td className={`px-3 py-2 font-medium flex items-center ${
                isPmgoStyle 
                  ? "border-r border-blue-700/30" 
                  : isPubgStyle 
                    ? "border-r border-teal-700/30" 
                    : ""
              }`}>
                {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                {standing.teamName}
              </td>
              <td className={`px-3 py-2 text-center ${
                isPmgoStyle 
                  ? "border-r border-blue-700/30" 
                  : isPubgStyle 
                    ? "border-r border-teal-700/30" 
                    : ""
              }`}>
                {standing.wwcd}
              </td>
              <td className={`px-3 py-2 text-center ${
                isPmgoStyle 
                  ? "border-r border-blue-700/30" 
                  : isPubgStyle 
                    ? "border-r border-teal-700/30" 
                    : ""
              }`}>
                {standing.totalPlacementPoints}
              </td>
              <td className={`px-3 py-2 text-center ${
                isPmgoStyle 
                  ? "border-r border-blue-700/30" 
                  : isPubgStyle 
                    ? "border-r border-teal-700/30" 
                    : ""
              }`}>
                {standing.totalKills}
              </td>
              <td className={`px-3 py-2 text-center font-bold ${
                isPmgoStyle 
                  ? "text-cyan-300" 
                  : isPubgStyle 
                    ? "text-teal-400" 
                    : ""
              }`}>
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
