import React, { useRef, useState } from "react";
import { Team, Day, CustomizationOptions } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, Share2, Camera } from "lucide-react";
import { toast } from "sonner";
import { exportElementAsImage, downloadDataUrl } from "@/utils/imageExport";
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
    
  // Set initial view mode based on device
  React.useEffect(() => {
    setViewMode(isMobile ? "mobile" : "desktop");
  }, [isMobile]);

  if (previewMode) {
    return (
      <div className="p-2 scale-50 origin-top">
        <div ref={cardRef}>
          {viewMode === "desktop" ? (
            <DesktopResultBanner
              tournament={tournament}
              teams={teams}
              matches={matches}
              title={matchTitle}
              customization={customization}
            />
          ) : (
            <MobileResultBanner
              tournament={tournament}
              teams={teams}
              matches={matches}
              title={matchTitle}
              customization={customization}
            />
          )}
        </div>
      </div>
    );
  }

  // Generate and download image
  const handleDownload = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      const banner = cardRef.current;
      if (!banner) {
        toast.error("Could not find the results banner");
        return;
      }
      
      toast.info("Generating image for download...");
      
      // Use the improved exportElementAsImage function
      const dataUrl = await exportElementAsImage(
        banner,
        `${tournament}-${matchTitle}.jpg`,
        { quality: 0.9, pixelRatio: 2 },
        'jpg'
      );
      
      if (dataUrl) {
        setImageDataUrl(dataUrl);
        const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.jpg`;
        downloadDataUrl(dataUrl, fileName);
      } else {
        setErrorMessage("Could not generate image. Please try the screenshot method below.");
      }
    } catch (error) {
      console.error("Download error:", error);
      setErrorMessage("Download failed. Please use the screenshot method below.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Share function
  const handleShare = async () => {
    try {
      let dataUrl = imageDataUrl;
      
      if (!dataUrl) {
        setIsGenerating(true);
        const banner = cardRef.current;
        if (!banner) return;
        
        dataUrl = await exportElementAsImage(
          banner,
          "share-image.jpg",
          { quality: 0.9, pixelRatio: 2 },
          'jpg'
        );
        
        setImageDataUrl(dataUrl);
        setIsGenerating(false);
      }
      
      if (dataUrl && navigator.share) {
        // Modern share API (mobile)
        try {
          const blob = await fetch(dataUrl).then(r => r.blob());
          const file = new File([blob], "tournament-results.jpg", { type: 'image/jpeg' });
          
          await navigator.share({
            files: [file],
            title: `${tournament} Results`,
            text: `Check out the latest standings for ${tournament}!`
          });
          toast.success("Shared successfully!");
          return;
        } catch (e) {
          console.log("Share API failed, falling back");
        }
      }
      
      // Fallback: copy to clipboard
      if (dataUrl) {
        try {
          const blob = await fetch(dataUrl).then(r => r.blob());
          const clipboardItem = new ClipboardItem({ [blob.type]: blob });
          await navigator.clipboard.write([clipboardItem]);
          toast.success("Image copied to clipboard!");
        } catch (clipErr) {
          toast.info("Please use the download button instead");
        }
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Sharing failed. Please try downloading instead.");
    }
  };
  
  // Function to take screenshot
  const takeScreenshot = () => {
    setErrorMessage(null);
    
    // Show instructions overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '20px';
    overlay.style.color = 'white';
    overlay.style.textAlign = 'center';
    
    // Device detection for specific instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMac = /Mac/.test(navigator.userAgent) && !isIOS;
    const isWindows = /Windows/.test(navigator.userAgent);
    
    let instructions = '';
    if (isIOS) {
      instructions = 'Press the Side button + Volume Up button together';
    } else if (isAndroid) {
      instructions = 'Press Power + Volume Down buttons together';
    } else if (isMac) {
      instructions = 'Press Command (⌘) + Shift + 4, then press Space and click on the window';
    } else if (isWindows) {
      instructions = 'Press Windows + Shift + S to open the snipping tool';
    } else {
      instructions = 'Use your device\'s screenshot function';
    }
    
    overlay.innerHTML = `
      <div style="max-width: 80%; background: #111; padding: 20px; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
        <h2 style="margin-bottom: 15px; font-size: 24px; color: #f5f5f5;">Screenshot Instructions</h2>
        <p style="margin-bottom: 20px; font-size: 16px;">The automated download isn't working on your device. Take a screenshot instead:</p>
        <p style="margin-bottom: 20px; font-size: 18px; color: #66ccff;"><b>${instructions}</b></p>
        <p style="margin-bottom: 30px; font-size: 16px;">Capture just the results table shown on your screen.</p>
        <button id="close-overlay" style="background: #dd2c5e; border: none; color: white; padding: 10px 20px; border-radius: 4px; font-size: 16px; cursor: pointer;">Got it</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add close button functionality
    const closeButton = document.getElementById('close-overlay');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });
    }
    
    // Auto close after 10 seconds
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 10000);
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
            customization={customization}
          />
        ) : (
          <MobileResultBanner
            tournament={tournament}
            teams={teams}
            matches={matches}
            title={matchTitle}
            customization={customization}
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
