import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PDFUploaderProps {
  onFileUpload: (file: File, text: string, images: string[], pdfId?: string) => void;
}

export const PDFUploader = ({ onFileUpload }: PDFUploaderProps) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();

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

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload PDFs",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract text and images first
      const { text, images } = await extractTextAndImagesFromPDF(file);

      // Upload PDF to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Save PDF metadata to database
      const { data: pdfData, error: dbError } = await supabase
        .from('pdfs')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          extracted_text: text.substring(0, 50000), // Store first 50k chars
        })
        .select()
        .single();

      if (dbError) {
        // If DB insert fails, try to delete the uploaded file
        await supabase.storage.from('pdfs').remove([filePath]);
        throw dbError;
      }

      // Increment PDF count for free users (Pro users have unlimited)
      if (!profile?.is_pro) {
        await supabase
          .from('user_profiles')
          .update({ pdf_count: (profile?.pdf_count || 0) + 1 })
          .eq('id', user.id);
      }

      onFileUpload(file, text, images, pdfData.id);
      toast({
        title: "PDF uploaded successfully",
        description: "You can now chat with your document (including images)",
      });
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Error processing PDF",
        description: error instanceof Error ? error.message : "Failed to upload PDF",
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
