import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const FeatureProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user is Pro or has free tier access
  // Apply per-feature limits instead of global limits
  if (!profile?.is_pro) {
    const path = location.pathname;
    let isOverLimit = false;
    let limitMessage = "";

    // PDF-related features: check PDF count limit
    if (path === "/pdf-summarizer") {
      if ((profile?.pdf_count || 0) >= 2) {
        isOverLimit = true;
        limitMessage = "You've reached the free tier limit of 2 PDFs. Upgrade to Pro for unlimited PDFs!";
      }
    }
    // AI Tutor: check questions per month limit
    else if (path === "/ai-tutor") {
      if ((profile?.questions_used_this_month || 0) >= 30) {
        isOverLimit = true;
        limitMessage = "You've used all 30 questions this month. Upgrade to Pro for unlimited questions!";
      }
    }
    // Other features (mind-map, quiz, flashcards, schedule) don't have limits for free users
    // They can be used freely

    if (isOverLimit) {
      // Store the limit message in sessionStorage to show on pricing page
      sessionStorage.setItem("limitMessage", limitMessage);
      return <Navigate to="/pricing" replace />;
    }
  }

  return <>{children}</>;
};

