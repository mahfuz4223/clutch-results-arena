
import React from "react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  viewMode: "desktop" | "mobile";
  toggleViewMode: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, toggleViewMode }) => {
  return (
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
  );
};

export default ViewToggle;
