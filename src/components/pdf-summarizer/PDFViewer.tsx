import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use CDN for worker as a reliable fallback
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: File;
}

export const PDFViewer = ({ file }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold truncate flex-1">{file.name}</h3>
        <span className="text-sm text-muted-foreground">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="flex flex-col items-center gap-4">
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="shadow-lg"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};
