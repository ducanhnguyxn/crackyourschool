import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PDFUploader } from "@/components/pdf-summarizer/PDFUploader";
import { PDFViewer } from "@/components/pdf-summarizer/PDFViewer";
import { AIChatPanel } from "@/components/pdf-summarizer/AIChatPanel";

const PDFSummarizerPage = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfImages, setPdfImages] = useState<string[]>([]);

  const handleFileUpload = (file: File, text: string, images: string[], pdfId?: string) => {
    setPdfFile(file);
    setPdfText(text);
    setPdfImages(images);
    // pdfId is available for future use (e.g., saving chat history linked to PDF)
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 pb-4 px-4">
        {!pdfFile ? (
          <div className="container mx-auto max-w-4xl py-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">PDF Summarizer</h1>
              <p className="text-muted-foreground">Upload a PDF to get AI-powered summaries and insights</p>
            </div>
            <PDFUploader onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4">
            {/* LEFT PANEL - PDF Viewer with independent scroll */}
            <div className="w-full lg:w-2/5 lg:min-w-[300px] lg:max-w-[500px] border border-border rounded-lg bg-muted/20 overflow-hidden flex flex-col">
              <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-border bg-background/50">
                <h2 className="text-sm font-semibold truncate flex-1 mr-2">{pdfFile.name}</h2>
                <Link to="/pdf-summarizer">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
                <PDFViewer file={pdfFile} />
              </div>
            </div>
            
            {/* RIGHT PANEL - AI Chat with independent scroll */}
            <div className="flex-1 min-w-0 border border-border rounded-lg overflow-hidden flex flex-col">
              <AIChatPanel pdfContent={pdfText} pdfImages={pdfImages} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PDFSummarizerPage;
