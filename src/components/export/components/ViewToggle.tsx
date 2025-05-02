
import React from "react";
import { Button } from "@/components/ui/button";
import { Desktop } from "lucide-react";

interface ViewToggleProps {
  viewMode: "desktop";
}

const ViewToggle: React.FC<ViewToggleProps> = () => {
  return (
    <div className="flex justify-end mb-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        disabled
      >
        <Desktop className="h-4 w-4" /> Desktop View Only
      </Button>
    </div>
  );
};

export default ViewToggle;
