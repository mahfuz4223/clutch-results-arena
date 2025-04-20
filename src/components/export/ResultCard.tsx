
import React, { useRef } from "react";
import { Team, Day, Match, ThemeOption } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface ResultCardProps {
  tournament: string;
  teams: Team[];
  days: Day[];
  selectedDay?: string;
  theme: ThemeOption;
  format?: "day" | "match";
  selectedMatch?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  tournament,
  teams,
  days,
  selectedDay = "all",
  theme,
  format = "day",
  selectedMatch
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Get day title
  const dayTitle = selectedDay === "all" 
    ? "OVERALL STANDINGS" 
    : days.find(day => day.id === selectedDay)?.name || "OVERALL";

  // Get all matches based on selected day/match
  const matches = format === "match" && selectedMatch
    ? [days.flatMap(day => day.matches).find(match => match.id === selectedMatch)].filter(Boolean) as Match[]
    : selectedDay === "all"
      ? days.flatMap(day => day.matches)
      : days.find(day => day.id === selectedDay)?.matches || [];

  const matchTitle = format === "match" && selectedMatch
    ? matches[0]?.name || "MATCH RESULTS"
    : dayTitle;

  // Calculate standings
  const standings = calculateOverallStandings(teams, matches);

  // Function to download the image
  const downloadImage = () => {
    if (cardRef.current) {
      toPng(cardRef.current, { quality: 0.95 })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("Error generating image:", error);
        });
    }
  };

  // Split standings into two columns
  const halfIndex = Math.ceil(standings.length / 2);
  const leftColumnStandings = standings.slice(0, halfIndex);
  const rightColumnStandings = standings.slice(halfIndex);

  return (
    <div className="relative">
      <div 
        ref={cardRef}
        className={`w-[1000px] h-[720px] rounded-lg overflow-hidden shadow-xl ${theme.background} relative`}
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('/public/lovable-uploads/5f1092b1-01ef-4ee7-b8b1-4ff4c96c00b1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* Top Right Corner Logo */}
        <div className="absolute top-5 right-5 h-16">
          <img 
            src="/public/lovable-uploads/bbd6b8ea-bb1e-4972-b550-d9f1b82ce551.png" 
            alt="PUBG Logo" 
            className="h-full object-contain"
          />
        </div>
        
        {/* Left Side Character */}
        <div className="absolute bottom-0 left-0 h-52 opacity-80 z-0 hidden md:block">
          <img 
            src="/public/lovable-uploads/c774f54c-53d5-40d5-92ad-cbaa38bf1e99.png" 
            alt="PUBG Character" 
            className="h-full object-contain"
          />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-10 pb-6 relative z-10">
          <div className="flex items-center mb-2">
            <img 
              src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png" 
              alt="PUBG Mobile" 
              className="h-16 mr-4"
            />
            <div>
              <h1 className={`text-3xl font-bold uppercase ${theme.textColor} drop-shadow-lg`}>{tournament}</h1>
              <div className={`h-1 w-full ${theme.accentColor} my-1 rounded-full`}></div>
            </div>
          </div>
          <h2 className={`text-3xl font-bold uppercase ${theme.textColor} mt-3 tracking-wider drop-shadow-lg`}>{matchTitle}</h2>
        </div>

        {/* Results Table */}
        <div className="px-8 pb-8 relative z-10">
          <div className="flex justify-between gap-4">
            {/* Left Column */}
            <div className="w-[48%]">
              <table className={`w-full border-collapse ${theme.textColor}`}>
                <thead className={`text-sm uppercase ${theme.headerBg} tracking-wider`}>
                  <tr>
                    <th className="py-3 px-2 text-left">#</th>
                    <th className="py-3 px-2 text-left">Team</th>
                    <th className="py-3 px-2 text-center">WWCD</th>
                    <th className="py-3 px-2 text-center">Place</th>
                    <th className="py-3 px-2 text-center">Elims</th>
                    <th className="py-3 px-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {leftColumnStandings.map((standing, index) => (
                    <tr 
                      key={standing.teamId} 
                      className={`
                        ${theme.tableBg} border-b ${theme.borderColor}
                        ${index === 0 ? "bg-yellow-900/30" : ""}
                        ${index === 1 ? "bg-gray-500/20" : ""}
                        ${index === 2 ? "bg-amber-800/20" : ""}
                      `}
                    >
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
            </div>

            {/* Right Column */}
            <div className="w-[48%]">
              <table className={`w-full border-collapse ${theme.textColor}`}>
                <thead className={`text-sm uppercase ${theme.headerBg} tracking-wider`}>
                  <tr>
                    <th className="py-3 px-2 text-left">#</th>
                    <th className="py-3 px-2 text-left">Team</th>
                    <th className="py-3 px-2 text-center">WWCD</th>
                    <th className="py-3 px-2 text-center">Place</th>
                    <th className="py-3 px-2 text-center">Elims</th>
                    <th className="py-3 px-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rightColumnStandings.map((standing) => (
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
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 ${theme.headerBg}`}>
          <div className="text-sm text-white/70">© PUBG Mobile Tournament Maker</div>
          <div className="flex items-center">
            <img src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png" alt="PUBG Mobile" className="h-8 mr-2" />
            <span className="text-sm text-white/70">Generated with Tournament Maker</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <Button 
          onClick={downloadImage} 
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </Button>
        
        <Button 
          onClick={() => {
            if (cardRef.current) {
              toPng(cardRef.current, { quality: 0.95 })
                .then((dataUrl) => {
                  try {
                    navigator.clipboard.writeText(dataUrl);
                    alert("Image copied to clipboard! You can paste it in other applications.");
                  } catch (err) {
                    const link = document.createElement("a");
                    link.download = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
                    link.href = dataUrl;
                    link.click();
                  }
                })
                .catch((error) => {
                  console.error("Error generating image:", error);
                });
            }
          }}
          variant="outline"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default ResultCard;
