
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

/**
 * Download element as PNG image
 */
export const downloadAsImage = (
  element: HTMLElement | null, 
  filename: string
): Promise<void> => {
  if (!element) {
    return Promise.reject(new Error("Element not found"));
  }
  
  return toPng(element)
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    });
};

/**
 * Download element as PDF document
 */
export const downloadAsPdf = (
  element: HTMLElement | null, 
  filename: string
): Promise<void> => {
  if (!element) {
    return Promise.reject(new Error("Element not found"));
  }
  
  return toPng(element)
    .then((dataUrl) => {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1000, 720]
      });
      
      pdf.addImage(dataUrl, "PNG", 0, 0, 1000, 720);
      pdf.save(filename);
    });
};
