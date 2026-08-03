create index if not exists favorites_user_id_idx on public.user_favorites(user_id);
create index if not exists history_user_id_idx on public.user_activity_history(user_id);
create index if not exists responses_user_id_idx on public.user_responses(user_id);
create index if not exists recommendations_user_id_idx on public.recommendation_sessions(user_id);
create index if not exists feedback_user_id_idx on public.feedback(user_id);
create index if not exists imports_user_id_idx on public.local_data_imports(user_id);
create index if not exists activities_published_idx on public.activities(is_published, category);
