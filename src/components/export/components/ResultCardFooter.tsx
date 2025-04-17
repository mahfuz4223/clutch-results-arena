
import React from "react";
import { ThemeOption } from "@/types";

interface ResultCardFooterProps {
  theme: ThemeOption;
  customFooterText?: string;
}

const ResultCardFooter: React.FC<ResultCardFooterProps> = ({
  theme,
  customFooterText = "Generated with TournaNext"
}) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 ${theme.headerBg}`}>
      <div className="flex items-center">
        <img 
          src="/public/lovable-uploads/208256eb-7194-493e-b6f2-1bb74a96f28d.png" 
          alt="PUBG Mobile" 
          className="h-8 mr-2" 
        />
        <span className="text-sm text-white/70">© PUBG MOBILE</span>
      </div>
      <div className="text-sm text-white/70">{customFooterText}</div>
    </div>
  );
};

export default ResultCardFooter;
