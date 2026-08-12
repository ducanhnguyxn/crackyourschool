import { useState } from "react";
import { Upload, FileText, X, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FlashcardOptionsDialog } from "./FlashcardOptionsDialog";
import type { Flashcard, FlashcardOptions } from "@/pages/FlashcardPage";

interface FlashcardUploaderProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  setIsGenerating: (value: boolean) => void;
}

export const FlashcardUploader = ({ onFlashcardsGenerated, setIsGenerating }: FlashcardUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting PDF content:', error);
      throw error;
    }
  };

  const handleFileSelect = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleGenerateFlashcards = async (options: FlashcardOptions) => {
    if (!selectedFile) return;

    setShowOptionsDialog(false);
    setIsGenerating(true);

    try {
      let content = '';
      
      if (selectedFile.type === 'application/pdf') {
        content = await extractTextFromPDF(selectedFile);
      } else {
        content = await selectedFile.text();
      }

      if (!content.trim()) {
        throw new Error("Could not extract text from the document");
      }

      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { content, options }
      });

      if (error) throw error;

      if (data?.flashcards) {
        onFlashcardsGenerated(data.flashcards);
        toast({
          title: "Flashcards generated!",
          description: `Created ${data.flashcards.length} flashcards from your document`,
        });
      } else {
        throw new Error("No flashcards returned");
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Error generating flashcards",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <>
              <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drop your document here</h3>
              <p className="text-muted-foreground mb-6">
                Support for PDF and Word documents (max 10MB)
              </p>
              <label htmlFor="flashcard-upload">
                <Button asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              <input
                id="flashcard-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-10 h-10 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                  aria-label="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={() => setShowOptionsDialog(true)} size="lg">
                <Settings2 className="w-4 h-4 mr-2" />
                Configure & Generate Flashcards
              </Button>
            </div>
          )}
        </div>
      </Card>

      <FlashcardOptionsDialog
        open={showOptionsDialog}
        onOpenChange={setShowOptionsDialog}
        onGenerate={handleGenerateFlashcards}
      />
    </>
  );
};
