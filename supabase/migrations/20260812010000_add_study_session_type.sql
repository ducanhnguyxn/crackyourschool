-- SchedulePage previously kept sessions in local React state only, never
-- persisting them, so the "type" of study session (quiz/flashcards/pdf/etc.)
-- was never stored anywhere. Add it so real sessions can carry the same
-- categorization the UI already displays.
ALTER TABLE public.study_sessions
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';
