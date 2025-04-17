
import React from "react";
import { ThemeOption } from "@/types";
import { Youtube, Facebook, Twitch } from "lucide-react";

interface ResultCardFooterProps {
  theme: ThemeOption;
  customFooterText?: string;
}

const ResultCardFooter: React.FC<ResultCardFooterProps> = ({
  theme,
  customFooterText = "Generated with TournaNext"
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="text-center pb-2 pt-1 bg-black/80 text-white text-sm">
        <div className="flex justify-center items-center gap-2 mb-1">
          <span className="uppercase font-semibold text-xs">Watch the action live</span>
          <div className="flex gap-2">
            <Youtube className="h-4 w-4 text-red-500" />
            <Facebook className="h-4 w-4 text-blue-500" />
            <Twitch className="h-4 w-4 text-purple-500" />
          </div>
          <span className="uppercase font-semibold text-xs">PUBG MOBILE ESPORTS</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center p-3 bg-black text-white text-xs">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/6edad5ac-54a3-4f33-9b83-9e1679eecec0.png" 
            alt="PUBG Mobile" 
            className="h-6 mr-2" 
          />
          <span className="text-xs text-white/70">© PUBG MOBILE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>KRAFTON</span>
          <span>{customFooterText}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultCardFooter;
