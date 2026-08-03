alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.user_favorites enable row level security;
alter table public.user_activity_history enable row level security;
alter table public.user_responses enable row level security;
alter table public.recommendation_sessions enable row level security;
alter table public.feedback enable row level security;
alter table public.local_data_imports enable row level security;

create policy "profiles_select_own" on public.profiles for select using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "activities_public_read" on public.activities for select using (is_published = true);
create policy "favorites_own_all" on public.user_favorites for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "history_own_all" on public.user_activity_history for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "responses_own_all" on public.user_responses for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "recommendations_own_all" on public.recommendation_sessions for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "feedback_insert" on public.feedback for insert with check (user_id is null or (select auth.uid()) = user_id);
create policy "feedback_select_own" on public.feedback for select using ((select auth.uid()) = user_id);
create policy "imports_own_all" on public.local_data_imports for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
