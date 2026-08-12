-- The existing RLS policy "Users can update their own profile" only restricts
-- which ROW a user can target (their own), not which COLUMNS they can change.
-- Since Postgres RLS has no built-in column-level check, an authenticated user
-- could otherwise call `.update({ is_pro: true, ... })` directly from the
-- client and grant themselves a paid subscription for free, or reset their
-- own usage counters at will.
--
-- Column-level GRANTs are the correct Postgres mechanism for this: revoke
-- blanket UPDATE and grant it back only for the counter fields that
-- legitimately need client-side writes. Billing/subscription fields
-- (is_pro, subscription_*, stripe_*) must only ever be written by the
-- service-role Stripe edge functions, which bypass RLS/grants entirely.
REVOKE UPDATE ON public.user_profiles FROM authenticated;
GRANT UPDATE (pdf_count, questions_used_this_month, questions_reset_date) ON public.user_profiles TO authenticated;
