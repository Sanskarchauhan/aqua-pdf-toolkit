import { toast } from '@/hooks/use-toast';
import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Tesseract from 'tesseract.js';

// Helper function to read file as ArrayBuffer
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Create a result file with appropriate name based on the tool
export const createResultFile = (
  content: string | ArrayBuffer | Uint8Array | Blob, 
  toolId: string, 
  originalFileName?: string,
  type: string = 'application/pdf'
): File => {
  const blob = content instanceof Blob 
    ? content 
    : new Blob([content], { type });
  
  const fileName = originalFileName 
    ? `${toolId}-${originalFileName}` 
    : `${toolId}-result.pdf`;
  
  return new File([blob], fileName, { 
    type,
    lastModified: Date.now()
  });
};

// Compress PDF function using pdf-lib
export const compressPdf = async (file: File): Promise<File> => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Save with compression settings
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
    });
    
    return createResultFile(
      compressedBytes, 
      'compress-pdf', 
      file.name
    );
  } catch (error) {
    console.error('Error compressing PDF:', error);
    throw new Error('Failed to compress PDF');
  }
};

// Merge PDFs function using pdf-lib
export const mergePdfs = async (files: File[]): Promise<File> => {
  try {
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    
    // Process each file
    for (const file of files) {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Copy pages from the source document to the merged document
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
    
    // Save the merged PDF
    const mergedBytes = await mergedPdf.save();
    
    return createResultFile(mergedBytes, 'merge-pdf', 'merged.pdf');
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw new Error('Failed to merge PDFs');
  }
};

// Convert PDF to Word (simulated, would need a server-side solution in a real app)
export const pdfToWord = async (file: File): Promise<File> => {
  try {
    // In a real app, this would use a server API to perform the conversion
    // For now, we'll create a demo docx file as if it were converted
    const bytes = await readFileAsArrayBuffer(file);
    
    // Get the filename without extension
    const fileName = file.name.replace('.pdf', '.docx');
    
    // In a real app, you'd send the PDF to a server for conversion
    // Here we're just simulating the result for the demo
    return createResultFile(
      bytes, 
      'pdf-to-word', 
      fileName, 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  } catch (error) {
    console.error('Error converting PDF to Word:', error);
    throw new Error('Failed to convert PDF to Word');
  }
};

// Convert Word to PDF (simulated, would need a server-side solution in a real app)
export const wordToPdf = async (file: File): Promise<File> => {
  try {
    // In a real app, this would use a server API for conversion
    // For demonstration purposes, we'll create a simple PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Add file name as text
    page.drawText(`Converted from: ${file.name}`, {
      x: 50,
      y: height - 50,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('This is a simulated Word to PDF conversion', {
      x: 50,
      y: height - 100,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    const fileName = file.name.replace('.docx', '.pdf').replace('.doc', '.pdf');
    
    return createResultFile(pdfBytes, 'word-to-pdf', fileName);
  } catch (error) {
    console.error('Error converting Word to PDF:', error);
    throw new Error('Failed to convert Word to PDF');
  }
};

// Perform OCR on PDF
export const ocrPdf = async (file: File): Promise<File> => {
  try {
    toast({
      title: "OCR Processing",
      description: "Converting PDF to text. This may take a while for large documents.",
    });
    
    // In a real app, we would break this into pages
    // For demo purposes, we'll create a simple OCR result
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    
    // Add a simulated OCR result
    page.drawText(`OCR Results for: ${file.name}`, {
      x: 50,
      y: height - 50,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    
    // In a real app, this would use Tesseract.js to extract text from PDF pages
    // Here's a simplified example of how you could use Tesseract
    try {
      const imageData = URL.createObjectURL(file);
      const result = await Tesseract.recognize(
        imageData,
        'eng',
        { logger: m => console.log(m) }
      );
      
      // Split into lines and write to PDF
      const lines = result.data.text.split('\n');
      let y = height - 100;
      
      for (const line of lines.slice(0, 20)) { // Limit to 20 lines for demo
        page.drawText(line, {
          x: 50,
          y,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        });
        y -= 20;
      }
      
      URL.revokeObjectURL(imageData);
    } catch (e) {
      console.error("Error with OCR processing:", e);
      page.drawText("OCR processing failed or is limited in this demo.", {
        x: 50,
        y: height - 100,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return createResultFile(pdfBytes, 'pdf-ocr', `${file.name}-ocr.pdf`);
  } catch (error) {
    console.error('Error performing OCR on PDF:', error);
    throw new Error('Failed to perform OCR on PDF');
  }
};

// Unlock PDF (simulated, would need a server-side solution for real password removal)
export const unlockPdf = async (file: File, password?: string): Promise<File> => {
  try {
    // In a real app, this would use a library with password handling
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    // Try to load the PDF with the password
    const loadOptions: any = {
      ignoreEncryption: false,
      updateMetadata: false,
    };
    
    if (password) {
      loadOptions.password = password;
    }
    
    const pdfDoc = await PDFDocument.load(arrayBuffer, loadOptions);
    
    // If we get here, the password worked or the PDF wasn't encrypted
    const pdfBytes = await pdfDoc.save(); // Save without encryption
    
    return createResultFile(pdfBytes, 'unlock-pdf', file.name);
  } catch (error) {
    console.error('Error unlocking PDF:', error);
    throw new Error('Failed to unlock PDF. The password may be incorrect.');
  }
};

// Protect PDF with password
export const protectPdf = async (file: File, password: string): Promise<File> => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Use pdf-lib's save options with encryption
    const saveOptions: any = {
      // pdf-lib supports encryption options directly
    };
    
    // Add encryption options
    if (password) {
      saveOptions.encryption = {
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: true,
          documentAssembly: false,
        },
      };
    }
    
    const encryptedBytes = await pdfDoc.save(saveOptions);
    
    return createResultFile(encryptedBytes, 'protect-pdf', file.name);
  } catch (error) {
    console.error('Error protecting PDF:', error);
    throw new Error('Failed to protect PDF with password');
  }
};

// Add e-signature to PDF
export const signPdf = async (file: File, signatureData: string): Promise<File> => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Convert the signature data URL to image
    const signatureImageData = signatureData.split(',')[1];
    const signatureImage = await pdfDoc.embedPng(Uint8Array.from(atob(signatureImageData), c => c.charCodeAt(0)));
    
    // Add the signature to the last page of the PDF
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width, height } = lastPage.getSize();
    
    // Place the signature at the bottom right of the page
    const signatureDims = signatureImage.scale(0.5); // Scale the signature to a reasonable size
    lastPage.drawImage(signatureImage, {
      x: width - signatureDims.width - 50,
      y: 50,
      width: signatureDims.width,
      height: signatureDims.height,
    });
    
    const signedBytes = await pdfDoc.save();
    return createResultFile(signedBytes, 'sign-pdf', file.name);
  } catch (error) {
    console.error('Error signing PDF:', error);
    throw new Error('Failed to add signature to PDF');
  }
};

// PDF to Excel (simulated, would need server-side processing for real conversion)
export const pdfToExcel = async (file: File): Promise<File> => {
  try {
    // In a real app, this would use a server API for conversion
    const bytes = await readFileAsArrayBuffer(file);
    const fileName = file.name.replace('.pdf', '.xlsx');
    
    // Simulate the excel file
    return createResultFile(
      bytes,
      'pdf-to-excel',
      fileName,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  } catch (error) {
    console.error('Error converting PDF to Excel:', error);
    throw new Error('Failed to convert PDF to Excel');
  }
};

// Excel to PDF (simulated)
export const excelToPdf = async (file: File): Promise<File> => {
  try {
    // Create a simple PDF showing "converted from Excel"
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    page.drawText(`Converted from Excel: ${file.name}`, {
      x: 50,
      y: height - 50,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    const fileName = file.name.replace('.xlsx', '.pdf').replace('.xls', '.pdf');
    
    return createResultFile(pdfBytes, 'excel-to-pdf', fileName);
  } catch (error) {
    console.error('Error converting Excel to PDF:', error);
    throw new Error('Failed to convert Excel to PDF');
  }
};

// PDF to JPG (simulated, real conversion would use pdf.js or a server-side tool)
export const pdfToJpg = async (file: File): Promise<File> => {
  try {
    // In a real app, this would render PDF pages to a canvas and convert to JPG
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const fileName = file.name.replace('.pdf', '.jpg');
    
    // For this demo, we'll return a placeholder
    return createResultFile(
      arrayBuffer,
      'pdf-to-jpg',
      fileName,
      'image/jpeg'
    );
  } catch (error) {
    console.error('Error converting PDF to JPG:', error);
    throw new Error('Failed to convert PDF to JPG');
  }
};

// JPG to PDF
export const jpgToPdf = async (files: File[]): Promise<File> => {
  try {
    const pdfDoc = await PDFDocument.create();
    
    for (const file of files) {
      // Read the image
      const imageBytes = await readFileAsArrayBuffer(file);
      
      // Determine image type and embed accordingly
      let image;
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(new Uint8Array(imageBytes));
      } else if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(new Uint8Array(imageBytes));
      } else {
        continue; // Skip unsupported image types
      }
      
      // Add page with image
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return createResultFile(pdfBytes, 'jpg-to-pdf', 'images-to-pdf.pdf');
  } catch (error) {
    console.error('Error converting JPG to PDF:', error);
    throw new Error('Failed to convert JPG to PDF');
  }
};

// PDF to PowerPoint (simulated)
export const pdfToPpt = async (file: File): Promise<File> => {
  try {
    // In a real app, this would use a server API for conversion
    const bytes = await readFileAsArrayBuffer(file);
    const fileName = file.name.replace('.pdf', '.pptx');
    
    // Simulate the PowerPoint file
    return createResultFile(
      bytes,
      'pdf-to-ppt',
      fileName,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
  } catch (error) {
    console.error('Error converting PDF to PowerPoint:', error);
    throw new Error('Failed to convert PDF to PowerPoint');
  }
};

// PowerPoint to PDF (simulated)
export const pptToPdf = async (file: File): Promise<File> => {
  try {
    // Create a simple PDF showing it was converted from PowerPoint
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    page.drawText(`Converted from PowerPoint: ${file.name}`, {
      x: 50,
      y: height - 50,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    const fileName = file.name.replace('.pptx', '.pdf').replace('.ppt', '.pdf');
    
    return createResultFile(pdfBytes, 'ppt-to-pdf', fileName);
  } catch (error) {
    console.error('Error converting PowerPoint to PDF:', error);
    throw new Error('Failed to convert PowerPoint to PDF');
  }
};

// Split PDF into multiple files
export const splitPdf = async (file: File): Promise<File> => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    // For demo purposes, we'll return a single split PDF
    // with the first half of pages
    if (pageCount > 1) {
      const splitDoc = await PDFDocument.create();
      const pages = await splitDoc.copyPages(pdfDoc, [0, Math.min(1, pageCount - 1)]);
      
      pages.forEach(page => {
        splitDoc.addPage(page);
      });
      
      const splitBytes = await splitDoc.save();
      return createResultFile(splitBytes, 'split-pdf', 'split-part1.pdf');
    } else {
      throw new Error('PDF has too few pages to split');
    }
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw new Error('Failed to split PDF');
  }
};

// Rotate PDF pages
export const rotatePdf = async (file: File): Promise<File> => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Rotate each page 90 degrees clockwise
    pages.forEach(page => {
      page.setRotation(degrees(90));
    });
    
    const rotatedBytes = await pdfDoc.save();
    return createResultFile(rotatedBytes, 'rotate-pdf', file.name);
  } catch (error) {
    console.error('Error rotating PDF:', error);
    throw new Error('Failed to rotate PDF');
  }
};

// Process file based on tool ID
export const processFile = async (toolId: string, files: File[], options?: any): Promise<File> => {
  try {
    switch (toolId) {
      case 'compress-pdf':
        return await compressPdf(files[0]);
      
      case 'merge-pdf':
        return await mergePdfs(files);
      
      case 'pdf-to-word':
        return await pdfToWord(files[0]);
      
      case 'word-to-pdf':
        return await wordToPdf(files[0]);
      
      case 'pdf-ocr':
        return await ocrPdf(files[0]);
      
      case 'unlock-pdf':
        return await unlockPdf(files[0], options?.password);
      
      case 'protect-pdf':
        return await protectPdf(files[0], options?.password);
      
      case 'sign-pdf':
        return await signPdf(files[0], options?.signature);
      
      case 'pdf-to-excel':
        return await pdfToExcel(files[0]);
      
      case 'excel-to-pdf':
        return await excelToPdf(files[0]);
      
      case 'pdf-to-jpg':
        return await pdfToJpg(files[0]);
      
      case 'jpg-to-pdf':
        return await jpgToPdf(files);
      
      case 'pdf-to-ppt':
        return await pdfToPpt(files[0]);
      
      case 'ppt-to-pdf':
        return await pptToPdf(files[0]);
      
      case 'split-pdf':
        return await splitPdf(files[0]);
      
      case 'rotate-pdf':
        return await rotatePdf(files[0]);
        
      default:
        // For unimplemented tools, create a simple result file
        return createResultFile(`Processed with ${toolId}`, toolId, 'result.pdf');
    }
  } catch (error) {
    console.error(`Error processing with ${toolId}:`, error);
    toast({
      title: "Processing Error",
      description: `Failed to process with ${toolId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    throw error;
  }
};

// Helper function to download a file
export const downloadFile = (file: File) => {
  saveAs(file, file.name);
};
