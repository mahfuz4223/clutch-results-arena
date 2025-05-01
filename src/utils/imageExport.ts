
import { toJpeg, toPng } from 'html-to-image';
import { toast } from 'sonner';

/**
 * Utility function to export an HTML element as an image with improved compatibility
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
      quality: 0.9,
      backgroundColor: "#000000",
      canvasWidth: element.offsetWidth || 1000,
      canvasHeight: element.offsetHeight || 720,
      pixelRatio: 2, // Higher quality
      cacheBust: true, // Prevent caching issues
      ...options
    };
    
    console.log("Starting image generation with options:", exportOptions);
    
    // Add CSS class to prevent scrollbars during capture
    element.classList.add('exporting');
    
    try {
      // Use html-to-image library with proper format
      const dataUrl = format === 'jpg' 
        ? await toJpeg(element, exportOptions)
        : await toPng(element, exportOptions);
        
      element.classList.remove('exporting');
      console.log("Image generated successfully");
      return dataUrl;
    } catch (error) {
      console.warn("Primary export method failed:", error);
      
      // Fallback method - DOM to canvas approach
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      const elementRect = element.getBoundingClientRect();
      canvas.width = elementRect.width * 2; // Higher quality
      canvas.height = elementRect.height * 2;
      ctx.scale(2, 2);
      
      // Draw a background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Convert the Element to an SVG
      const data = new XMLSerializer().serializeToString(element);
      const svgBlob = new Blob([data], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          
          try {
            const imgDataUrl = format === 'jpg' 
              ? canvas.toDataURL('image/jpeg', 0.9)
              : canvas.toDataURL('image/png');
              
            element.classList.remove('exporting');
            resolve(imgDataUrl);
          } catch (canvasError) {
            element.classList.remove('exporting');
            console.error("Canvas export failed:", canvasError);
            reject(canvasError);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          element.classList.remove('exporting');
          reject(new Error("Failed to load image from SVG"));
        };
        
        img.src = url;
      });
    }
  } catch (error) {
    console.error("Error generating image:", error);
    element.classList.remove('exporting');
    toast.error("Failed to generate image. Please try the screenshot option.");
    return null;
  }
};

/**
 * Download a data URL as a file with improved browser compatibility
 */
export const downloadDataUrl = (dataUrl: string, fileName: string): void => {
  try {
    // Convert data URL to Blob for better browser compatibility
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([arrayBuffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Create a direct download link
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    
    link.click();
    
    // Clean up after download
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);
    
    toast.success(`${fileName} downloaded successfully!`);
  } catch (error) {
    console.error("Error downloading image:", error);
    
    // Fallback for problematic browsers
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.target = "_blank";
      link.click();
      toast.success(`${fileName} downloaded`);
    } catch (fallbackError) {
      toast.error("Download failed. Please try saving the preview image manually.");
      console.error("All download attempts failed:", fallbackError);
    }
  }
};

/**
 * Hook to determine ideal image format based on device
 */
export const useImageFormat = () => {
  // Always use JPG as requested
  return 'jpg' as const;
};
