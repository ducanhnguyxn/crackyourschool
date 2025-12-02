import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import type { FlashcardOptions } from "@/pages/FlashcardPage";

interface FlashcardOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (options: FlashcardOptions) => void;
}

export const FlashcardOptionsDialog = ({ open, onOpenChange, onGenerate }: FlashcardOptionsDialogProps) => {
  const [options, setOptions] = useState<FlashcardOptions>({
    count: 10,
    type: "term-definition",
    difficulty: "mixed",
    focus: "all",
  });

  const handleGenerate = () => {
    onGenerate(options);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Flashcard Options
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="count">Number of Flashcards</Label>
            <Select
              value={options.count.toString()}
              onValueChange={(value) => setOptions({ ...options, count: parseInt(value) })}
            >
              <SelectTrigger id="count">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 cards</SelectItem>
                <SelectItem value="10">10 cards</SelectItem>
                <SelectItem value="15">15 cards</SelectItem>
                <SelectItem value="20">20 cards</SelectItem>
                <SelectItem value="30">30 cards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Flashcard Type</Label>
            <Select
              value={options.type}
              onValueChange={(value: FlashcardOptions["type"]) => setOptions({ ...options, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="term-definition">Term → Definition</SelectItem>
                <SelectItem value="question-answer">Question → Answer</SelectItem>
                <SelectItem value="concept-explanation">Concept → Explanation</SelectItem>
                <SelectItem value="cloze">Fill-in-the-blank (Cloze)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={options.difficulty}
              onValueChange={(value: FlashcardOptions["difficulty"]) => setOptions({ ...options, difficulty: value })}
            >
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus">Focus Area (optional)</Label>
            <Input
              id="focus"
              placeholder="e.g., definitions, formulas, dates, vocabulary..."
              value={options.focus === "all" ? "" : options.focus}
              onChange={(e) => setOptions({ ...options, focus: e.target.value || "all" })}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to cover all important topics
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Flashcards
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
