
import { toPng, Options } from 'html-to-image';
import { toast } from 'sonner';

/**
 * Utility function to export an HTML element as an image
 */
export const exportElementAsImage = async (
  element: HTMLElement | null, 
  fileName: string,
  options: Partial<Options> = {}
): Promise<string | null> => {
  if (!element) {
    toast.error("Could not find element to export");
    return null;
  }
  
  try {
    // Default options
    const exportOptions: Options = {
      quality: 0.95,
      backgroundColor: "#000000",
      canvasWidth: 1000,
      canvasHeight: 720,
      skipAutoScale: true,
      ...options
    };
    
    // Generate the image
    const dataUrl = await toPng(element, exportOptions);
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
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
  toast.success(`${fileName} downloaded successfully!`);
};
