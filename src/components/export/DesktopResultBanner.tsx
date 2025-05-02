
import React from "react";
import { Team } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
import { getThemeById, getBackgroundById } from "@/utils/themes";
import { CustomizationOptions } from "@/types";

interface DesktopResultBannerProps {
  tournament: string;
  teams: Team[];
  matches: any[];
  title: string;
  className?: string;
  customization?: CustomizationOptions;
}

const DesktopResultBanner: React.FC<DesktopResultBannerProps> = ({
  tournament,
  teams,
  matches,
  title,
  className = "",
  customization = {
    theme: "pubg-official",
    background: "dark-grid",
    showGridLines: true,
    showTencentLogo: true,
    showPubgLogo: true,
    showTournamentLogo: true,
    showSponsors: true,
    footerText: "© 2025 TournaNext",
  },
}) => {
  // Calculate standings
  const standings = calculateOverallStandings(teams, matches);

  // Half of the standings for the 2-column layout
  const halfIndex = Math.ceil(standings.length / 2);
  const leftColumnStandings = standings.slice(0, halfIndex);
  const rightColumnStandings = standings.slice(halfIndex);

  // Get theme
  const theme = getThemeById(customization?.theme || "pubg-official");

  // Get background image or custom background
  const backgroundUrl = customization?.background === 'custom' 
    ? customization?.customBackgroundUrl 
    : getBackgroundById(customization?.background || "dark-grid");

  // For PMGO style title
  const isPmgoStyle = theme.id.includes("pubg");
  const pmgoTitle = `2025 PMGO Prelims – ${title} [Tournament]`;
  
  return (
    <div 
      className={`desktop-result-banner w-[1000px] rounded-lg overflow-hidden shadow-xl ${theme.background} relative`}
      style={{ 
        backgroundImage: backgroundUrl ? 
          `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('${backgroundUrl}')` : 
          undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Grid Overlay */}
      {customization?.showGridLines && (
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="/public/lovable-uploads/ef62d711-f3b9-47c8-97a6-39cb861a0425.png" 
            alt="Grid Lines" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      )}
      
      {/* Top Right Corner Logo */}
      {customization?.showPubgLogo && (
        <div className="absolute top-5 right-5 h-16 z-10">
          <img 
            src="/public/lovable-uploads/bbd6b8ea-bb1e-4972-b550-d9f1b82ce551.png" 
            alt="PUBG Logo" 
            className="h-full object-contain"
            crossOrigin="anonymous"
          />
        </div>
      )}
      
      {/* Left Side Character */}
      <div className="absolute bottom-0 left-0 h-52 opacity-70 z-0 hidden md:block">
        <img 
          src="/public/lovable-uploads/c774f54c-53d5-40d5-92ad-cbaa38bf1e99.png" 
          alt="PUBG Character" 
          className="h-full object-contain"
          crossOrigin="anonymous"
        />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-10 pb-6 relative z-10">
        {customization?.showTournamentLogo && (
          <div className="flex items-center mb-3">
            {customization?.logoUrl ? (
              <img 
                src={customization.logoUrl} 
                alt="Custom Logo" 
                className="h-16 mr-4"
                crossOrigin="anonymous"
              />
            ) : (
              <img 
                src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png" 
                alt="PUBG Mobile" 
                className="h-16 mr-4"
                crossOrigin="anonymous"
              />
            )}
          </div>
        )}
        
        <div>
          <h1 className="header-title text-3xl font-bold uppercase text-white drop-shadow-lg">
            {isPmgoStyle ? (
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {pmgoTitle}
              </span>
            ) : (
              <span className={`${theme.textColor}`}>{tournament}</span>
            )}
          </h1>
          <div className={`h-1 w-full ${isPmgoStyle ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : theme.accentColor} my-1 rounded-full`}></div>
        </div>
        
        {!isPmgoStyle && (
          <h2 className={`day-title text-3xl font-bold uppercase ${theme.textColor} mt-3 tracking-wider drop-shadow-lg px-4 py-1 ${theme.accentColor === 'bg-teal-400' ? 'border-2 border-teal-400' : ''}`}>
            {title}
          </h2>
        )}
      </div>

      {/* Results Table */}
      <div className="px-8 relative z-10">
        <div className="flex justify-between gap-4">
          {/* Left Column */}
          <div className="w-[48%]">
            <table className={`w-full border-collapse ${isPmgoStyle ? 'text-white' : theme.textColor}`}>
              <thead className={`table-header text-sm uppercase ${
                isPmgoStyle 
                  ? 'bg-gradient-to-r from-blue-900 to-cyan-800 text-cyan-300' 
                  : theme.headerBg
              } tracking-wider`}>
                <tr>
                  <th className="py-3 px-2 text-left">RANK</th>
                  <th className="py-3 px-2 text-left">TEAM</th>
                  <th className="py-3 px-2 text-center">WWCD</th>
                  <th className="py-3 px-2 text-center">PLACE</th>
                  <th className="py-3 px-2 text-center">ELIMS</th>
                  <th className="py-3 px-2 text-center">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {leftColumnStandings.map((standing, index) => (
                  <tr 
                    key={standing.teamId} 
                    className={`
                      table-row ${isPmgoStyle ? (index % 2 === 0 ? 'bg-blue-900/60' : 'bg-blue-900/40') : theme.tableBg} 
                      border-b ${isPmgoStyle ? 'border-blue-700/30' : theme.borderColor}
                      ${index === 0 && isPmgoStyle ? "bg-gradient-to-r from-yellow-700/30 to-amber-800/30" : ""}
                      ${index === 1 && isPmgoStyle ? "bg-gradient-to-r from-gray-600/30 to-gray-700/30" : ""}
                      ${index === 2 && isPmgoStyle ? "bg-gradient-to-r from-amber-700/30 to-amber-800/30" : ""}
                      ${index === 0 && !isPmgoStyle ? "bg-yellow-900/30" : ""}
                      ${index === 1 && !isPmgoStyle ? "bg-gray-500/20" : ""}
                      ${index === 2 && !isPmgoStyle ? "bg-amber-800/20" : ""}
                    `}
                  >
                    <td className={`py-3 px-2 font-bold team-rank ${isPmgoStyle ? 'text-cyan-300' : ''}`}>#{standing.rank}</td>
                    <td className="py-3 px-2 font-medium">
                      {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                      {standing.teamName}
                    </td>
                    <td className="py-3 px-2 text-center">{standing.wwcd}</td>
                    <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
                    <td className="py-3 px-2 text-center">{standing.totalKills}</td>
                    <td className={`py-3 px-2 text-center font-bold total-points ${isPmgoStyle ? 'text-cyan-300' : ''}`}>{standing.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div className="w-[48%]">
            <table className={`w-full border-collapse ${isPmgoStyle ? 'text-white' : theme.textColor}`}>
              <thead className={`table-header text-sm uppercase ${
                isPmgoStyle 
                  ? 'bg-gradient-to-r from-blue-900 to-cyan-800 text-cyan-300' 
                  : theme.headerBg
              } tracking-wider`}>
                <tr>
                  <th className="py-3 px-2 text-left">RANK</th>
                  <th className="py-3 px-2 text-left">TEAM</th>
                  <th className="py-3 px-2 text-center">WWCD</th>
                  <th className="py-3 px-2 text-center">PLACE</th>
                  <th className="py-3 px-2 text-center">ELIMS</th>
                  <th className="py-3 px-2 text-center">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {rightColumnStandings.map((standing, index) => (
                  <tr 
                    key={standing.teamId} 
                    className={`
                      table-row ${isPmgoStyle ? (index % 2 === 0 ? 'bg-blue-900/60' : 'bg-blue-900/40') : theme.tableBg} 
                      border-b ${isPmgoStyle ? 'border-blue-700/30' : theme.borderColor}
                    `}
                  >
                    <td className={`py-3 px-2 font-bold team-rank ${isPmgoStyle ? 'text-cyan-300' : ''}`}>#{standing.rank}</td>
                    <td className="py-3 px-2 font-medium">
                      {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                      {standing.teamName}
                    </td>
                    <td className="py-3 px-2 text-center">{standing.wwcd}</td>
                    <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
                    <td className="py-3 px-2 text-center">{standing.totalKills}</td>
                    <td className={`py-3 px-2 text-center font-bold total-points ${isPmgoStyle ? 'text-cyan-300' : ''}`}>{standing.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`footer absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 ${
        isPmgoStyle 
          ? 'bg-gradient-to-r from-blue-900 to-cyan-900' 
          : theme.headerBg
      }`}>
        {customization?.showTencentLogo && (
          <div className="flex items-center">
            <img 
              src="/public/lovable-uploads/49b6f4b0-4b79-45ae-a219-75aae6f4d80b.png" 
              alt="Tencent" 
              className="h-6 mr-2"
              crossOrigin="anonymous"
            />
            <span className="text-sm text-white/70">KRAFTON Inc.</span>
          </div>
        )}
        
        {/* Custom footer text */}
        <div className="flex items-center">
          <span className="text-sm font-medium text-white/80">{customization?.footerText || "© 2025 TournaNext"}</span>
        </div>
        
        {customization?.showSponsors && (
          <div className="flex items-center">
            {customization?.logoUrl ? (
              <img 
                src={customization.logoUrl} 
                alt="Custom Logo" 
                className="h-8 mr-2" 
                crossOrigin="anonymous"
              />
            ) : (
              <img 
                src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png" 
                alt="PUBG Mobile" 
                className="h-8 mr-2" 
                crossOrigin="anonymous"
              />
            )}
            <span className="text-sm text-white/70">Official Tournament Results</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopResultBanner;
