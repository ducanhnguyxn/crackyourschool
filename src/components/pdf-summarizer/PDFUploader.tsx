import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PDFUploaderProps {
  onFileUpload: (file: File, text: string, images: string[]) => void;
}

export const PDFUploader = ({ onFileUpload }: PDFUploaderProps) => {
  const { toast } = useToast();

  const extractTextAndImagesFromPDF = async (file: File): Promise<{ text: string; images: string[] }> => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      // Use same worker as PDFViewer
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const images: string[] = [];
      
      for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
        
        // Extract page as image
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas,
          }).promise;
          
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          images.push(imageData);
        }
      }
      
      return { text: fullText, images };
    } catch (error) {
      console.error('Error extracting PDF content:', error);
      throw error;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    try {
      const { text, images } = await extractTextAndImagesFromPDF(file);
      onFileUpload(file, text, images);
      toast({
        title: "PDF uploaded successfully",
        description: "You can now chat with your document (including images)",
      });
    } catch (error) {
      toast({
        title: "Error processing PDF",
        description: "Failed to extract text from PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
      <Upload className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">Upload your PDF</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Upload a PDF document to start analyzing and chatting with AI
      </p>
      <label htmlFor="pdf-upload">
        <Button asChild>
          <span>
            <Upload className="w-4 h-4 mr-2" />
            Choose PDF File
          </span>
        </Button>
      </label>
      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
