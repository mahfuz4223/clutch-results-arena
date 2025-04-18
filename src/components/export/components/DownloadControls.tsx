
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileImage, File, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DownloadControlsProps {
  onDownloadImage: () => Promise<void>;
  onDownloadPdf: () => Promise<void>;
}

const DownloadControls: React.FC<DownloadControlsProps> = ({
  onDownloadImage,
  onDownloadPdf
}) => {
  const [isDownloadingImage, setIsDownloadingImage] = React.useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false);

  const handleDownloadImage = async () => {
    try {
      setIsDownloadingImage(true);
      await onDownloadImage();
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      await onDownloadPdf();
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      <Button 
        onClick={handleDownloadImage} 
        className="bg-blue-600 hover:bg-blue-700 flex items-center"
        disabled={isDownloadingImage}
      >
        {isDownloadingImage ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <FileImage className="w-4 h-4 mr-2" />
        )}
        Download as PNG
      </Button>
      
      <Button 
        variant="outline"
        onClick={handleDownloadPdf}
        className="flex items-center"
        disabled={isDownloadingPdf}
      >
        {isDownloadingPdf ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <File className="w-4 h-4 mr-2" />
        )}
        Download as PDF
      </Button>
    </div>
  );
};

export default DownloadControls;
