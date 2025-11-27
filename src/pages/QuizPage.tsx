import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QuizUploader } from "@/components/quiz/QuizUploader";
import { QuizInterface } from "@/components/quiz/QuizInterface";
import { QuizResults } from "@/components/quiz/QuizResults";

export interface Question {
  id: number;
  question: string;
  type: "multiple-choice" | "open-ended";
  options?: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface UserAnswer {
  questionId: number;
  answer: string;
}

const QuizPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleQuestionsGenerated = (generatedQuestions: Question[]) => {
    setQuestions(generatedQuestions);
    setUserAnswers([]);
    setShowResults(false);
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setUserAnswers([]);
    setShowResults(false);
  };

  const handleNewQuiz = () => {
    setQuestions([]);
    setUserAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Quiz Generator</h1>
          <p className="text-muted-foreground">
            Upload a PDF or Word document to generate an intelligent quiz
          </p>
        </div>

        {!questions.length && !isGenerating && (
          <QuizUploader 
            onQuestionsGenerated={handleQuestionsGenerated}
            setIsGenerating={setIsGenerating}
          />
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg text-muted-foreground">Analyzing document and generating quiz...</p>
          </div>
        )}

        {questions.length > 0 && !showResults && (
          <QuizInterface
            questions={questions}
            userAnswers={userAnswers}
            onAnswerChange={setUserAnswers}
            onSubmit={handleSubmitQuiz}
            onNewQuiz={handleNewQuiz}
          />
        )}

        {showResults && (
          <QuizResults
            questions={questions}
            userAnswers={userAnswers}
            onRetake={handleRetakeQuiz}
            onNewQuiz={handleNewQuiz}
          />
        )}
      </main>
    </div>
  );
};

export default QuizPage;