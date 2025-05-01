
import React, { useRef, useState, useEffect } from "react";
import { Team, Day, Match, ThemeOption, CustomizationOptions } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileDown, Image, Youtube, Facebook, Instagram, MessageCircle, AlertCircle } from "lucide-react";
import { getBackgroundById, getCssPresetById } from "@/utils/themes";
import { toast } from "sonner";
import { exportElementAsImage, downloadDataUrl } from "@/utils/imageExport";
import { Badge } from "@/components/ui/badge";

interface ResultCardProps {
  tournament: string;
  teams: Team[];
  days: Day[];
  selectedDay?: string;
  theme: ThemeOption;
  format?: "day" | "match";
  selectedMatch?: string;
  customization: CustomizationOptions;
}

const ResultCard: React.FC<ResultCardProps> = ({
  tournament,
  teams,
  days,
  selectedDay = "all",
  theme,
  format = "day",
  selectedMatch,
  customization
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [customStyles, setCustomStyles] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [browserInfo, setBrowserInfo] = useState<string>("");

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

  // Calculate standings 
  const standings = calculateOverallStandings(teams, matches);

  // For PMGO 2025 title
  const pmgoTitle = `2025 PMGO Prelims – ${matchTitle} [Day ${selectedDay === "all" ? "ALL" : selectedDay}]`;

  // Detect browser information
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
  }, []);

  useEffect(() => {
    if (customization.cssPreset && customization.cssPreset !== "none") {
      setCustomStyles(getCssPresetById(customization.cssPreset));
    } else {
      setCustomStyles(customization.customCss || "");
    }
  }, [customization.cssPreset, customization.customCss]);

  // Function to generate the image
  const generateImage = async (): Promise<string | null> => {
    setIsGenerating(true);
    setErrorMessage(null);
    
    try {
      if (!cardRef.current) {
        toast.error("Failed to find the element to export");
        return null;
      }
      
      toast.info(`Generating image for ${browserInfo}...`);
      console.log("Starting image generation process");
      
      // Wait for any state updates to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
      
      // Set browser-specific options
      const exportOptions = {
        backgroundColor: "#000000",
        quality: 1.0,
        pixelRatio: 2,
        skipAutoScale: false,
        cacheBust: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      };
      
      console.log("Using export options:", exportOptions);
      
      // Show longer toast for Chrome users
      if (browserInfo === "Chrome") {
        toast.info("Chrome requires additional processing time. Please wait...", {
          duration: 5000
        });
      }
      
      const dataUrl = await exportElementAsImage(cardRef.current, fileName, exportOptions);
      
      if (dataUrl) {
        setImageDataUrl(dataUrl);
        console.log("Image generated successfully!");
        toast.success("Image generated successfully!");
        return dataUrl;
      } else {
        console.error("Failed to generate image dataUrl");
        setErrorMessage("Image generation failed. Try using a different browser or the alternative method below.");
        toast.error("Failed to generate image. Try using the preview image.");
        return null;
      }
    } catch (error) {
      console.error("Error in generateImage:", error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast.error("Image generation failed. Try the alternative method below.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to download the image
  const downloadImage = async () => {
    try {
      let dataUrl = imageDataUrl;
      
      // If no image has been generated yet, generate one first
      if (!dataUrl) {
        toast.info("Generating image before download...");
        dataUrl = await generateImage();
      }
      
      if (dataUrl) {
        const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
        downloadDataUrl(dataUrl, fileName);
      } else {
        toast.error("Failed to generate image for download. Please try using the screenshot alternative.");
        setErrorMessage("Download failed. Please use the alternative method below.");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      setErrorMessage("Download failed. Please use the screenshot alternative.");
      toast.error("Download failed. Try using the preview image.");
    }
  };

  // Function for alternative download method
  const alternativeDownload = () => {
    if (!cardRef.current) {
      toast.error("Could not find the element to capture");
      return;
    }
    
    toast.info("Opening capture instructions...", { duration: 5000 });
    
    // Create instruction modal
    const instructions = document.createElement('div');
    instructions.style.position = 'fixed';
    instructions.style.top = '50%';
    instructions.style.left = '50%';
    instructions.style.transform = 'translate(-50%, -50%)';
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    instructions.style.padding = '20px';
    instructions.style.borderRadius = '10px';
    instructions.style.zIndex = '9999';
    instructions.style.color = 'white';
    instructions.style.maxWidth = '450px';
    instructions.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    
    instructions.innerHTML = `
      <h3 style="font-size: 16px; margin-bottom: 10px; color: #66ccff; font-weight: bold;">Screenshot Instructions</h3>
      <p style="margin-bottom: 15px; font-size: 14px;">The automatic download didn't work. Please take a screenshot:</p>
      <ul style="list-style-type: circle; padding-left: 20px; margin-bottom: 15px; font-size: 14px;">
        <li style="margin-bottom: 5px;">Windows: Use <strong>Windows+Shift+S</strong> to capture</li>
        <li style="margin-bottom: 5px;">Mac: Use <strong>Cmd+Shift+4</strong> to capture</li>
        <li style="margin-bottom: 5px;">Or use your browser's screenshot tool</li>
      </ul>
      <p style="margin-bottom: 15px; font-size: 14px;">Capture the result card displayed on the page</p>
      <button id="close-instructions" style="background: #3399ff; border: none; padding: 8px 15px; border-radius: 5px; color: white; cursor: pointer; font-weight: bold;">Got it</button>
    `;
    
    document.body.appendChild(instructions);
    
    // Add event listener to close button
    const closeButton = document.getElementById('close-instructions');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        document.body.removeChild(instructions);
      });
    }
    
    // Auto-close after 10 seconds
    setTimeout(() => {
      if (document.body.contains(instructions)) {
        document.body.removeChild(instructions);
      }
    }, 10000);
  };

  // Function to share/copy the image
  const shareImage = async () => {
    try {
      const dataUrl = imageDataUrl || await generateImage();
      
      if (!dataUrl) {
        return;
      }
      
      try {
        // For modern browsers with clipboard API
        const blob = await fetch(dataUrl).then(r => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
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
          const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
          downloadDataUrl(dataUrl, fileName);
        }
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      toast.error("Failed to share image. Please try again");
    }
  };

  // Split standings into two columns
  const halfIndex = Math.ceil(standings.length / 2);
  const leftColumnStandings = standings.slice(0, halfIndex);
  const rightColumnStandings = standings.slice(halfIndex);

  // Get background image from customization
  const backgroundImage = getBackgroundById(customization.background);
  
  // Use PMGO style by default for this banner
  const isPmgoStyle = true;

  return (
    <div className="relative">
      <style>{customStyles}</style>
      <div 
        ref={cardRef}
        className={`result-card w-[1000px] h-[720px] rounded-lg overflow-hidden shadow-xl ${theme.background} relative`}
        style={{ 
          backgroundImage: backgroundImage ? 
            `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('${backgroundImage}')` :
            'linear-gradient(to bottom, #001a33, #000e1d)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* Grid Overlay */}
        {customization.showGridLines && (
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src="/public/lovable-uploads/ef62d711-f3b9-47c8-97a6-39cb861a0425.png" 
              alt="Grid Lines" 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        )}
        
        {/* Top Right Corner Logo */}
        {customization.showPubgLogo && (
          <div className="absolute top-5 right-5 h-16 z-10">
            <img 
              src="/public/lovable-uploads/bbd6b8ea-bb1e-4972-b550-d9f1b82ce551.png" 
              alt="PUBG Logo" 
              className="h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
        )}
        
        {/* Left Side Character */}
        <div className="absolute bottom-0 left-0 h-52 opacity-70 z-0 hidden md:block">
          <img 
            src="/public/lovable-uploads/c774f54c-53d5-40d5-92ad-cbaa38bf1e99.png" 
            alt="PUBG Character" 
            className="h-full object-contain"
            crossOrigin="anonymous"
          />
        </div>

        {/* Helicopter Graphic - Top Left */}
        <div className="absolute top-5 left-5 h-20 opacity-70 z-0">
          <img 
            src="/public/lovable-uploads/8ec78efa-0c83-458a-b34d-11d6da1a7045.png" 
            alt="Helicopter" 
            className="h-full object-contain"
            crossOrigin="anonymous"
          />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-10 pb-6 relative z-10">
          {customization.showTournamentLogo && (
            <div className="flex items-center mb-3">
              <img 
                src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png" 
                alt="PUBG Mobile" 
                className="h-16 mr-4"
                crossOrigin="anonymous"
              />
            </div>
          )}
          
          <div>
            <h1 className="header-title text-3xl font-bold uppercase text-white drop-shadow-lg">
              {isPmgoStyle ? (
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  {pmgoTitle}
                </span>
              ) : (
                <span className={`${theme.textColor}`}>{tournament}</span>
              )}
            </h1>
            <div className={`h-1 w-full ${isPmgoStyle ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : theme.accentColor} my-1 rounded-full`}></div>
          </div>
          
          {!isPmgoStyle && (
            <h2 className={`day-title text-3xl font-bold uppercase ${theme.textColor} mt-3 tracking-wider drop-shadow-lg px-4 py-1 ${theme.accentColor === 'bg-teal-400' ? 'border-2 border-teal-400' : ''}`}>
              {matchTitle}
            </h2>
          )}
        </div>

        {/* Results Table */}
        <div className="px-8 pb-8 relative z-10">
          <div className="flex justify-between gap-4">
            {/* Left Column */}
            <div className="w-[48%]">
              <table className={`w-full border-collapse ${isPmgoStyle ? 'text-white' : theme.textColor}`}>
                <thead className={`table-header text-sm uppercase ${
                  isPmgoStyle 
                    ? 'bg-gradient-to-r from-blue-900 to-cyan-800 text-cyan-300' 
                    : theme.headerBg
                } tracking-wider`}>
                  <tr>
                    <th className="py-3 px-2 text-left">RANK</th>
                    <th className="py-3 px-2 text-left">TEAM</th>
                    <th className="py-3 px-2 text-center">WWCD</th>
                    <th className="py-3 px-2 text-center">PLACE</th>
                    <th className="py-3 px-2 text-center">ELIMS</th>
                    <th className="py-3 px-2 text-center">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {leftColumnStandings.map((standing, index) => (
                    <tr 
                      key={standing.teamId} 
                      className={`
                        table-row ${isPmgoStyle ? (index % 2 === 0 ? 'bg-blue-900/60' : 'bg-blue-900/40') : theme.tableBg} 
                        border-b ${isPmgoStyle ? 'border-blue-700/30' : theme.borderColor}
                        ${index === 0 && isPmgoStyle ? "bg-gradient-to-r from-yellow-700/30 to-amber-800/30" : ""}
                        ${index === 1 && isPmgoStyle ? "bg-gradient-to-r from-gray-600/30 to-gray-700/30" : ""}
                        ${index === 2 && isPmgoStyle ? "bg-gradient-to-r from-amber-700/30 to-amber-800/30" : ""}
                        ${index === 0 && !isPmgoStyle ? "bg-yellow-900/30" : ""}
                        ${index === 1 && !isPmgoStyle ? "bg-gray-500/20" : ""}
                        ${index === 2 && !isPmgoStyle ? "bg-amber-800/20" : ""}
                      `}
                    >
                      <td className={`py-3 px-2 font-bold team-rank ${isPmgoStyle ? 'text-cyan-300' : ''}`}>#{standing.rank}</td>
                      <td className="py-3 px-2 font-medium">
                        {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                        {standing.teamName}
                      </td>
                      <td className="py-3 px-2 text-center">{standing.wwcd}</td>
                      <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
                      <td className="py-3 px-2 text-center">{standing.totalKills}</td>
                      <td className={`py-3 px-2 text-center font-bold total-points ${isPmgoStyle ? 'text-cyan-300' : ''}`}>{standing.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Column */}
            <div className="w-[48%]">
              <table className={`w-full border-collapse ${isPmgoStyle ? 'text-white' : theme.textColor}`}>
                <thead className={`table-header text-sm uppercase ${
                  isPmgoStyle 
                    ? 'bg-gradient-to-r from-blue-900 to-cyan-800 text-cyan-300' 
                    : theme.headerBg
                } tracking-wider`}>
                  <tr>
                    <th className="py-3 px-2 text-left">RANK</th>
                    <th className="py-3 px-2 text-left">TEAM</th>
                    <th className="py-3 px-2 text-center">WWCD</th>
                    <th className="py-3 px-2 text-center">PLACE</th>
                    <th className="py-3 px-2 text-center">ELIMS</th>
                    <th className="py-3 px-2 text-center">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {rightColumnStandings.map((standing, index) => (
                    <tr 
                      key={standing.teamId} 
                      className={`
                        table-row ${isPmgoStyle ? (index % 2 === 0 ? 'bg-blue-900/60' : 'bg-blue-900/40') : theme.tableBg} 
                        border-b ${isPmgoStyle ? 'border-blue-700/30' : theme.borderColor}
                      `}
                    >
                      <td className={`py-3 px-2 font-bold team-rank ${isPmgoStyle ? 'text-cyan-300' : ''}`}>#{standing.rank}</td>
                      <td className="py-3 px-2 font-medium">
                        {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                        {standing.teamName}
                      </td>
                      <td className="py-3 px-2 text-center">{standing.wwcd}</td>
                      <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
                      <td className="py-3 px-2 text-center">{standing.totalKills}</td>
                      <td className={`py-3 px-2 text-center font-bold total-points ${isPmgoStyle ? 'text-cyan-300' : ''}`}>{standing.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`footer absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 ${
          isPmgoStyle 
            ? 'bg-gradient-to-r from-blue-900 to-cyan-900' 
            : theme.headerBg
        }`}>
          {customization.showTencentLogo && (
            <div className="flex items-center">
              <img 
                src="/public/lovable-uploads/49b6f4b0-4b79-45ae-a219-75aae6f4d80b.png" 
                alt="Tencent" 
                className="h-6 mr-2"
                crossOrigin="anonymous"
              />
              <span className="text-sm text-white/70">KRAFTON Inc.</span>
            </div>
          )}
          
          {/* Watch the Action Live with Social Media Icons */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">WATCH THE ACTION LIVE:</span>
            <div className="flex gap-1">
              <Badge variant="social" className="p-1 cursor-pointer">
                <Youtube size={16} />
              </Badge>
              <Badge variant="social" className="p-1 cursor-pointer">
                <Facebook size={16} />
              </Badge>
              <Badge variant="social" className="p-1 cursor-pointer">
                <MessageCircle size={16} />
              </Badge>
              <Badge variant="social" className="p-1 cursor-pointer">
                <Instagram size={16} />
              </Badge>
            </div>
          </div>
          
          {customization.showSponsors && (
            <div className="flex items-center">
              <img 
                src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png" 
                alt="PUBG Mobile" 
                className="h-8 mr-2" 
                crossOrigin="anonymous"
              />
              <span className="text-sm text-white/70">Official Tournament Results</span>
            </div>
          )}
        </div>
      </div>

      {/* Download and Options */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button 
          onClick={downloadImage} 
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2"
          disabled={isGenerating}
        >
          <Download className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Download Image"}
        </Button>
        
        <Button 
          onClick={shareImage}
          variant="outline"
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Copy to Clipboard
        </Button>
        
        <Button
          onClick={generateImage}
          variant="secondary"
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate Preview"}
        </Button>
        
        <Button
          onClick={alternativeDownload}
          variant="outline"
          className="flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          Screenshot Help
        </Button>
      </div>
      
      {/* Error Message and Browser Info */}
      {errorMessage && (
        <div className="mt-3">
          <Badge variant="error" className="text-sm py-1.5 px-3 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </Badge>
        </div>
      )}
      
      {/* Help Badge */}
      <div className="mt-3">
        <Badge variant="help" className="text-sm py-1.5 px-3 flex items-center gap-1.5">
          <p>
            Using {browserInfo}? Try these steps:
            1) Click "Generate Preview" 
            2) If successful, click "Download" 
            3) If that fails, use "Screenshot Help" or right-click the preview image below
          </p>
        </Badge>
      </div>
      
      {/* Preview image if available */}
      {imageDataUrl && (
        <div className="mt-4 border rounded p-4">
          <h3 className="text-sm font-medium mb-2">Preview Image (Right-click to save)</h3>
          <img 
            src={imageDataUrl} 
            alt="Generated Preview" 
            className="max-w-full h-auto"
            style={{ maxHeight: "500px" }}
          />
        </div>
      )}
      
      {/* Browser-specific help */}
      <div className="mt-4 text-sm text-gray-500">
        <p>Detected browser: {browserInfo}</p>
      </div>
    </div>
  );
};

export default ResultCard;
