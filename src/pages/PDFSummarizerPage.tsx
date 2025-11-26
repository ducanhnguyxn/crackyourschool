import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PDFUploader } from "@/components/pdf-summarizer/PDFUploader";
import { PDFViewer } from "@/components/pdf-summarizer/PDFViewer";
import { AIChatPanel } from "@/components/pdf-summarizer/AIChatPanel";

const PDFSummarizerPage = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfImages, setPdfImages] = useState<string[]>([]);

  const handleFileUpload = (file: File, text: string, images: string[]) => {
    setPdfFile(file);
    setPdfText(text);
    setPdfImages(images);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border p-4 flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">PDF Summarizer</h1>
      </header>

      <main className="flex-1 overflow-hidden">
        {!pdfFile ? (
          <div className="h-full p-8">
            <PDFUploader onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="h-full flex gap-0">
            <div className="w-2/5 min-w-[400px] max-w-[600px] flex flex-col border-r border-border bg-muted/20 shadow-sm">
              <PDFViewer file={pdfFile} />
            </div>
            <div className="flex-1 flex flex-col bg-background">
              <AIChatPanel pdfContent={pdfText} pdfImages={pdfImages} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PDFSummarizerPage;
