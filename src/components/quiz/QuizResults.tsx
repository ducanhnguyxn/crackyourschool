import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import { Question, UserAnswer } from "@/pages/QuizPage";

interface QuizResultsProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRetake: () => void;
  onNewQuiz: () => void;
}

export const QuizResults = ({
  questions,
  userAnswers,
  onRetake,
  onNewQuiz,
}: QuizResultsProps) => {
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = userAnswers.find((a) => a.questionId === q.id);
      if (userAnswer && userAnswer.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        correct++;
      }
    });
    return { correct, total: questions.length, percentage: (correct / questions.length) * 100 };
  };

  const score = calculateScore();

  const getScoreColor = () => {
    if (score.percentage >= 80) return "text-green-600 dark:text-green-400";
    if (score.percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8 text-center">
        <Trophy className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 ${getScoreColor()}`} />
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Quiz Completed!</h2>
        <p className={`text-4xl md:text-5xl font-bold mb-4 ${getScoreColor()}`}>
          {score.percentage.toFixed(0)}%
        </p>
        <p className="text-base md:text-lg text-muted-foreground mb-6">
          You got {score.correct} out of {score.total} questions correct
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetake} className="w-full sm:w-auto">Retake Quiz</Button>
          <Button variant="outline" onClick={onNewQuiz} className="w-full sm:w-auto">
            New Quiz
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-2xl font-bold mb-4">Answer Key</h3>
        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = userAnswers.find((a) => a.questionId === question.id);
            const isCorrect = userAnswer?.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

            return (
              <Card key={question.id} className="p-4 md:p-6">
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400 shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400 shrink-0 mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold text-sm md:text-base">Question {index + 1}</span>
                      <Badge variant="outline" className="text-xs">{question.difficulty}</Badge>
                    </div>
                    <p className="mb-3 break-words overflow-wrap-anywhere text-sm md:text-base">{question.question}</p>

                    {question.type === "multiple-choice" && question.options && (
                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optionIndex) => {
                          const optionLetter = String.fromCharCode(65 + optionIndex);
                          const isUserAnswer = userAnswer?.answer === optionLetter;
                          const isCorrectOption = question.correctAnswer === optionLetter;

                          return (
                            <div
                              key={optionIndex}
                              className={`p-2 md:p-3 rounded-lg border ${
                                isCorrectOption
                                  ? "border-green-500 bg-green-500/10"
                                  : isUserAnswer
                                  ? "border-red-500 bg-red-500/10"
                                  : "border-border"
                              }`}
                            >
                              <div className="flex flex-wrap items-start gap-1 md:gap-2">
                                <span className="font-semibold text-sm md:text-base shrink-0">{optionLetter}. </span>
                                <span className="break-words overflow-wrap-anywhere text-sm md:text-base flex-1 min-w-0">{option}</span>
                                {isCorrectOption && (
                                  <Badge className="ml-auto shrink-0 bg-green-500 text-xs">Correct</Badge>
                                )}
                                {isUserAnswer && !isCorrectOption && (
                                  <Badge className="ml-auto shrink-0 bg-red-500 text-xs">Your Answer</Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Your answer: </span>
                        <span className={isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          {userAnswer?.answer || "Not answered"}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="font-semibold">Correct answer: </span>
                          <span className="text-green-600 dark:text-green-400">
                            {question.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};