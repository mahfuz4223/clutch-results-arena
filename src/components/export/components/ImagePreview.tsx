
import React from "react";

interface ImagePreviewProps {
  imageDataUrl: string | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageDataUrl }) => {
  if (!imageDataUrl) return null;
  
  return (
    <div className="mt-8 border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2">Preview Image (1240 × 720 px)</h3>
      <div className="flex justify-center">
        <img 
          src={imageDataUrl} 
          alt="Tournament Results" 
          className="max-w-full h-auto rounded-md shadow-md"
          style={{ maxWidth: "1240px", maxHeight: "720px" }}
        />
      </div>
      <div className="text-center mt-3 text-sm text-muted-foreground">
        Right-click on the image to save it manually if the download button doesn't work
      </div>
    </div>
  );
};

export default ImagePreview;
