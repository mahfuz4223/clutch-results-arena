
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

/**
 * Utility function to export an HTML element as an image
 */
export const exportElementAsImage = async (
  element: HTMLElement | null, 
  fileName: string,
  options: any = {}
): Promise<string | null> => {
  if (!element) {
    toast.error("Could not find element to export");
    return null;
  }
  
  try {
    // Default options with improved settings
    const exportOptions = {
      quality: 0.95,
      backgroundColor: "#000000",
      canvasWidth: element.offsetWidth || 1000,
      canvasHeight: element.offsetHeight || 720,
      skipAutoScale: false,
      pixelRatio: 2, // Higher quality
      ...options
    };
    
    console.log("Starting image generation with options:", exportOptions);
    console.log("Element dimensions:", element.offsetWidth, "x", element.offsetHeight);
    
    // Generate the image
    const dataUrl = await toPng(element, exportOptions);
    console.log("Image generated successfully");
    return dataUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error("Failed to generate image. Please try again later.");
    return null;
  }
};

/**
 * Download a data URL as a file
 */
export const downloadDataUrl = (dataUrl: string, fileName: string): void => {
  try {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link); // Need to append to body for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
    toast.success(`${fileName} downloaded successfully!`);
  } catch (error) {
    console.error("Error downloading image:", error);
    toast.error("Failed to download image. Please try again.");
  }
};
