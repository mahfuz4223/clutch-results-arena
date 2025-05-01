
import React, { useRef, useState, useEffect } from "react";
import { Team, Day, Match, ThemeOption, CustomizationOptions } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, Share2, Image, Smartphone, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { exportElementAsImage, downloadDataUrl, useImageFormat } from "@/utils/imageExport";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopResultBanner from "./DesktopResultBanner";
import MobileResultBanner from "./MobileResultBanner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ResultExportProps {
  tournament: string;
  teams: Team[];
  days: Day[];
  selectedDay?: string;
  format?: "day" | "match";
  selectedMatch?: string;
  customization: CustomizationOptions;
}

const ResultExport: React.FC<ResultExportProps> = ({
  tournament,
  teams,
  days,
  selectedDay = "all",
  format = "day",
  selectedMatch,
  customization
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [browserInfo, setBrowserInfo] = useState<string>("");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const isMobile = useIsMobile();
  const imageFormat = useImageFormat();

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

  // Detect browser and device information
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    
    if (userAgent.indexOf("Chrome") !== -1) {
      browserName = "Chrome";
    } else if (userAgent.indexOf("Firefox") !== -1) {
      browserName = "Firefox";
    } else if (userAgent.indexOf("Edge") !== -1) {
      browserName = "Edge";
    } else if (userAgent.indexOf("Safari") !== -1) {
      browserName = "Safari";
    } else if (userAgent.indexOf("Opera") !== -1 || userAgent.indexOf("OPR") !== -1) {
      browserName = "Opera";
    }
    
    setBrowserInfo(browserName);
    
    // Set initial view mode based on device
    setViewMode(isMobile ? "mobile" : "desktop");
  }, [isMobile]);

  // Function to generate the image
  const generateImage = async (): Promise<string | null> => {
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      if (!cardRef.current) {
        toast.error("Could not capture the results banner");
        return null;
      }
      
      toast.info(`Generating ${imageFormat.toUpperCase()} image...`, { duration: 2000 });
      
      // Wait for any state updates to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.${imageFormat}`;
      
      // Set browser-specific options
      const exportOptions = {
        backgroundColor: "#000000",
        quality: 0.9,
        pixelRatio: 2,
        skipAutoScale: false,
        cacheBust: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      };
      
      const dataUrl = await exportElementAsImage(cardRef.current, fileName, exportOptions, imageFormat);
      
      if (dataUrl) {
        setImageDataUrl(dataUrl);
        toast.success("Image generated successfully!");
        return dataUrl;
      } else {
        setErrorMessage("Image generation failed. Try using a different browser.");
        toast.error("Failed to generate image");
        return null;
      }
    } catch (error) {
      console.error("Error in generateImage:", error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast.error("Image generation failed");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to download the image
  const downloadImage = async () => {
    setIsGenerating(true);
    try {
      // Always generate a fresh image for download to ensure latest data
      toast.info("Preparing download...");
      const dataUrl = await generateImage();
      
      if (dataUrl) {
        const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.${imageFormat}`;
        downloadDataUrl(dataUrl, fileName);
      } else {
        toast.error("Failed to generate image for download");
        setErrorMessage("Download failed. Please try the screenshot method below.");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      setErrorMessage("Download failed. Please try the screenshot method below.");
      toast.error("Download failed");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to share/copy the image
  const shareImage = async () => {
    setIsGenerating(true);
    try {
      // Always generate a fresh image for sharing to ensure latest data
      const dataUrl = await generateImage();
      
      if (!dataUrl) {
        return;
      }
      
      // Try Web Share API first (mobile friendly)
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await fetch(dataUrl).then(r => r.blob());
          const file = new File([blob], `${tournament}-results.${imageFormat}`, { type: blob.type });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `${tournament} Results`,
              text: `Check out the latest standings for ${tournament}!`
            });
            toast.success("Shared successfully!");
            return;
          }
        } catch (shareErr) {
          console.error("Share API failed:", shareErr);
        }
      }
      
      // Fall back to clipboard
      try {
        const blob = await fetch(dataUrl).then(r => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        toast.success("Image copied to clipboard!");
      } catch (clipboardErr) {
        console.error("Clipboard API failed:", clipboardErr);
        
        // Fallback to text copying
        try {
          await navigator.clipboard.writeText(dataUrl);
          toast.success("Image URL copied!");
        } catch (textErr) {
          // Last resort: trigger download
          const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.${imageFormat}`;
          downloadDataUrl(dataUrl, fileName);
        }
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      toast.error("Failed to share image");
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle between desktop and mobile view
  const toggleViewMode = () => {
    setViewMode(prev => prev === "desktop" ? "mobile" : "desktop");
  };

  return (
    <div className="relative space-y-4">
      {/* View mode toggle */}
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          className="flex items-center gap-2"
        >
          <Smartphone className="h-4 w-4" />
          {viewMode === "desktop" ? "Switch to Mobile View" : "Switch to Desktop View"}
        </Button>
      </div>
      
      {/* Banner */}
      <div ref={cardRef} className="flex justify-center">
        {viewMode === "desktop" ? (
          <DesktopResultBanner
            tournament={tournament}
            teams={teams}
            matches={matches}
            title={matchTitle}
          />
        ) : (
          <MobileResultBanner
            tournament={tournament}
            teams={teams}
            matches={matches}
            title={matchTitle}
          />
        )}
      </div>

      {/* Action buttons - Simplified and more professional UI */}
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        <Button 
          onClick={downloadImage} 
          className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 flex items-center gap-2 px-6"
          disabled={isGenerating}
          size="lg"
        >
          <Download className="w-5 h-5" />
          {isGenerating ? "Generating..." : `Download as ${imageFormat.toUpperCase()}`}
        </Button>
        
        <Button 
          onClick={shareImage}
          variant="outline"
          disabled={isGenerating}
          className="flex items-center gap-2"
          size="lg"
        >
          <Share2 className="w-5 h-5" />
          Share
        </Button>
        
        <Button
          onClick={generateImage}
          variant="secondary"
          disabled={isGenerating}
          className="flex items-center gap-2"
          size="lg"
        >
          <Image className="w-5 h-5" />
          Preview
        </Button>
      </div>
      
      {/* Error message display */}
      {errorMessage && (
        <div className="mt-4">
          <Badge variant="error" className="text-sm py-1.5 px-3 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </Badge>
        </div>
      )}
      
      {/* Preview image if available */}
      {imageDataUrl && (
        <div className="mt-6 border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Right-click on the image to save it manually</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>View Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="flex justify-center">
                    <img 
                      src={imageDataUrl} 
                      alt="Generated Preview" 
                      className="max-w-full h-auto rounded-md shadow-md"
                      style={{ maxHeight: "500px" }}
                    />
                  </div>
                </TableCell>
                <TableCell>{imageFormat.toUpperCase()}</TableCell>
                <TableCell>{viewMode === "desktop" ? "Desktop Banner" : "Mobile Banner"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ResultExport;
