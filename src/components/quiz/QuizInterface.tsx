import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Question, UserAnswer } from "@/pages/QuizPage";

interface QuizInterfaceProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onAnswerChange: (answers: UserAnswer[]) => void;
  onSubmit: () => void;
  onNewQuiz: () => void;
}

export const QuizInterface = ({
  questions,
  userAnswers,
  onAnswerChange,
  onSubmit,
  onNewQuiz,
}: QuizInterfaceProps) => {
  const handleAnswerSelect = (questionId: number, answer: string) => {
    const existingIndex = userAnswers.findIndex(a => a.questionId === questionId);
    const newAnswers = [...userAnswers];
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, answer };
    } else {
      newAnswers.push({ questionId, answer });
    }
    
    onAnswerChange(newAnswers);
  };

  const getAnswer = (questionId: number) => {
    return userAnswers.find(a => a.questionId === questionId)?.answer || "";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "hard":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold">Quiz Questions</h2>
          <p className="text-sm text-muted-foreground">
            Answer all {questions.length} questions and submit when ready
          </p>
        </div>
        <Button variant="outline" onClick={onNewQuiz} className="shrink-0">
          New Quiz
        </Button>
      </div>

      {questions.map((question, index) => (
        <Card key={question.id} className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-semibold text-base md:text-lg">Question {index + 1}</span>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </div>
              <p className="text-sm md:text-base break-words overflow-wrap-anywhere">{question.question}</p>
            </div>
          </div>

          {question.type === "multiple-choice" && question.options ? (
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => {
                const optionLetter = String.fromCharCode(65 + optionIndex);
                const isSelected = getAnswer(question.id) === optionLetter;
                
                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(question.id, optionLetter)}
                    className={`w-full text-left p-3 md:p-4 rounded-lg border transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-2 md:gap-3">
                      <span className="font-semibold text-primary shrink-0 text-sm md:text-base">
                        {optionLetter}.
                      </span>
                      <span className="break-words overflow-wrap-anywhere text-sm md:text-base">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <Textarea
              placeholder="Type your answer here..."
              value={getAnswer(question.id)}
              onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
              className="min-h-[100px] break-words overflow-wrap-anywhere resize-none"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            />
          )}
        </Card>
      ))}

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={userAnswers.length !== questions.length}
        >
          Submit Quiz ({userAnswers.length}/{questions.length} answered)
        </Button>
      </div>
    </div>
  );
};