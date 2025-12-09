import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QuizUploader } from "@/components/quiz/QuizUploader";
import { QuizInterface } from "@/components/quiz/QuizInterface";
import { QuizResults } from "@/components/quiz/QuizResults";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleQuestionsGenerated = async (generatedQuestions: Question[]) => {
    if (!user) {
      setQuestions(generatedQuestions);
      setUserAnswers([]);
      setShowResults(false);
      return;
    }

    try {
      // Save quiz to database
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          user_id: user.id,
          title: `Quiz ${new Date().toLocaleDateString()}`,
          questions: generatedQuestions,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      setCurrentQuizId(quiz.id);
      setQuestions(generatedQuestions);
      setUserAnswers([]);
      setShowResults(false);
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error saving quiz",
        description: "Quiz was generated but couldn't be saved. It's still available for this session.",
        variant: "destructive",
      });
      setQuestions(generatedQuestions);
      setUserAnswers([]);
      setShowResults(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user || !currentQuizId) {
      setShowResults(true);
      return;
    }

    // Calculate score
    let score = 0;
    questions.forEach((q) => {
      const userAnswer = userAnswers.find((a) => a.questionId === q.id);
      if (userAnswer && userAnswer.answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        score++;
      }
    });

    try {
      // Save quiz results
      await supabase.from('quiz_results').insert({
        user_id: user.id,
        quiz_id: currentQuizId,
        answers: userAnswers,
        score,
        total_questions: questions.length,
      });
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }

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
    setCurrentQuizId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 md:pt-24 pb-8 md:pb-16">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">AI Quiz Generator</h1>
          <p className="text-sm md:text-base text-muted-foreground">
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