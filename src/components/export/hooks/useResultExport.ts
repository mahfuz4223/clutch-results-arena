
import { useState, useRef } from "react";
import { Day } from "@/types";

export const useResultExport = (
  tournament: string, 
  days: Day[], 
  selectedDay: string = "all", 
  format: "day" | "match" = "day", 
  selectedMatch?: string
) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const viewMode = "desktop"; // Fixed to desktop only

  // Get day title
  const dayTitle = selectedDay === "all" 
    ? "OVERALL STANDINGS" 
    : days.find(day => day.id === selectedDay)?.name || "OVERALL";

  // Get all matches based on selected day/match
  const matches = format === "match" && selectedMatch
    ? [days.flatMap(day => day.matches).find(match => match.id === selectedMatch)].filter(Boolean) as any[]
    : selectedDay === "all"
      ? days.flatMap(day => day.matches)
      : days.find(day => day.id === selectedDay)?.matches || [];

  const matchTitle = format === "match" && selectedMatch
    ? matches[0]?.name || "MATCH RESULTS"
    : dayTitle;

  return {
    cardRef,
    isGenerating,
    setIsGenerating,
    imageDataUrl,
    setImageDataUrl,
    errorMessage,
    setErrorMessage,
    viewMode,
    matches,
    matchTitle,
  };
};
