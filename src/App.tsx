import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import FAQPage from "./pages/FAQPage";
import DashboardPage from "./pages/DashboardPage";
import AITutorPage from "./pages/AITutorPage";
import MindMapPage from "./pages/MindMapPage";
import PDFSummarizerPage from "./pages/PDFSummarizerPage";
import QuizPage from "./pages/QuizPage";
import FlashcardPage from "./pages/FlashcardPage";
import SchedulePage from "./pages/SchedulePage";
import NotFound from "./pages/NotFound";
import { FeatureProtectedRoute } from "./components/FeatureProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-tutor"
                element={
                  <FeatureProtectedRoute>
                    <AITutorPage />
                  </FeatureProtectedRoute>
                }
              />
              <Route
                path="/mind-map"
                element={
                  <FeatureProtectedRoute>
                    <MindMapPage />
                  </FeatureProtectedRoute>
                }
              />
              <Route
                path="/pdf-summarizer"
                element={
                  <FeatureProtectedRoute>
                    <PDFSummarizerPage />
                  </FeatureProtectedRoute>
                }
              />
              <Route
                path="/quiz"
                element={
                  <FeatureProtectedRoute>
                    <QuizPage />
                  </FeatureProtectedRoute>
                }
              />
              <Route
                path="/flashcards"
                element={
                  <FeatureProtectedRoute>
                    <FlashcardPage />
                  </FeatureProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <FeatureProtectedRoute>
                    <SchedulePage />
                  </FeatureProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
