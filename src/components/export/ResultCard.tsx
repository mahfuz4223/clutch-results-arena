
import React, { useRef, useState, useEffect } from "react";
import { Team, Day, Match, ThemeOption, CustomizationOptions } from "@/types";
import { calculateOverallStandings } from "@/utils/pointCalculator";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileDown, Image } from "lucide-react";
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

  useEffect(() => {
    if (customization.cssPreset && customization.cssPreset !== "none") {
      setCustomStyles(getCssPresetById(customization.cssPreset));
    } else {
      setCustomStyles(customization.customCss || "");
    }
  }, [customization.cssPreset, customization.customCss]);

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

  // Function to generate the image
  const generateImage = async (): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      if (!cardRef.current) {
        toast.error("Failed to find the element to export");
        return null;
      }
      
      toast.info("Generating image...");
      console.log("Starting image generation process");
      
      // Wait for any state updates to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const fileName = `${tournament}-${matchTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
      
      // Set a fixed size for more consistent results
      const exportOptions = {
        backgroundColor: "#000000",
        quality: 1.0,
        pixelRatio: 2,
        skipAutoScale: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      };
      
      console.log("Using export options:", exportOptions);
      
      const dataUrl = await exportElementAsImage(cardRef.current, fileName, exportOptions);
      
      if (dataUrl) {
        setImageDataUrl(dataUrl);
        console.log("Image generated successfully!");
        toast.success("Image generated successfully!");
        return dataUrl;
      } else {
        console.error("Failed to generate image dataUrl");
        toast.error("Failed to generate image. Try refreshing the page.");
        return null;
      }
    } catch (error) {
      console.error("Error in generateImage:", error);
      toast.error("Failed to generate image. Please try again or use browser screenshot.");
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
        toast.error("Failed to generate image for download. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Download failed. Try using the preview image.");
    }
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

  return (
    <div className="relative">
      <style>{customStyles}</style>
      <div 
        ref={cardRef}
        className={`result-card w-[1000px] h-[720px] rounded-lg overflow-hidden shadow-xl ${theme.background} relative`}
        style={{ 
          backgroundImage: backgroundImage ? 
            `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${backgroundImage}')` :
            undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        {customization.showGridLines && (
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src="/public/lovable-uploads/ef62d711-f3b9-47c8-97a6-39cb861a0425.png" 
              alt="Grid Lines" 
              className="w-full h-full object-cover"
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
            />
          </div>
        )}
        
        {/* Left Side Character */}
        <div className="absolute bottom-0 left-0 h-52 opacity-80 z-0 hidden md:block">
          <img 
            src="/public/lovable-uploads/c774f54c-53d5-40d5-92ad-cbaa38bf1e99.png" 
            alt="PUBG Character" 
            className="h-full object-contain"
          />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-10 pb-6 relative z-10">
          <div className="flex items-center mb-2">
            {customization.showTournamentLogo && (
              <img 
                src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png" 
                alt="PUBG Mobile" 
                className="h-16 mr-4"
              />
            )}
            <div>
              <h1 className={`header-title text-3xl font-bold uppercase ${theme.textColor} drop-shadow-lg`}>{tournament}</h1>
              <div className={`h-1 w-full ${theme.accentColor} my-1 rounded-full`}></div>
            </div>
          </div>
          <h2 className={`day-title text-3xl font-bold uppercase ${theme.textColor} mt-3 tracking-wider drop-shadow-lg px-4 py-1 ${theme.accentColor === 'bg-teal-400' ? 'border-2 border-teal-400' : ''}`}>{matchTitle}</h2>
        </div>

        {/* Results Table */}
        <div className="px-8 pb-8 relative z-10">
          <div className="flex justify-between gap-4">
            {/* Left Column */}
            <div className="w-[48%]">
              <table className={`w-full border-collapse ${theme.textColor}`}>
                <thead className={`table-header text-sm uppercase ${theme.headerBg} tracking-wider`}>
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
                        table-row ${theme.tableBg} border-b ${theme.borderColor}
                        ${index === 0 ? "bg-yellow-900/30" : ""}
                        ${index === 1 ? "bg-gray-500/20" : ""}
                        ${index === 2 ? "bg-amber-800/20" : ""}
                      `}
                    >
                      <td className="py-3 px-2 font-bold team-rank">#{standing.rank}</td>
                      <td className="py-3 px-2 font-medium">
                        {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                        {standing.teamName}
                      </td>
                      <td className="py-3 px-2 text-center">{standing.wwcd}</td>
                      <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
                      <td className="py-3 px-2 text-center">{standing.totalKills}</td>
                      <td className="py-3 px-2 text-center font-bold total-points">{standing.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Column */}
            <div className="w-[48%]">
              <table className={`w-full border-collapse ${theme.textColor}`}>
                <thead className={`table-header text-sm uppercase ${theme.headerBg} tracking-wider`}>
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
                  {rightColumnStandings.map((standing) => (
                    <tr key={standing.teamId} className={`table-row ${theme.tableBg} border-b ${theme.borderColor}`}>
                      <td className="py-3 px-2 font-bold team-rank">#{standing.rank}</td>
                      <td className="py-3 px-2 font-medium">
                        {standing.teamFlag && <span className="mr-2">{standing.teamFlag}</span>}
                        {standing.teamName}
                      </td>
                      <td className="py-3 px-2 text-center">{standing.wwcd}</td>
                      <td className="py-3 px-2 text-center">{standing.totalPlacementPoints}</td>
                      <td className="py-3 px-2 text-center">{standing.totalKills}</td>
                      <td className="py-3 px-2 text-center font-bold total-points">{standing.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`footer absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 ${theme.headerBg}`}>
          {customization.showTencentLogo && (
            <div className="flex items-center">
              <img 
                src="/public/lovable-uploads/49b6f4b0-4b79-45ae-a219-75aae6f4d80b.png" 
                alt="Tencent" 
                className="h-6 mr-2"
              />
              <span className="text-sm text-white/70">KRAFTON Inc.</span>
            </div>
          )}
          <div className="text-sm text-white/70">© PUBG Mobile Tournament Maker</div>
          {customization.showSponsors && (
            <div className="flex items-center">
              <img 
                src="/public/lovable-uploads/bd54bf89-10e1-438a-8bda-917ff62a1e6d.png" 
                alt="PUBG Mobile" 
                className="h-8 mr-2" 
              />
              <span className="text-sm text-white/70">Official Tournament Results</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button 
          onClick={downloadImage} 
          className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
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
          Share
        </Button>
        
        <Button
          onClick={() => {
            navigator.clipboard.writeText(customStyles);
            toast.success("CSS copied to clipboard!");
          }}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <FileDown className="w-4 h-4" />
          Copy CSS
        </Button>
        
        <Button
          onClick={generateImage}
          variant="outline"
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Generate Preview"}
        </Button>
      </div>
      
      {/* Help Badge */}
      <div className="mt-3">
        <Badge variant="outline" className="bg-black/5">
          Having trouble? Try clicking "Generate Preview" first, then "Download Image". Refresh the page if issues persist.
        </Badge>
      </div>
      
      {/* Preview image if available */}
      {imageDataUrl && (
        <div className="mt-4 border rounded p-4">
          <h3 className="text-sm font-medium mb-2">Preview (Right-click to save as alternative download method)</h3>
          <img src={imageDataUrl} alt="Generated Preview" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default ResultCard;
