
import React from "react";
import { ThemeOption } from "@/types";

interface ResultCardHeaderProps {
  tournament: string;
  matchTitle: string;
  theme: ThemeOption;
  tournamentLogo?: string;
  showPubgLogo?: boolean;
}

const ResultCardHeader: React.FC<ResultCardHeaderProps> = ({
  tournament,
  matchTitle,
  theme,
  tournamentLogo,
  showPubgLogo = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-6">
      <div className="flex items-center mb-2">
        {showPubgLogo && (
          <img 
            src="/public/lovable-uploads/208256eb-7194-493e-b6f2-1bb74a96f28d.png" 
            alt="PUBG Mobile" 
            className="h-16 mr-4" 
          />
        )}
        {tournamentLogo && (
          <img src={tournamentLogo} alt="Tournament Logo" className="h-16 mr-4 object-contain" />
        )}
        <div>
          <h1 className={`text-3xl font-bold uppercase ${theme.textColor}`}>{tournament}</h1>
          <div className={`h-1 w-full ${theme.accentColor} my-1 rounded-full`}></div>
        </div>
      </div>
      <h2 className={`text-3xl font-bold uppercase ${theme.textColor} mt-3`}>{matchTitle}</h2>
    </div>
  );
};

export default ResultCardHeader;
