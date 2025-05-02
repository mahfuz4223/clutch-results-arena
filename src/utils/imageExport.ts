
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

/**
 * Utility function to export an HTML element as an image
 * using html2canvas library for maximum compatibility
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
    
    // Set options for html2canvas
    const scale = options.pixelRatio || 2; // Higher quality
    const backgroundColor = options.backgroundColor || '#000000';
    
    // Use html2canvas to properly render the HTML element to a canvas
    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false, // More compatible with various browsers
    });
    
    // Convert canvas to data URL
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = options.quality || 0.95;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    element.classList.remove('exporting');
    return dataUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    element.classList.remove('exporting');
    toast.error("Failed to generate image. Please try another method.");
    return null;
  }
};

/**
 * Download a data URL as a file with improved browser compatibility
 */
export const downloadDataUrl = (dataUrl: string, fileName: string): void => {
  try {
    // Most reliable method across browsers
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
    toast.error("Download failed. Please try alternative methods.");
    
    // Show manual download instructions
    const instructionsDiv = document.createElement('div');
    instructionsDiv.innerHTML = `
      <div style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); 
        background:rgba(0,0,0,0.9); padding:20px; border-radius:10px; color:white; z-index:9999; max-width:90%;">
        <h3 style="margin-bottom:10px;">Manual Download Instructions:</h3>
        <p>1. Right-click on the image preview</p>
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

/**
 * Convert a base64 string to a Blob object
 */
export const dataURLtoBlob = (dataURL: string): Blob => {
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

/**
 * Share image via Web Share API or clipboard API
 */
export const shareImage = async (imageUrl: string, title: string): Promise<boolean> => {
  try {
    // Try Web Share API first
    if (navigator.share) {
      const blob = await fetch(imageUrl).then(r => r.blob());
      const file = new File([blob], "tournament-results.jpg", { type: 'image/jpeg' });
      
      await navigator.share({
        files: [file],
        title: title,
        text: `Check out the latest standings for ${title}!`
      });
      
      return true;
    } 
    
    // Fallback to clipboard
    const blob = await fetch(imageUrl).then(r => r.blob());
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    
    toast.success("Copied to clipboard!");
    return true;
  } catch (error) {
    console.error("Share error:", error);
    return false;
  }
};
