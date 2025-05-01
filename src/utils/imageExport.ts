
import { toast } from 'sonner';

/**
 * Utility function to export an HTML element as an image
 * using direct canvas rendering for maximum compatibility
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
    // Add CSS class to prevent scrollbars during capture
    element.classList.add('exporting');
    
    // Create canvas with proper dimensions
    const canvas = document.createElement('canvas');
    const scale = options.pixelRatio || 2;
    
    // Get element dimensions
    const rect = element.getBoundingClientRect();
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    // Get canvas context and set background
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Scale everything to improve quality
    ctx.scale(scale, scale);
    
    // Set background color
    ctx.fillStyle = options.backgroundColor || '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    try {
      // Use html2canvas-like approach with direct SVG rendering
      // Convert DOM to SVG
      const data = new XMLSerializer().serializeToString(element);
      const svgBlob = new Blob([data], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      // Draw the SVG on canvas
      const img = new Image();
      
      // Wait for image to load before drawing to canvas
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      URL.revokeObjectURL(url);
      
      // Convert canvas to data URL
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const quality = options.quality || 0.95;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      element.classList.remove('exporting');
      return dataUrl;
    } catch (svgError) {
      console.error("SVG method failed:", svgError);
      
      // Fallback using direct element to canvas drawing
      ctx.fillStyle = options.backgroundColor || '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw element background if specified
      const computedStyle = window.getComputedStyle(element);
      const bgColor = computedStyle.backgroundColor;
      const bgImage = computedStyle.backgroundImage;
      
      if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
      
      if (bgImage !== 'none') {
        console.log("Background image detected but cannot be directly captured");
      }
      
      // Create a data URL for the canvas
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const quality = options.quality || 0.95;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      element.classList.remove('exporting');
      return dataUrl;
    }
  } catch (error) {
    console.error("Error generating image:", error);
    element.classList.remove('exporting');
    toast.error("Failed to generate image. Please use the screenshot option.");
    return null;
  }
};

/**
 * Download a data URL as a file with improved browser compatibility
 */
export const downloadDataUrl = (dataUrl: string, fileName: string): void => {
  try {
    // Direct download approach - most compatible
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      toast.success(`${fileName} downloaded successfully!`);
    }, 100);
  } catch (error) {
    console.error("Error downloading image:", error);
    toast.error("Download failed. Please use the screenshot option.");
    
    // Show manual instructions
    const instructionsDiv = document.createElement('div');
    instructionsDiv.innerHTML = `
      <div style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); 
        background:rgba(0,0,0,0.9); padding:20px; border-radius:10px; color:white; z-index:9999; max-width:90%;">
        <h3 style="margin-bottom:10px;">Manual Download Instructions:</h3>
        <p>1. Right-click on the image preview below</p>
        <p>2. Select "Save image as..."</p>
        <p>3. Choose a location and save</p>
        <button id="close-instructions" style="background:#3399ff; border:none; padding:8px 15px; 
          border-radius:5px; color:white; margin-top:15px; cursor:pointer;">Got it</button>
      </div>
    `;
    document.body.appendChild(instructionsDiv);
    
    // Add event listener to close button
    const closeButton = document.getElementById('close-instructions');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        document.body.removeChild(instructionsDiv);
      });
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
