
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
  
  return new Promise((resolve) => setTimeout(resolve, 500))
    .then(() => toPng(element, { 
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
      skipAutoScale: true
    }))
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${filename}.png`;
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
  
  return new Promise((resolve) => setTimeout(resolve, 500))
    .then(() => toPng(element, { 
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
      skipAutoScale: true
    }))
    .then((dataUrl) => {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1020, 740],
        hotfixes: ["px_scaling"]
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    });
};
