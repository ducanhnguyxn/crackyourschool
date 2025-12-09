import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { FlashcardUploader } from "@/components/flashcard/FlashcardUploader";
import { FlashcardViewer } from "@/components/flashcard/FlashcardViewer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Flashcard {
  id?: string;
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
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFlashcardsGenerated = async (generatedFlashcards: Flashcard[]) => {
    if (!user) return;

    try {
      // Create a new deck
      const { data: deck, error: deckError } = await supabase
        .from('flashcard_decks')
        .insert({
          user_id: user.id,
          name: `Deck ${new Date().toLocaleDateString()}`,
        })
        .select()
        .single();

      if (deckError) throw deckError;

      setCurrentDeckId(deck.id);

      // Save flashcards to database
      const flashcardsToInsert = generatedFlashcards.map((card) => ({
        user_id: user.id,
        deck_id: deck.id,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty,
      }));

      const { error: cardsError } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert);

      if (cardsError) throw cardsError;

      // Update local state with database IDs
      const { data: savedCards } = await supabase
        .from('flashcards')
        .select('id, front, back, difficulty')
        .eq('deck_id', deck.id)
        .order('created_at');

      if (savedCards) {
        setFlashcards(savedCards);
      } else {
        setFlashcards(generatedFlashcards);
      }
    } catch (error) {
      console.error('Error saving flashcards:', error);
      toast({
        title: "Error saving flashcards",
        description: "Flashcards were generated but couldn't be saved. They're still available for this session.",
        variant: "destructive",
      });
      setFlashcards(generatedFlashcards);
    }
  };

  const handleNewDeck = () => {
    setFlashcards([]);
    setCurrentDeckId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-8 md:pb-16">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">AI Flashcard Generator</h1>
          <p className="text-sm md:text-base text-muted-foreground">
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
