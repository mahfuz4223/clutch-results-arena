
import React, { useRef, useState } from "react";
import { Team, Day, Match, CustomizationOptions } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, Share2, Camera } from "lucide-react";
import { toast } from "sonner";
import { exportElementAsImage, downloadDataUrl, useImageFormat } from "@/utils/imageExport";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopResultBanner from "./DesktopResultBanner";
import MobileResultBanner from "./MobileResultBanner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    
  // Set initial view mode based on device
  React.useEffect(() => {
    setViewMode(isMobile ? "mobile" : "desktop");
  }, [isMobile]);

  // Function to generate and download the image
  const handleDownload = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      if (!cardRef.current) {
        toast.error("Could not capture the results banner");
        return;
      }
      
      toast.info(`Preparing JPG image for download...`);
      
      // Wait for any state updates to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      
      const dataUrl = await exportElementAsImage(
        cardRef.current, 
        fileName, 
        {
          backgroundColor: "#000000",
          quality: 0.9,
          pixelRatio: 2
        }, 
        'jpg'
      );
      
      if (dataUrl) {
        setImageDataUrl(dataUrl);
        downloadDataUrl(dataUrl, fileName);
      } else {
        setErrorMessage("Could not generate image. Please try the screenshot method.");
        toast.error("Export failed");
      }
    } catch (error) {
      console.error("Error in download:", error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast.error("Download failed");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to share the image
  const handleShare = async () => {
    setIsGenerating(true);
    try {
      if (!cardRef.current) {
        toast.error("Could not capture the results banner");
        return;
      }
      
      toast.info(`Preparing to share...`);
      
      const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      
      const dataUrl = await exportElementAsImage(
        cardRef.current, 
        fileName, 
        {
          backgroundColor: "#000000",
          quality: 0.9,
          pixelRatio: 2
        }, 
        'jpg'
      );
      
      if (!dataUrl) {
        toast.error("Could not generate image for sharing");
        return;
      }
      
      setImageDataUrl(dataUrl);
      
      // Try Web Share API first (mobile friendly)
      if (navigator.share) {
        try {
          const blob = await fetch(dataUrl).then(r => r.blob());
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          
          await navigator.share({
            files: [file],
            title: `${tournament} Results`,
            text: `Check out the latest standings for ${tournament}!`
          });
          toast.success("Shared successfully!");
          return;
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
        // Last resort: trigger download
        downloadDataUrl(dataUrl, fileName);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      setErrorMessage("Sharing failed. Please use the screenshot method.");
      toast.error("Share failed");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Function to take screenshot
  const takeScreenshot = () => {
    setErrorMessage(null);
    toast.info("Please capture your screen using your device's screenshot function:");
    
    // Show instructions based on device/OS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMacOS = /Mac/.test(navigator.userAgent) && !isIOS;
    const isWindows = /Windows/.test(navigator.userAgent);
    
    if (isIOS) {
      toast.info("iOS: Press Side button + Volume Up buttons together", { duration: 8000 });
    } else if (isAndroid) {
      toast.info("Android: Press Power + Volume Down buttons together", { duration: 8000 });
    } else if (isMacOS) {
      toast.info("Mac: Press Command (⌘) + Shift + 4, then Space to capture a window", { duration: 8000 });
    } else if (isWindows) {
      toast.info("Windows: Press Windows + Shift + S to open the snipping tool", { duration: 8000 });
    }
  };

  // Toggle between desktop and mobile view
  const toggleViewMode = () => {
    setViewMode(prev => prev === "desktop" ? "mobile" : "desktop");
    // Clear cached image when switching view modes
    setImageDataUrl(null);
  };

  return (
    <div className="space-y-6">
      {/* View mode toggle */}
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          className="flex items-center gap-2"
        >
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

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center mt-8">
        <Button 
          onClick={handleDownload} 
          className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 flex items-center gap-2 px-6 w-full sm:w-auto"
          disabled={isGenerating}
          size="lg"
        >
          <Download className="w-5 h-5" />
          {isGenerating ? "Processing..." : "Download as JPG"}
        </Button>
        
        <Button 
          onClick={handleShare}
          variant="outline"
          disabled={isGenerating}
          className="flex items-center gap-2 w-full sm:w-auto"
          size="lg"
        >
          <Share2 className="w-5 h-5" />
          Share Image
        </Button>
        
        <Button
          onClick={takeScreenshot}
          variant="secondary"
          className="flex items-center gap-2 w-full sm:w-auto"
          size="lg"
        >
          <Camera className="w-5 h-5" />
          Screenshot Help
        </Button>
      </div>
      
      {/* Error message display */}
      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Help message */}
      <div className="mt-4 text-center">
        <Badge variant="outline" className="text-xs py-1.5 px-3 flex items-center justify-center mx-auto">
          Having trouble? Use the Screenshot Help button for an alternative method
        </Badge>
      </div>
      
      {/* Preview image if available */}
      {imageDataUrl && (
        <div className="mt-8 border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Preview Image</h3>
          <div className="flex justify-center">
            <img 
              src={imageDataUrl} 
              alt="Tournament Results" 
              className="max-w-full h-auto rounded-md shadow-md"
              style={{ maxHeight: "500px" }}
            />
          </div>
          <div className="text-center mt-3 text-sm text-muted-foreground">
            Right-click on the image to save it manually if the download button doesn't work
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultExport;
