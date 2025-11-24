import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PDFUploaderProps {
  onFileUpload: (file: File, text: string) => void;
}

export const PDFUploader = ({ onFileUpload }: PDFUploaderProps) => {
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
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
      const text = await extractTextFromPDF(file);
      onFileUpload(file, text);
      toast({
        title: "PDF uploaded successfully",
        description: "You can now chat with your document",
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
