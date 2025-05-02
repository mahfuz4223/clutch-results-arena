
import React from "react";
import { Team, Day, CustomizationOptions } from "@/types";
import DesktopResultBanner from "./DesktopResultBanner";
import ActionButtons from "./components/ActionButtons";
import ImagePreview from "./components/ImagePreview";
import { useResultExport } from "./hooks/useResultExport";

interface ResultExportProps {
  tournament: string;
  teams: Team[];
  days: Day[];
  selectedDay?: string;
  format?: "day" | "match";
  selectedMatch?: string;
  customization: CustomizationOptions;
  previewMode?: boolean;
}

const ResultExport: React.FC<ResultExportProps> = ({
  tournament,
  teams,
  days,
  selectedDay = "all",
  format = "day",
  selectedMatch,
  customization,
  previewMode = false
}) => {
  const {
    cardRef,
    isGenerating,
    setIsGenerating,
    imageDataUrl,
    setImageDataUrl,
    errorMessage,
    setErrorMessage,
    viewMode,
    matches,
    matchTitle
  } = useResultExport(tournament, days, selectedDay, format, selectedMatch);

  if (previewMode) {
    return (
      <div className="p-2 scale-50 origin-top">
        <div ref={cardRef}>
          <DesktopResultBanner
            tournament={tournament}
            teams={teams}
            matches={matches}
            title={matchTitle}
            customization={customization}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div ref={cardRef} className="flex justify-center">
        <DesktopResultBanner
          tournament={tournament}
          teams={teams}
          matches={matches}
          title={matchTitle}
          customization={customization}
        />
      </div>

      {/* Action buttons and error message */}
      <ActionButtons
        cardRef={cardRef}
        tournament={tournament}
        matchTitle={matchTitle}
        imageDataUrl={imageDataUrl}
        setImageDataUrl={setImageDataUrl}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      
      {/* Preview image if available */}
      <ImagePreview imageDataUrl={imageDataUrl} />
    </div>
  );
};

export default ResultExport;
