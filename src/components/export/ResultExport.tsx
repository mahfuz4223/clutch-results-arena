
import React, { useRef, useState, useEffect } from "react";
import { Team, Day, Match, ThemeOption, CustomizationOptions } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, Share2, Image, Smartphone, AlertCircle, Camera } from "lucide-react";
import { toast } from "sonner";
import { exportElementAsImage, downloadDataUrl, useImageFormat } from "@/utils/imageExport";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopResultBanner from "./DesktopResultBanner";
import MobileResultBanner from "./MobileResultBanner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [browserInfo, setBrowserInfo] = useState<string>("");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const isMobile = useIsMobile();
  const imageFormat = useImageFormat();
  const [canvasSupported, setCanvasSupported] = useState<boolean>(true);

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

  // Detect browser and device information and check canvas support
  useEffect(() => {
    // Check browser
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
    
    // Check canvas support
    try {
      const canvas = document.createElement('canvas');
      const isSupported = !!(canvas.getContext && canvas.getContext('2d'));
      setCanvasSupported(isSupported);
      
      // Clean up
      canvas.remove();
    } catch (e) {
      console.error("Canvas check failed:", e);
      setCanvasSupported(false);
    }
    
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
        quality: 0.95,
        pixelRatio: 2,
        skipAutoScale: false,
        cacheBust: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${cardRef.current.offsetWidth}px`,
          height: `${cardRef.current.offsetHeight}px`,
        },
      };
      
      const dataUrl = await exportElementAsImage(cardRef.current, fileName, exportOptions, imageFormat);
      
      if (dataUrl) {
        setImageDataUrl(dataUrl);
        toast.success("Image generated successfully!");
        return dataUrl;
      } else {
        setErrorMessage("Image generation failed. Try taking a screenshot instead.");
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
      
      // Try direct download first
      let dataUrl = imageDataUrl;
      
      // If we don't have a cached image or it's a fresh request, generate a new one
      if (!dataUrl) {
        dataUrl = await generateImage();
      }
      
      if (dataUrl) {
        const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.${imageFormat}`;
        downloadDataUrl(dataUrl, fileName);
      } else {
        toast.error("Failed to generate image for download");
        setErrorMessage("Could not create image. Please try the screenshot option below.");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      setErrorMessage("Download failed. Please use the screenshot method below.");
      toast.error("Download failed");
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
    } else {
      toast.info("Press your device's screenshot shortcut to capture this screen", { duration: 8000 });
    }
  };

  // Function to share/copy the image
  const shareImage = async () => {
    setIsGenerating(true);
    try {
      // Always generate a fresh image for sharing to ensure latest data
      let dataUrl = imageDataUrl;
      
      if (!dataUrl) {
        dataUrl = await generateImage();
      }
      
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
          toast.success("Image URL copied to clipboard!");
        } catch (textErr) {
          // Last resort: trigger download
          const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.${imageFormat}`;
          downloadDataUrl(dataUrl, fileName);
        }
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      toast.error("Failed to share image");
      setErrorMessage("Sharing failed. Please use the screenshot method.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle between desktop and mobile view
  const toggleViewMode = () => {
    setViewMode(prev => prev === "desktop" ? "mobile" : "desktop");
    // Clear cached image when switching view modes
    setImageDataUrl(null);
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

      {/* Action buttons - Improved UI with better mobile support */}
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        <Button 
          onClick={downloadImage} 
          className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 flex items-center gap-2 px-6 w-full sm:w-auto"
          disabled={isGenerating}
          size="lg"
        >
          <Download className="w-5 h-5" />
          {isGenerating ? "Processing..." : `Download as JPG`}
        </Button>
        
        <Button 
          onClick={shareImage}
          variant="outline"
          disabled={isGenerating}
          className="flex items-center gap-2 w-full sm:w-auto"
          size="lg"
        >
          <Share2 className="w-5 h-5" />
          Share / Copy
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
      
      {/* Browser compatibility notice */}
      {browserInfo && (
        <div className="text-center text-xs text-muted-foreground mt-2">
          Using {browserInfo} browser | Format: JPG | View: {viewMode}
        </div>
      )}
      
      {/* Error message display with improved styling */}
      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Help message for users experiencing issues */}
      <div className="mt-4 text-center">
        <Badge variant="outline" className="text-xs py-1.5 px-3 flex items-center justify-center gap-1.5 mx-auto">
          <AlertCircle className="h-3 w-3" />
          Having trouble? Use the Screenshot Help button for an alternative method
        </Badge>
      </div>
      
      {/* Preview image if available */}
      {imageDataUrl && (
        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="bg-card p-4">
            <h3 className="text-lg font-medium mb-2">Generated Preview</h3>
            <div className="flex justify-center">
              <img 
                src={imageDataUrl} 
                alt="Generated Preview" 
                className="max-w-full h-auto rounded-md shadow-md"
                style={{ maxHeight: "500px" }}
              />
            </div>
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Right-click on the image to save it manually if the download button doesn't work
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultExport;
