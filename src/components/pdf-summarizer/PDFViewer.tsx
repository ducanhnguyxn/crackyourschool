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
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between p-2 border-b border-border bg-background/50">
        <h3 className="font-semibold truncate flex-1 text-sm">{file.name}</h3>
        <span className="text-xs text-muted-foreground ml-2 shrink-0">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="flex flex-col items-center gap-4">
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="shadow-lg max-w-full"
              width={Math.min(800, window.innerWidth - 100)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};
