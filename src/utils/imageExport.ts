
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
    
    // Add CSS class to prevent scrollbars during capture
    element.classList.add('exporting');
    
    // Use more reliable approach with promises and delays
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        toPng(element, exportOptions)
          .then(dataUrl => {
            console.log("Image generated successfully");
            element.classList.remove('exporting');
            resolve(dataUrl);
          })
          .catch(error => {
            console.error("Error in toPng:", error);
            element.classList.remove('exporting');
            
            // Try again with different settings if it fails
            setTimeout(() => {
              console.log("Retrying with simplified settings...");
              toPng(element, {
                ...exportOptions,
                pixelRatio: 1,
                canvasWidth: Math.min(element.offsetWidth, 1200),
                canvasHeight: Math.min(element.offsetHeight, 900),
                skipAutoScale: true
              })
                .then(dataUrl => {
                  console.log("Retry successful");
                  resolve(dataUrl);
                })
                .catch(retryError => {
                  console.error("Retry failed:", retryError);
                  reject(retryError);
                });
            }, 300);
          });
      }, 300); // Longer delay to ensure rendering is complete
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
    
    // Fallback method if blob approach fails
    try {
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${fileName} downloaded using fallback method!`);
    } catch (fallbackError) {
      console.error("Fallback download failed:", fallbackError);
      toast.error("Failed to download image. Please try copying the preview image instead.");
    }
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
