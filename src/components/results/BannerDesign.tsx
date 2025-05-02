
import React from "react";
import { Team, Match } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
import { cn } from "@/lib/utils";

interface BannerDesignProps {
  teams: Team[];
  matches: Match[];
  tournament: string;
  dayName: string;
  matchName?: string;
  theme: string;
}

const BannerDesign: React.FC<BannerDesignProps> = ({
  teams,
  matches,
  tournament,
  dayName,
  matchName,
  theme = "pubg-official",
}) => {
  // Calculate standings
  const standings = calculateOverallStandings(teams, matches);
  
  // Split standings for display in columns
  const leftColumnStandings = standings.slice(0, Math.ceil(standings.length / 2));
  const rightColumnStandings = standings.slice(Math.ceil(standings.length / 2));
  
  // Build title based on available data
  const title = matchName ? `${dayName} - ${matchName}` : dayName;
  
  // Get theme configuration
  const themeConfig = getThemeConfig(theme);

  return (
    <div className="overflow-hidden relative" style={{ width: '1240px', height: '720px' }}>
      {/* Banner Container */}
      <div 
        className={cn(
          "w-full h-full flex flex-col relative",
          themeConfig.containerClasses
        )}
        style={themeConfig.containerStyle}
      >
        {/* Background Pattern/Image */}
        {themeConfig.backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 z-0" 
            style={{ backgroundImage: `url(${themeConfig.backgroundImage})` }}
          />
        )}
        
        {/* Grid Overlay */}
        {themeConfig.showGrid && (
          <div className="absolute inset-0 z-0 opacity-30">
            <img 
              src="/public/lovable-uploads/ef62d711-f3b9-47c8-97a6-39cb861a0425.png" 
              alt="Grid Lines" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Banner Header */}
        <div className="relative z-10 pt-10 pb-6 text-center">
          {/* Top Corner Logos */}
          <div className="absolute top-4 right-4 flex items-center space-x-4">
            {theme === "pubg-official" && (
              <img
                src="/public/lovable-uploads/bbd6b8ea-bb1e-4972-b550-d9f1b82ce551.png"
                alt="PUBG Logo"
                className="h-16 object-contain"
              />
            )}
            {theme === "pmgo-2025" && (
              <img
                src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png"
                alt="PUBG Mobile"
                className="h-14 object-contain"
              />
            )}
          </div>
          
          {/* Tournament Name */}
          <div className={cn("text-center", themeConfig.titleClasses)}>
            <h1 className={cn("text-5xl font-extrabold uppercase tracking-wide mb-2", themeConfig.mainTitleClasses)}>
              {themeConfig.titlePrefix && <span className="block text-2xl mb-1">{themeConfig.titlePrefix}</span>}
              {tournament}
            </h1>
            
            {themeConfig.showDivider && (
              <div className={cn("h-1 w-3/4 mx-auto rounded-full", themeConfig.dividerClasses)}></div>
            )}
            
            <h2 className={cn("text-4xl font-bold mt-4 uppercase tracking-wider", themeConfig.subtitleClasses)}>
              {title}
            </h2>
          </div>
        </div>
        
        {/* Left Character Silhouette (PUBG style) */}
        {themeConfig.showCharacter && (
          <div className="absolute bottom-0 left-0 h-64 opacity-50 z-0">
            <img 
              src="/public/lovable-uploads/c774f54c-53d5-40d5-92ad-cbaa38bf1e99.png" 
              alt="Character Silhouette" 
              className="h-full object-contain"
            />
          </div>
        )}
        
        {/* Table Container */}
        <div className="flex-1 relative z-10 px-12 pt-4">
          <div className="flex justify-between gap-4">
            {/* Left Column */}
            <div className="w-[48%]">
              <table className={cn("w-full border-collapse", themeConfig.tableClasses)}>
                <thead className={cn("uppercase", themeConfig.tableHeaderClasses)}>
                  <tr>
                    <th className="py-4 px-3 text-left">RANK</th>
                    <th className="py-4 px-3 text-left">TEAM</th>
                    <th className="py-4 px-3 text-center">WWCD</th>
                    <th className="py-4 px-3 text-center">{themeConfig.placeLabel}</th>
                    <th className="py-4 px-3 text-center">{themeConfig.killsLabel}</th>
                    <th className="py-4 px-3 text-center">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {leftColumnStandings.map((standing, index) => (
                    <tr 
                      key={standing.teamId} 
                      className={cn(
                        "border-b", 
                        themeConfig.getRowClasses(index)
                      )}
                    >
                      <td className={cn("py-3 px-3 font-bold", themeConfig.rankClasses)}>#{standing.rank}</td>
                      <td className="py-3 px-3 font-medium">
                        {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                        {standing.teamName}
                      </td>
                      <td className="py-3 px-3 text-center">{standing.wwcd}</td>
                      <td className="py-3 px-3 text-center">{standing.totalPlacementPoints}</td>
                      <td className="py-3 px-3 text-center">{standing.totalKills}</td>
                      <td className={cn("py-3 px-3 text-center font-bold", themeConfig.pointsClasses)}>
                        {standing.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Column */}
            <div className="w-[48%]">
              <table className={cn("w-full border-collapse", themeConfig.tableClasses)}>
                <thead className={cn("uppercase", themeConfig.tableHeaderClasses)}>
                  <tr>
                    <th className="py-4 px-3 text-left">RANK</th>
                    <th className="py-4 px-3 text-left">TEAM</th>
                    <th className="py-4 px-3 text-center">WWCD</th>
                    <th className="py-4 px-3 text-center">{themeConfig.placeLabel}</th>
                    <th className="py-4 px-3 text-center">{themeConfig.killsLabel}</th>
                    <th className="py-4 px-3 text-center">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {rightColumnStandings.map((standing, index) => (
                    <tr 
                      key={standing.teamId} 
                      className={cn(
                        "border-b", 
                        themeConfig.getRowClasses(index + leftColumnStandings.length)
                      )}
                    >
                      <td className={cn("py-3 px-3 font-bold", themeConfig.rankClasses)}>#{standing.rank}</td>
                      <td className="py-3 px-3 font-medium">
                        {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                        {standing.teamName}
                      </td>
                      <td className="py-3 px-3 text-center">{standing.wwcd}</td>
                      <td className="py-3 px-3 text-center">{standing.totalPlacementPoints}</td>
                      <td className="py-3 px-3 text-center">{standing.totalKills}</td>
                      <td className={cn("py-3 px-3 text-center font-bold", themeConfig.pointsClasses)}>
                        {standing.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className={cn("mt-auto p-4 flex justify-between items-center", themeConfig.footerClasses)}>
          <div className="flex items-center">
            <img 
              src="/public/lovable-uploads/49b6f4b0-4b79-45ae-a219-75aae6f4d80b.png" 
              alt="Tencent Logo" 
              className="h-6 mr-2"
            />
            <span className="text-sm text-white/70">KRAFTON Inc.</span>
          </div>
          
          <div className="text-sm font-medium text-white/80">
            © 2025 TournaNext
          </div>
          
          <div className="flex items-center">
            {theme === "pubg-official" && (
              <img
                src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png"
                alt="PUBG Mobile"
                className="h-8 mr-2"
              />
            )}
            <span className="text-sm text-white/70">Official Tournament Results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Theme configurations
function getThemeConfig(theme: string) {
  switch (theme) {
    case "pmgo-2025":
      return {
        containerClasses: "bg-gradient-to-br from-blue-950 to-cyan-950",
        containerStyle: {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/public/lovable-uploads/145b7ad5-318f-4bb7-9898-1bda1ca6c14b.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        },
        titleClasses: "text-white",
        mainTitleClasses: "bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent",
        subtitleClasses: "text-white",
        dividerClasses: "bg-gradient-to-r from-blue-500 to-cyan-400",
        tableClasses: "text-white",
        tableHeaderClasses: "bg-gradient-to-r from-blue-900 to-cyan-800 text-cyan-300 text-sm tracking-wider",
        placeLabel: "PLACE",
        killsLabel: "ELIMS",
        rankClasses: "text-cyan-300",
        pointsClasses: "text-cyan-300",
        footerClasses: "bg-gradient-to-r from-blue-900 to-cyan-900",
        showDivider: true,
        showGrid: true,
        showCharacter: true,
        titlePrefix: "2025 PUBG MOBILE GLOBAL CHAMPIONSHIP",
        backgroundImage: "",
        getRowClasses: (index: number) => {
          if (index === 0) return "bg-gradient-to-r from-yellow-700/30 to-amber-800/30 border-blue-700/30";
          if (index === 1) return "bg-gradient-to-r from-gray-600/30 to-gray-700/30 border-blue-700/30";
          if (index === 2) return "bg-gradient-to-r from-amber-700/30 to-amber-800/30 border-blue-700/30";
          return index % 2 === 0 ? "bg-blue-900/60 border-blue-700/30" : "bg-blue-900/40 border-blue-700/30";
        },
      };
      
    case "pubg-official":
      return {
        containerClasses: "bg-black",
        containerStyle: {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/public/lovable-uploads/ef62d711-f3b9-47c8-97a6-39cb861a0425.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        },
        titleClasses: "text-white",
        mainTitleClasses: "text-white",
        subtitleClasses: "text-teal-400 border-2 border-teal-400 inline-block px-8 py-2",
        dividerClasses: "bg-teal-400",
        tableClasses: "text-white",
        tableHeaderClasses: "bg-black text-teal-400 text-sm tracking-wider",
        placeLabel: "PLACE",
        killsLabel: "ELIMS",
        rankClasses: "text-teal-400",
        pointsClasses: "text-teal-400",
        footerClasses: "bg-black",
        showDivider: true,
        showGrid: true,
        showCharacter: true,
        titlePrefix: "",
        backgroundImage: "",
        getRowClasses: (index: number) => {
          if (index === 0) return "bg-yellow-900/30 border-teal-700/30";
          if (index === 1) return "bg-gray-700/30 border-teal-700/30";
          if (index === 2) return "bg-amber-800/30 border-teal-700/30";
          return index % 2 === 0 ? "bg-black/60 border-teal-700/30" : "bg-black/40 border-teal-700/30";
        },
      };
      
    case "esports-dark":
      return {
        containerClasses: "bg-gray-900",
        containerStyle: {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95)), url('/public/lovable-uploads/8ec78efa-0c83-458a-b34d-11d6da1a7045.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        },
        titleClasses: "text-white",
        mainTitleClasses: "text-white",
        subtitleClasses: "text-red-500",
        dividerClasses: "bg-red-500",
        tableClasses: "text-white",
        tableHeaderClasses: "bg-gray-950 text-red-500 text-sm tracking-wider",
        placeLabel: "PLACE",
        killsLabel: "FRAGS",
        rankClasses: "text-red-500",
        pointsClasses: "text-red-500",
        footerClasses: "bg-gradient-to-r from-gray-950 to-gray-900",
        showDivider: true,
        showGrid: false,
        showCharacter: false,
        titlePrefix: "",
        backgroundImage: "",
        getRowClasses: (index: number) => {
          if (index === 0) return "bg-red-950/30 border-gray-800";
          if (index === 1) return "bg-gray-800/40 border-gray-800";
          if (index === 2) return "bg-gray-800/30 border-gray-800";
          return index % 2 === 0 ? "bg-gray-900/60 border-gray-800" : "bg-gray-900/40 border-gray-800";
        },
      };
      
    case "blue-gradient":
      return {
        containerClasses: "bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900",
        containerStyle: {},
        titleClasses: "text-white",
        mainTitleClasses: "text-white",
        subtitleClasses: "text-blue-300",
        dividerClasses: "bg-blue-400",
        tableClasses: "text-white",
        tableHeaderClasses: "bg-blue-950/70 text-white text-sm tracking-wider",
        placeLabel: "POS PTS",
        killsLabel: "ELIM PTS",
        rankClasses: "text-blue-300",
        pointsClasses: "text-blue-300",
        footerClasses: "bg-blue-950/80",
        showDivider: true,
        showGrid: false,
        showCharacter: false,
        titlePrefix: "",
        backgroundImage: "/public/lovable-uploads/fc5b1782-1122-48d6-ba86-d0a1b219ecf1.png",
        getRowClasses: (index: number) => {
          if (index < 3) return "bg-blue-800/30 border-blue-700/30";
          return index % 2 === 0 ? "bg-blue-900/30 border-blue-700/30" : "bg-blue-900/20 border-blue-700/30";
        },
      };
      
    case "cyber-league":
      return {
        containerClasses: "bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900",
        containerStyle: {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/public/lovable-uploads/6c8175da-7008-4839-a7ff-40a2682dc5a5.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        },
        titleClasses: "text-white",
        mainTitleClasses: "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500",
        subtitleClasses: "text-white border border-purple-500/50 px-6 py-1",
        dividerClasses: "bg-gradient-to-r from-fuchsia-500 to-cyan-500",
        tableClasses: "text-white",
        tableHeaderClasses: "bg-purple-900/70 text-fuchsia-300 text-sm tracking-wider border-b border-fuchsia-500/30",
        placeLabel: "PLACEMENT",
        killsLabel: "ELIMINATIONS",
        rankClasses: "text-fuchsia-400",
        pointsClasses: "text-cyan-400",
        footerClasses: "bg-purple-900/80",
        showDivider: true,
        showGrid: false,
        showCharacter: false,
        titlePrefix: "",
        backgroundImage: "",
        getRowClasses: (index: number) => {
          if (index === 0) return "bg-gradient-to-r from-fuchsia-900/20 to-purple-900/20 border-purple-700/30";
          return index % 2 === 0 ? "bg-purple-900/30 border-purple-700/30" : "bg-purple-900/10 border-purple-700/30";
        },
      };
      
    default:
      return {
        containerClasses: "bg-black",
        containerStyle: {},
        titleClasses: "text-white",
        mainTitleClasses: "text-white",
        subtitleClasses: "text-white",
        dividerClasses: "bg-white",
        tableClasses: "text-white",
        tableHeaderClasses: "bg-gray-800 text-white",
        placeLabel: "PLACE",
        killsLabel: "KILLS",
        rankClasses: "",
        pointsClasses: "",
        footerClasses: "bg-gray-800",
        showDivider: false,
        showGrid: false,
        showCharacter: false,
        titlePrefix: "",
        backgroundImage: "",
        getRowClasses: (index: number) => {
          return index % 2 === 0 ? "bg-gray-700" : "bg-gray-800";
        },
      };
  }
}

export default BannerDesign;
