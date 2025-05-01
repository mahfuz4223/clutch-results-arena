
import React from "react";
import { Team, Match } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
import { Badge } from "@/components/ui/badge";

interface DesktopResultBannerProps {
  tournament: string;
  teams: Team[];
  matches: Match[];
  title: string;
  className?: string;
}

const DesktopResultBanner: React.FC<DesktopResultBannerProps> = ({
  tournament,
  teams,
  matches,
  title,
  className = "",
}) => {
  // Calculate standings
  const standings = calculateOverallStandings(teams, matches);
  
  // Split standings into two columns
  const halfIndex = Math.ceil(standings.length / 2);
  const leftColumnStandings = standings.slice(0, halfIndex);
  const rightColumnStandings = standings.slice(halfIndex);

  return (
    <div 
      className={`w-[1000px] h-[720px] rounded-lg overflow-hidden shadow-xl relative ${className}`}
      style={{
        backgroundImage: "linear-gradient(135deg, #d50270 0%, #ba022a 100%)",
        fontFamily: "'Rajdhani', 'Inter', sans-serif"
      }}
    >
      {/* Left side decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-black/50" />
      
      {/* Right side decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-6 flex flex-col justify-between items-center py-8">
        <div className="w-full h-32 bg-black/50" />
        <div className="text-vertical transform rotate-180 text-white/70 tracking-widest text-sm">
          PUBG MOBILE GLOBAL CHAMPIONSHIP
        </div>
        <div className="w-full h-32 bg-black/50" />
      </div>
      
      {/* Header with logos */}
      <div className="flex justify-between items-center px-12 pt-6">
        <div>
          <img
            src="/public/lovable-uploads/219a88a1-7c30-4976-9bf2-4b9ffc9ddacf.png"
            alt="PUBG Mobile Logo"
            className="h-16"
            crossOrigin="anonymous"
          />
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold text-white tracking-widest mb-2">
            OVERALL RANKINGS
          </h1>
          <div className="text-sm font-semibold text-white/80">
            GRAND FINALS 12/25/25
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="social" className="p-1.5">
            #PMGC2025
          </Badge>
        </div>
      </div>
      
      {/* Main content: standings tables */}
      <div className="px-12 mt-6 grid grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          <table className="w-full border-collapse">
            <thead className="bg-black text-white">
              <tr className="text-xs uppercase tracking-wider">
                <th className="py-3 px-2 text-left border-r border-gray-700/50">RANK</th>
                <th className="py-3 px-2 text-left border-r border-gray-700/50">TEAM</th>
                <th className="py-3 px-2 text-center border-r border-gray-700/50">WWCD</th>
                <th className="py-3 px-2 text-center border-r border-gray-700/50">PLACE PTS</th>
                <th className="py-3 px-2 text-center border-r border-gray-700/50">ELIMS</th>
                <th className="py-3 px-2 text-center">TOTAL PTS</th>
              </tr>
            </thead>
            <tbody>
              {leftColumnStandings.map((standing, index) => (
                <tr 
                  key={standing.teamId} 
                  className={`
                    text-white
                    ${index % 2 === 0 ? 'bg-black/65' : 'bg-black/40'} 
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-700/60 to-black/65' : ''}
                  `}
                >
                  <td className="py-3 px-2 font-bold">#{index + 1}</td>
                  <td className="py-3 px-2">
                    {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                    <span className="font-medium">{standing.teamName}</span>
                  </td>
                  <td className="py-3 px-2 text-center">{standing.wwcd}</td>
                  <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
                  <td className="py-3 px-2 text-center">{standing.totalKills}</td>
                  <td className="py-3 px-2 text-center font-bold">{standing.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Right column */}
        <div>
          <table className="w-full border-collapse">
            <thead className="bg-black text-white">
              <tr className="text-xs uppercase tracking-wider">
                <th className="py-3 px-2 text-left border-r border-gray-700/50">RANK</th>
                <th className="py-3 px-2 text-left border-r border-gray-700/50">TEAM</th>
                <th className="py-3 px-2 text-center border-r border-gray-700/50">WWCD</th>
                <th className="py-3 px-2 text-center border-r border-gray-700/50">PLACE PTS</th>
                <th className="py-3 px-2 text-center border-r border-gray-700/50">ELIMS</th>
                <th className="py-3 px-2 text-center">TOTAL PTS</th>
              </tr>
            </thead>
            <tbody>
              {rightColumnStandings.map((standing, index) => (
                <tr 
                  key={standing.teamId} 
                  className={`
                    text-white
                    ${index % 2 === 0 ? 'bg-black/65' : 'bg-black/40'} 
                  `}
                >
                  <td className="py-3 px-2 font-bold">#{index + halfIndex + 1}</td>
                  <td className="py-3 px-2">
                    {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                    <span className="font-medium">{standing.teamName}</span>
                  </td>
                  <td className="py-3 px-2 text-center">{standing.wwcd}</td>
                  <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
                  <td className="py-3 px-2 text-center">{standing.totalKills}</td>
                  <td className="py-3 px-2 text-center font-bold">{standing.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-3 px-12 flex justify-between items-center">
        <div className="text-white/70 text-sm">
          © 2025 KRAFTON Inc.
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium text-sm mr-2">
            WATCH THE ACTION LIVE:
          </span>
          <div className="flex space-x-1">
            <Badge variant="social" className="p-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M23.5 6.2c-.3-1-1.1-1.8-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5c-1 .3-1.8 1.1-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1.1 1.8 2.1 2.1 1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5c1-.3 1.8-1.1 2.1-2.1.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zm-14 9.4V8.4l6.3 3.6-6.3 3.6z"/></svg>
            </Badge>
            <Badge variant="social" className="p-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M24 12.1c0-6.6-5.4-12-12-12s-12 5.4-12 12c0 6 4.4 10.9 10.1 11.9v-8.4h-3v-3.5h3V9.7c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4c5.7-1 10.1-5.9 10.1-11.8z"/></svg>
            </Badge>
            <Badge variant="social" className="p-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 15.9c-.2.3-.6.4-.9.2C14.5 17 12.6 16.7 8 16.7c-2.1 0-3.8.2-5.1.5-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 1.5-.4 3.4-.6 5.4-.6 5 0 7.1.4 8.8 1.6.3.2.4.5.2.8zm1.3-2.9c-.3.4-.8.5-1.2.3-2-1.2-5.2-1.6-7.7-1.6-1.6 0-3.1.2-4.3.5-.5.1-.9-.1-1.1-.5-.2-.5.1-1 .5-1.1 1.4-.4 3.1-.6 4.9-.6 2.8 0 6.4.4 8.7 1.8.4.3.5.8.2 1.2zm.1-3c-.3.5-.9.6-1.4.4-2.3-1.4-6.5-1.7-9.5-1.7-2 0-3.9.2-5.2.6-.6.1-1.1-.2-1.3-.7-.2-.6.2-1.1.7-1.3 1.5-.5 3.6-.7 5.8-.7 3.3 0 8 .4 10.7 2 .5.3.7.9.2 1.4z"/></svg>
            </Badge>
            <Badge variant="social" className="p-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white"><path d="M12 2c-2.7 0-3.1 0-4.2.1-1.1 0-1.8.2-2.5.5-.7.3-1.2.6-1.8 1.1-.5.5-.8 1.1-1.1 1.8-.3.6-.5 1.4-.5 2.5C2 9 2 9.4 2 12s0 3.1.1 4.2c0 1.1.2 1.8.5 2.5.3.7.6 1.2 1.1 1.8.5.5 1.1.8 1.8 1.1.6.3 1.4.5 2.5.5 1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1c1.1 0 1.8-.2 2.5-.5.7-.3 1.2-.6 1.8-1.1.5-.5.8-1.1 1.1-1.8.3-.6.5-1.4.5-2.5.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2c0-1.1-.2-1.8-.5-2.5-.3-.7-.6-1.2-1.1-1.8-.5-.5-1.1-.8-1.8-1.1-.6-.3-1.4-.5-2.5-.5C15.1 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4.1.1 1 0 1.5.2 1.9.3.5.2.8.4 1.1.7.3.3.5.7.7 1.1.2.4.3.9.3 1.9.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.5-.3 1.9-.2.5-.4.8-.7 1.1-.3.3-.7.5-1.1.7-.4.2-.9.3-1.9.3-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.5-.2-1.9-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.5-.7-.7-1.1-.2-.4-.3-.9-.3-1.9-.1-1.1-.1-1.4-.1-4.1s0-3 .1-4.1c0-1 .2-1.5.3-1.9.2-.5.4-.8.7-1.1.3-.3.7-.5 1.1-.7.4-.2.9-.3 1.9-.3 1.1-.1 1.4-.1 4.1-.1z"/><path d="M12 15.3c-1.8 0-3.3-1.5-3.3-3.3S10.2 8.7 12 8.7s3.3 1.5 3.3 3.3-1.5 3.3-3.3 3.3zm0-8.4c-2.8 0-5.1 2.3-5.1 5.1s2.3 5.1 5.1 5.1 5.1-2.3 5.1-5.1-2.3-5.1-5.1-5.1z"/><circle cx="17.3" cy="6.7" r="1.2"/></svg>
            </Badge>
          </div>
        </div>
        
        <div className="text-white text-sm">
          2025/12/25
        </div>
      </div>
    </div>
  );
};

export default DesktopResultBanner;
