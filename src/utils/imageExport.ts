
import { toJpeg, toPng } from 'html-to-image';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Utility function to export an HTML element as an image with multi-level fallbacks
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
    
    try {
      // Use canvas-based fallback approach for more reliable cross-browser support
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas dimensions
      canvas.width = exportOptions.canvasWidth * exportOptions.pixelRatio;
      canvas.height = exportOptions.canvasHeight * exportOptions.pixelRatio;
      
      // Scale canvas for higher quality
      ctx.scale(exportOptions.pixelRatio, exportOptions.pixelRatio);
      
      // Fill background color
      ctx.fillStyle = exportOptions.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Try using html-to-image first
      try {
        const dataUrl = format === 'jpg' 
          ? await toJpeg(element, exportOptions)
          : await toPng(element, exportOptions);
          
        element.classList.remove('exporting');
        console.log("Image generated successfully");
        return dataUrl;
      } catch (error) {
        console.warn("Primary export method failed, trying alternative approach:", error);
        
        // Try alternative html-to-image approach with different settings
        try {
          const fallbackOptions = {
            ...exportOptions,
            pixelRatio: 1.5,
            allowTaint: true,
            useCORS: true,
            cacheBust: true
          };
          
          const dataUrl = format === 'jpg' 
            ? await toJpeg(element, fallbackOptions)
            : await toPng(element, fallbackOptions);
            
          element.classList.remove('exporting');
          console.log("Alternative export successful");
          return dataUrl;
        } catch (fallbackError) {
          console.warn("Alternative export failed, using last resort method:", fallbackError);
          
          // Last resort: Use browser's native capabilities
          try {
            // Convert element to SVG for better quality in this fallback
            const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.offsetWidth}" height="${element.offsetHeight}">
              <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                  ${element.outerHTML}
                </div>
              </foreignObject>
            </svg>`;
            
            const img = new Image();
            
            // Create a data URL from the SVG
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
            
            // Return a promise that resolves with the final data URL
            return new Promise((resolve, reject) => {
              img.onload = () => {
                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0);
                
                // Convert canvas to data URL
                try {
                  const finalDataUrl = format === 'jpg' 
                    ? canvas.toDataURL('image/jpeg', exportOptions.quality)
                    : canvas.toDataURL('image/png');
                    
                  element.classList.remove('exporting');
                  URL.revokeObjectURL(url);
                  resolve(finalDataUrl);
                } catch (canvasError) {
                  console.error("Canvas export failed:", canvasError);
                  element.classList.remove('exporting');
                  URL.revokeObjectURL(url);
                  reject(canvasError);
                }
              };
              
              img.onerror = (err) => {
                console.error("Image loading failed:", err);
                element.classList.remove('exporting');
                URL.revokeObjectURL(url);
                reject(new Error("Failed to load image for canvas"));
              };
              
              img.src = url;
            });
          } catch (lastError) {
            element.classList.remove('exporting');
            console.error("All export methods failed:", lastError);
            throw lastError;
          }
        }
      }
    } finally {
      // Ensure we always remove the class
      element.classList.remove('exporting');
    }
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
    // Check if browser is mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobileDevice) {
      // Mobile browsers need special handling
      try {
        // Try to use the download attribute first
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
          toast.success(`${fileName} downloaded successfully!`);
        }, 100);
      } catch (mobileError) {
        console.warn("Mobile download failed, trying direct method:", mobileError);
        
        // Open in new tab for mobile browsers that don't support download attribute
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>${fileName}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { margin: 0; padding: 16px; text-align: center; background: #000; color: #fff; font-family: sans-serif; }
                  img { max-width: 100%; height: auto; margin-bottom: 20px; }
                  .instructions { padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 20px; }
                  .button { display: inline-block; padding: 10px 20px; background: #d50270; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
                </style>
              </head>
              <body>
                <h2>Your PUBG Mobile Tournament Results</h2>
                <div class="instructions">
                  <p>Press and hold the image below, then select "Save Image" or "Download Image"</p>
                </div>
                <img src="${dataUrl}" alt="Tournament Results">
                <p><a class="button" href="${dataUrl}" download="${fileName}">Download Image</a></p>
              </body>
            </html>
          `);
          newWindow.document.close();
          toast.success("Image opened for download. Press and hold to save.");
        } else {
          toast.error("Popup blocked. Please allow popups and try again.");
        }
      }
    } else {
      // Desktop browsers - use blob for more reliable downloads
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      link.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      
      toast.success(`${fileName} downloaded successfully!`);
    }
  } catch (error) {
    console.error("Error downloading image:", error);
    
    try {
      // Ultra simple fallback method
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.target = "_blank";
      link.click();
      toast.success(`${fileName} downloaded using alternative method`);
    } catch (fallbackError) {
      toast.error("Download failed. Please try taking a screenshot instead.");
      console.error("All download attempts failed:", fallbackError);
    }
  }
};

/**
 * Hook to determine ideal image format based on device
 */
export const useImageFormat = () => {
  const isMobile = useIsMobile();
  // We'll always use JPG as requested by the user
  return 'jpg' as const;
};
