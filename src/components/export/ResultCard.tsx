
import React, { useRef, useState } from "react";
import { Team, Day, Match, ThemeOption } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
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
  const [bgOpacity, setBgOpacity] = useState(0.2);

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
  const handleDownloadImage = () => {
    downloadAsImage(
      cardRef.current, 
      `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.png`
    ).catch((error) => {
      console.error("Error generating image:", error);
    });
  };

  // Function to download as PDF
  const handleDownloadPdf = () => {
    downloadAsPdf(
      cardRef.current, 
      `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`
    ).catch((error) => {
      console.error("Error generating PDF:", error);
    });
  };

  // Apply custom CSS if provided
  const customStyle = customCss ? { dangerouslySetInnerHTML: { __html: customCss } } : {};
  
  return (
    <div className="relative">
      <style {...customStyle} />
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
              opacity: bgOpacity
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
          />

          {/* Results Table */}
          <StandingsContent standings={standings} theme={theme} />

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
