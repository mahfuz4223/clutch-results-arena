
import React from "react";
import { ThemeOption } from "@/types";

interface ResultCardHeaderProps {
  tournament: string;
  matchTitle: string;
  theme: ThemeOption;
  tournamentLogo?: string;
  showPubgLogo?: boolean;
  selectedDay?: string;
}

const ResultCardHeader: React.FC<ResultCardHeaderProps> = ({
  tournament,
  matchTitle,
  theme,
  tournamentLogo,
  showPubgLogo = true,
  selectedDay = "all"
}) => {
  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4" style={{ 
      background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)" 
    }}>
      <div className="flex items-center justify-center mb-2">
        {showPubgLogo && (
          <img 
            src="/lovable-uploads/bb077b02-12df-4f5f-bc07-bfade01b67dd.png" 
            alt="PUBG Mobile" 
            className="h-20 object-contain mr-4" 
          />
        )}
        {tournamentLogo && (
          <img src={tournamentLogo} alt="Tournament Logo" className="h-16 object-contain mr-4" />
        )}
        <div>
          <h1 className="text-3xl font-bold uppercase text-white">{tournament}</h1>
          <div className="h-1 w-full bg-blue-500 my-1 rounded-full"></div>
        </div>
      </div>
      <h2 className="text-4xl font-bold uppercase text-white mt-6 tracking-wider" 
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
        {matchTitle}
      </h2>
      <div className="flex items-center mt-2">
        <div className="h-[2px] w-12 bg-blue-500 mr-2"></div>
        <span className="text-blue-300 tracking-widest">DAY {selectedDay !== "all" ? selectedDay.replace(/[^0-9]/g, '') : "ALL"}</span>
        <div className="h-[2px] w-12 bg-blue-500 ml-2"></div>
      </div>
    </div>
  );
};

export default ResultCardHeader;
