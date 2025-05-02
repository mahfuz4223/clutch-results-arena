
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const isMobile = useIsMobile();

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

  // Toggle between desktop and mobile view
  const toggleViewMode = () => {
    setViewMode(prev => prev === "desktop" ? "mobile" : "desktop");
    // Clear cached image when switching view modes
    setImageDataUrl(null);
  };

  // Set initial view mode based on device
  useEffect(() => {
    setViewMode(isMobile ? "mobile" : "desktop");
  }, [isMobile]);

  return {
    cardRef,
    isGenerating,
    setIsGenerating,
    imageDataUrl,
    setImageDataUrl,
    errorMessage,
    setErrorMessage,
    viewMode,
    toggleViewMode,
    matches,
    matchTitle,
  };
};
