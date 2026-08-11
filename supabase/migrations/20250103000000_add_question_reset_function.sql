-- Function to reset question count monthly
CREATE OR REPLACE FUNCTION public.reset_question_count_if_needed()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if we need to reset the question count (new month)
  IF NEW.questions_reset_date IS NULL OR 
     DATE_TRUNC('month', NEW.questions_reset_date) < DATE_TRUNC('month', NOW()) THEN
    NEW.questions_used_this_month := 0;
    NEW.questions_reset_date := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-reset question count when profile is accessed
CREATE OR REPLACE FUNCTION public.check_and_reset_questions()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset if it's a new month
  IF OLD.questions_reset_date IS NULL OR 
     DATE_TRUNC('month', OLD.questions_reset_date) < DATE_TRUNC('month', NOW()) THEN
    NEW.questions_used_this_month := 0;
    NEW.questions_reset_date := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function that can be called to reset questions for all users
CREATE OR REPLACE FUNCTION public.reset_monthly_question_counts()
RETURNS void AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    questions_used_this_month = 0,
    questions_reset_date = NOW()
  WHERE 
    questions_reset_date IS NULL OR
    DATE_TRUNC('month', questions_reset_date) < DATE_TRUNC('month', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

