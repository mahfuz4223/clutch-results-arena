
import React from "react";
import { Team, MatchResult } from "@/types";

interface ResultsTableProps {
  results: MatchResult[];
  teams: Team[];
  showWinners?: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, teams, showWinners = true }) => {
  // Sort results by total points (highest first)
  const sortedResults = [...results].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-4 py-3">Rank</th>
            <th scope="col" className="px-4 py-3">Team</th>
            <th scope="col" className="px-4 py-3 text-center">Placement</th>
            <th scope="col" className="px-4 py-3 text-center">Kills</th>
            <th scope="col" className="px-4 py-3 text-center">Placement Pts</th>
            <th scope="col" className="px-4 py-3 text-center">Kill Pts</th>
            <th scope="col" className="px-4 py-3 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((result, index) => {
            const team = teams.find(team => team.id === result.teamId);
            
            return (
              <tr key={result.teamId} className={`${
                index === 0 && showWinners 
                  ? "bg-yellow-100 dark:bg-yellow-900/30" 
                  : index % 2 === 0 
                    ? "bg-white dark:bg-gray-800" 
                    : "bg-gray-50 dark:bg-gray-700"
              } border-b dark:border-gray-700`}>
                <td className="px-4 py-3 font-medium">#{index + 1}</td>
                <td className="px-4 py-3 font-medium flex items-center">
                  {team?.flag && <span className="mr-2">{team.flag}</span>}
                  {team?.name || "Unknown Team"}
                </td>
                <td className="px-4 py-3 text-center">{result.placement}</td>
                <td className="px-4 py-3 text-center">{result.kills}</td>
                <td className="px-4 py-3 text-center">{result.placementPoints}</td>
                <td className="px-4 py-3 text-center">{result.killPoints}</td>
                <td className="px-4 py-3 text-center font-bold">{result.totalPoints}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
