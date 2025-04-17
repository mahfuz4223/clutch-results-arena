
import React from "react";
import { ThemeOption } from "@/types";
import { TeamStanding } from "../types/standings";

interface StandingsTableProps {
  standings: TeamStanding[];
  theme: ThemeOption;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings, theme }) => {
  return (
    <table className={`w-full border-collapse ${theme.textColor}`}>
      <thead className={`text-sm uppercase ${theme.headerBg}`}>
        <tr>
          <th className="py-3 px-2 text-left">#</th>
          <th className="py-3 px-2 text-left">Team</th>
          <th className="py-3 px-2 text-center">WWCD</th>
          <th className="py-3 px-2 text-center">Place Pts</th>
          <th className="py-3 px-2 text-center">Elims</th>
          <th className="py-3 px-2 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((standing) => (
          <tr key={standing.teamId} className={`${theme.tableBg} border-b ${theme.borderColor}`}>
            <td className="py-3 px-2 font-bold">#{standing.rank}</td>
            <td className="py-3 px-2 font-medium">
              {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
              {standing.teamName}
            </td>
            <td className="py-3 px-2 text-center">{standing.wwcd}</td>
            <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
            <td className="py-3 px-2 text-center">{standing.totalKills}</td>
            <td className="py-3 px-2 text-center font-bold">{standing.totalPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StandingsTable;
