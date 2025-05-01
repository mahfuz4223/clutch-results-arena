
import React from "react";
import { Team } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
import { cn } from "@/lib/utils";

interface MobileResultBannerProps {
  tournament: string;
  teams: Team[];
  matches: any[];
  title: string;
  className?: string;
}

const MobileResultBanner: React.FC<MobileResultBannerProps> = ({
  tournament,
  teams,
  matches,
  title,
  className = "",
}) => {
  // Calculate standings
  const standings = calculateOverallStandings(teams, matches);

  return (
    <div 
      className={cn("mobile-result-banner w-full overflow-hidden rounded-lg shadow-lg", className)}
      style={{
        width: "360px",
        backgroundImage: "linear-gradient(135deg, #d50270 0%, #ba022a 100%)",
      }}
    >
      {/* Tournament Logo Band */}
      <div className="bg-black/40 p-2 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/public/lovable-uploads/219a88a1-7c30-4976-9bf2-4b9ffc9ddacf.png"
            alt="PUBG Mobile Logo"
            className="h-8 mr-2"
            crossOrigin="anonymous"
          />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/80">GRAND FINALS</span>
          <span className="text-xs text-white/80">12/23/25</span>
        </div>
      </div>

      {/* Title */}
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold text-white tracking-widest">
          {title || "OVERALL RANKINGS"}
        </h1>
      </div>

      {/* Results Table */}
      <div className="px-2 pb-4">
        <table className="w-full border-collapse bg-black/80 text-white">
          <thead>
            <tr className="text-xs uppercase border-b border-white/30">
              <th className="py-2 px-1 text-left">Rank</th>
              <th className="py-2 px-1 text-left">Team</th>
              <th className="py-2 px-1 text-center">WWCD</th>
              <th className="py-2 px-1 text-center">Place</th>
              <th className="py-2 px-1 text-center">Elims</th>
              <th className="py-2 px-1 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {standings.slice(0, 8).map((standing, index) => (
              <tr 
                key={standing.teamId} 
                className={`text-xs border-b border-white/10 
                  ${index % 2 === 0 ? 'bg-black/40' : ''}
                  ${index === 0 ? 'bg-yellow-900/30' : ''}
                  ${index === 1 ? 'bg-gray-700/30' : ''}
                  ${index === 2 ? 'bg-amber-800/30' : ''}`}
              >
                <td className="py-2 px-1 font-bold">{index + 1}</td>
                <td className="py-2 px-1">
                  {standing.teamFlag && <span className="mr-1">{standing.teamFlag}</span>}
                  <span className="font-medium">{standing.teamName}</span>
                </td>
                <td className="py-2 px-1 text-center">{standing.wwcd}</td>
                <td className="py-2 px-1 text-center">{standing.totalPlacementPoints}</td>
                <td className="py-2 px-1 text-center">{standing.totalKills}</td>
                <td className="py-2 px-1 text-center font-bold">{standing.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Second half of standings (if needed) */}
        {standings.length > 8 && (
          <table className="w-full border-collapse bg-black/80 text-white mt-2">
            <thead>
              <tr className="text-xs uppercase border-b border-white/30">
                <th className="py-2 px-1 text-left">Rank</th>
                <th className="py-2 px-1 text-left">Team</th>
                <th className="py-2 px-1 text-center">WWCD</th>
                <th className="py-2 px-1 text-center">Place</th>
                <th className="py-2 px-1 text-center">Elims</th>
                <th className="py-2 px-1 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {standings.slice(8, 16).map((standing, index) => (
                <tr 
                  key={standing.teamId} 
                  className={`text-xs border-b border-white/10 ${index % 2 === 0 ? 'bg-black/40' : ''}`}
                >
                  <td className="py-2 px-1 font-bold">{index + 9}</td>
                  <td className="py-2 px-1">
                    {standing.teamFlag && <span className="mr-1">{standing.teamFlag}</span>}
                    <span className="font-medium">{standing.teamName}</span>
                  </td>
                  <td className="py-2 px-1 text-center">{standing.wwcd}</td>
                  <td className="py-2 px-1 text-center">{standing.totalPlacementPoints}</td>
                  <td className="py-2 px-1 text-center">{standing.totalKills}</td>
                  <td className="py-2 px-1 text-center font-bold">{standing.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black/50 p-2 text-center text-xs text-white/80">
        <span>PUBG MOBILE GLOBAL CHAMPIONSHIP 2025</span>
      </div>
    </div>
  );
};

export default MobileResultBanner;
