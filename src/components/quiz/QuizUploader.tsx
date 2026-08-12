import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/pages/QuizPage";

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
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    throw error;
  }
};

interface QuizUploaderProps {
  onQuestionsGenerated: (questions: Question[]) => void;
  setIsGenerating: (generating: boolean) => void;
}

export const QuizUploader = ({ onQuestionsGenerated, setIsGenerating }: QuizUploaderProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB",
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

  const handleGenerateQuiz = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    try {
      toast({
        title: "Processing document",
        description: "Extracting content from your document...",
      });

      // Extract text content from the file
      let content = '';
      if (selectedFile.type === 'application/pdf') {
        content = await extractTextFromPDF(selectedFile);
      } else {
        // For Word docs, try to read as text
        content = await selectedFile.text();
      }

      if (!content.trim()) {
        throw new Error("Could not extract text from the document. Please ensure the document contains readable text.");
      }

      // Call edge function to generate quiz
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { content }
      });

      if (error) {
        console.error("Error generating quiz:", error);
        const errorMessage = error.message || (typeof error === 'string' ? error : "Failed to generate quiz");
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      if (data?.questions && data.questions.length > 0) {
        // Shuffle questions
        const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
        onQuestionsGenerated(shuffled);
        toast({
          title: "Quiz generated!",
          description: `Created ${shuffled.length} questions from your document`,
        });
      } else {
        toast({
          title: "Error",
          description: "No questions were generated. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate quiz",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-8">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        {!selectedFile ? (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop or click to select a PDF or Word document
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select File
              </label>
            </Button>
          </>
        ) : (
          <>
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">{selectedFile.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleGenerateQuiz}>
                Generate Quiz
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedFile(null)}
              >
                Remove
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};