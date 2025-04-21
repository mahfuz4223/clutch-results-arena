
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
    
    // Use more reliable approach with promises
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        toPng(element, exportOptions)
          .then(dataUrl => {
            console.log("Image generated successfully");
            resolve(dataUrl);
          })
          .catch(error => {
            console.error("Error in toPng:", error);
            reject(error);
          });
      }, 200); // Small delay to ensure rendering is complete
    });
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
    // Create blob from data URL for more reliable downloads
    const blob = dataURLtoBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link); // Need to append to body for Firefox
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast.success(`${fileName} downloaded successfully!`);
  } catch (error) {
    console.error("Error downloading image:", error);
    toast.error("Failed to download image. Please try copying the preview image instead.");
  }
};

/**
 * Convert a data URL to a Blob
 */
const dataURLtoBlob = (dataURL: string): Blob => {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
