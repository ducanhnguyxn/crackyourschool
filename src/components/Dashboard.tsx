import { Card } from "@/components/ui/card";

export const Dashboard = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold text-sm rounded-full mb-4">
            INTERACTIVE PDF READER
          </div>
          <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
            The AI PDF Reader That Understands Your Documents
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload any PDF and let our AI help you understand, summarize, and learn from it. 
            Ask questions, get explanations, and create study materials instantly.
          </p>
        </div>

        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-accent/5 to-background border-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Key Features:</h3>
                <ul className="space-y-3">
                  {[
                    "AI-powered document analysis",
                    "Instant summaries and key points",
                    "Interactive Q&A with your documents",
                    "Smart flashcard generation",
                    "Highlight and annotate with AI insights",
                    "Multi-language support"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/20 shadow-card-hover flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-primary mx-auto flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
