
import React, { useRef } from "react";
import { Team, Day, Match, ThemeOption } from "@/types";
import { downloadAsImage, downloadAsPdf } from "./utils/downloadUtils";
import ResultCardHeader from "./components/ResultCardHeader";
import ResultCardFooter from "./components/ResultCardFooter";
import StandingsContent from "./components/StandingsContent";
import DownloadControls from "./components/DownloadControls";

interface ResultCardProps {
  tournament: string;
  teams: Team[];
  days: Day[];
  selectedDay?: string;
  theme: ThemeOption;
  format?: "day" | "match";
  selectedMatch?: string;
  tournamentLogo?: string;
  backgroundImage?: string;
  customCss?: string;
  showPubgLogo?: boolean;
  customFooterText?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  tournament,
  teams,
  days,
  selectedDay = "all",
  theme,
  format = "day",
  selectedMatch,
  tournamentLogo,
  backgroundImage,
  customCss = "",
  showPubgLogo = true,
  customFooterText = "Generated with TournaNext"
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

  // Function to download the image
  const handleDownloadImage = async () => {
    return downloadAsImage(
      cardRef.current, 
      `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}`
    );
  };

  // Function to download as PDF
  const handleDownloadPdf = async () => {
    return downloadAsPdf(
      cardRef.current, 
      `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}`
    );
  };

  return (
    <div className="relative">
      {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}
      <div 
        ref={cardRef}
        className={`w-[1000px] h-[720px] rounded-lg overflow-hidden shadow-xl ${theme.background} relative`}
      >
        {/* Background image if provided */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 z-0" 
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 h-full">
          {/* Header */}
          <ResultCardHeader 
            tournament={tournament}
            matchTitle={matchTitle}
            theme={theme}
            tournamentLogo={tournamentLogo}
            showPubgLogo={showPubgLogo}
            selectedDay={selectedDay}
          />

          {/* Results Table */}
          <StandingsContent 
            teams={teams} 
            matches={matches} 
            theme={theme} 
          />

          {/* Footer */}
          <ResultCardFooter theme={theme} customFooterText={customFooterText} />
        </div>
      </div>

      <DownloadControls 
        onDownloadImage={handleDownloadImage}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
};

export default ResultCard;
