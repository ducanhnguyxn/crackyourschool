import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { FlashcardUploader } from "@/components/flashcard/FlashcardUploader";
import { FlashcardViewer } from "@/components/flashcard/FlashcardViewer";

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface FlashcardOptions {
  count: number;
  type: "term-definition" | "question-answer" | "concept-explanation" | "cloze";
  difficulty: "easy" | "medium" | "hard" | "mixed";
  focus: string;
}

const FlashcardPage = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFlashcardsGenerated = (generatedFlashcards: Flashcard[]) => {
    setFlashcards(generatedFlashcards);
  };

  const handleNewDeck = () => {
    setFlashcards([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Flashcard Generator</h1>
          <p className="text-muted-foreground">
            Upload a PDF or Word document to generate smart flashcards
          </p>
        </div>

        {!flashcards.length && !isGenerating && (
          <FlashcardUploader 
            onFlashcardsGenerated={handleFlashcardsGenerated}
            setIsGenerating={setIsGenerating}
          />
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg text-muted-foreground">Analyzing document and generating flashcards...</p>
          </div>
        )}

        {flashcards.length > 0 && (
          <FlashcardViewer
            flashcards={flashcards}
            onNewDeck={handleNewDeck}
          />
        )}
      </main>
    </div>
  );
};

export default FlashcardPage;
