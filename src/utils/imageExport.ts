
import { toJpeg, toPng } from 'html-to-image';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Utility function to export an HTML element as an image
 */
export const exportElementAsImage = async (
  element: HTMLElement | null, 
  fileName: string,
  options: any = {},
  format: 'png' | 'jpg' = 'jpg'
): Promise<string | null> => {
  if (!element) {
    toast.error("Could not find element to export");
    return null;
  }
  
  try {
    // Default options with improved settings for cross-browser compatibility
    const exportOptions = {
      quality: 0.95,
      backgroundColor: "#000000",
      canvasWidth: element.offsetWidth || 1000,
      canvasHeight: element.offsetHeight || 720,
      skipAutoScale: false,
      pixelRatio: 2, // Higher quality
      cacheBust: true, // Prevent caching issues
      ...options
    };
    
    console.log("Starting image generation with options:", exportOptions);
    console.log("Element dimensions:", element.offsetWidth, "x", element.offsetHeight);
    
    // Add CSS class to prevent scrollbars during capture
    element.classList.add('exporting');
    
    // Wait for any pending renders to complete
    return new Promise((resolve, reject) => {
      // Add longer timeout to ensure DOM is fully rendered
      setTimeout(async () => {
        try {
          // Use the selected format
          const dataUrl = format === 'jpg' 
            ? await toJpeg(element, exportOptions)
            : await toPng(element, exportOptions);
          
          element.classList.remove('exporting');
          console.log("Image generated successfully");
          resolve(dataUrl);
        } catch (primaryError) {
          console.error("Primary export attempt failed:", primaryError);
          element.classList.remove('exporting');
          
          // Try again with more conservative settings
          setTimeout(async () => {
            try {
              const fallbackOptions = {
                ...exportOptions,
                pixelRatio: 1.5,
                skipAutoScale: true,
                allowTaint: true,
                useCORS: true,
                canvasWidth: Math.min(element.offsetWidth, 1200),
                canvasHeight: Math.min(element.offsetHeight, 900)
              };
              
              console.log("Retrying with fallback settings:", fallbackOptions);
              const dataUrl = format === 'jpg'
                ? await toJpeg(element, fallbackOptions)
                : await toPng(element, fallbackOptions);
                
              console.log("Fallback export successful");
              resolve(dataUrl);
            } catch (fallbackError) {
              console.error("Fallback export failed:", fallbackError);
              
              // Last resort: try with minimum settings
              try {
                const lastResortOptions = {
                  cacheBust: true,
                  pixelRatio: 1,
                  backgroundColor: "#000000",
                  width: element.offsetWidth,
                  height: element.offsetHeight
                };
                
                console.log("Last resort attempt with minimal settings:", lastResortOptions);
                const dataUrl = format === 'jpg'
                  ? await toJpeg(element, lastResortOptions)
                  : await toPng(element, lastResortOptions);
                  
                resolve(dataUrl);
              } catch (lastError) {
                console.error("All export attempts failed:", lastError);
                reject(lastError);
              }
            }
          }, 300);
        }
      }, 300); // Shorter initial delay for better responsiveness
    });
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error("Failed to generate image. Please try again later.");
    return null;
  }
};

/**
 * Download a data URL as a file with improved browser compatibility
 */
export const downloadDataUrl = (dataUrl: string, fileName: string): void => {
  try {
    // Create blob from data URL for more reliable downloads
    const blob = dataURLtoBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    
    // Use browser-compatible download approach
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none"; // Hide the link
    document.body.appendChild(link); // Need to append to body for Firefox
    
    // Use both click() and dispatchEvent for maximum compatibility
    link.click();
    link.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
    
    toast.success(`${fileName} downloaded successfully!`);
  } catch (error) {
    console.error("Error downloading image:", error);
    
    // Fallback method using direct data URL
    try {
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${fileName} downloaded using fallback method!`);
    } catch (fallbackError) {
      // Last resort: open in new window
      try {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`<img src="${dataUrl}" alt="Generated Image" style="max-width:100%;">`);
          newWindow.document.title = fileName;
          newWindow.document.close();
          toast.success(`Image opened in new tab. Right-click to save.`);
        } else {
          toast.error("Failed to open image. Please check popup blocker settings.");
        }
      } catch (finalError) {
        console.error("All download attempts failed:", finalError);
        toast.error("Failed to download. Please right-click the preview and use 'Save As'.");
      }
    }
  }
};

/**
 * Convert a data URL to a Blob with improved browser compatibility
 */
const dataURLtoBlob = (dataURL: string): Blob => {
  try {
    // Standard method
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  } catch (error) {
    console.error("Error creating blob from data URL:", error);
    
    // Fallback for older browsers
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }
};

/**
 * Hook to determine ideal image format based on device
 */
export const useImageFormat = () => {
  const isMobile = useIsMobile();
  // Use JPG for mobile (smaller file size), PNG for desktop (better quality)
  return isMobile ? 'jpg' as const : 'jpg' as const;
};
