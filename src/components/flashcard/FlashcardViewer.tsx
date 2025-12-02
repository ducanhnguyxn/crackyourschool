import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Flashcard } from "@/pages/FlashcardPage";

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onNewDeck: () => void;
}

export const FlashcardViewer = ({ flashcards, onNewDeck }: FlashcardViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(flashcards);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleExportCSV = () => {
    const csvContent = cards.map(card => 
      `"${card.front.replace(/"/g, '""')}","${card.back.replace(/"/g, '""')}"`
    ).join('\n');
    const header = "Front,Back\n";
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'flashcards.csv';
    link.click();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "hard": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {cards.length}
          </p>
          <Progress value={progress} className="w-48 h-2" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShuffle}>
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onNewDeck}>
            <Plus className="w-4 h-4 mr-2" />
            New Deck
          </Button>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <div 
          className="w-full max-w-2xl perspective-1000 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className={`relative w-full h-80 transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front of card */}
            <Card 
              className="absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
              style={{ backfaceVisibility: "hidden" }}
            >
              <Badge className={`mb-4 ${getDifficultyColor(currentCard.difficulty)}`}>
                {currentCard.difficulty}
              </Badge>
              <p className="text-2xl font-semibold text-center leading-relaxed">
                {currentCard.front}
              </p>
              <p className="text-sm text-muted-foreground mt-6">
                Click to reveal answer
              </p>
            </Card>

            {/* Back of card */}
            <Card 
              className="absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20"
              style={{ 
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
                Answer
              </Badge>
              <p className="text-xl text-center leading-relaxed">
                {currentCard.back}
              </p>
              <p className="text-sm text-muted-foreground mt-6">
                Click to see question
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          size="lg"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        <Button 
          size="lg"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Card list preview */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">All Cards</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => { setCurrentIndex(index); setIsFlipped(false); }}
              className={`flex-shrink-0 w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                index === currentIndex 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-muted hover:bg-muted/80 border-border"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};
