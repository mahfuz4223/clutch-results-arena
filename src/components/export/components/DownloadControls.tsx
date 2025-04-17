
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileImage, File } from "lucide-react";

interface DownloadControlsProps {
  onDownloadImage: () => void;
  onDownloadPdf: () => void;
}

const DownloadControls: React.FC<DownloadControlsProps> = ({
  onDownloadImage,
  onDownloadPdf
}) => {
  return (
    <div className="mt-4 flex gap-2">
      <Button 
        onClick={onDownloadImage} 
        className="bg-blue-600 hover:bg-blue-700 flex items-center"
      >
        <FileImage className="w-4 h-4 mr-2" />
        Download as PNG
      </Button>
      
      <Button 
        variant="outline"
        onClick={onDownloadPdf}
        className="flex items-center"
      >
        <File className="w-4 h-4 mr-2" />
        Download as PDF
      </Button>
    </div>
  );
};

export default DownloadControls;
