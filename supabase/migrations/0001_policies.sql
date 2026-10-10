-- 0001_policies.sql — P0
-- Objetivo: manter leitura pública de questões e restringir escrita a usuário autenticado.
-- Executar no SQL Editor do painel do Supabase.

-- Garante que RLS está ativo (já vem do seed.sql, mas reforça)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Remove policies antigas de escrita, se existirem
DROP POLICY IF EXISTS "Insert autenticado" ON public.questions;
DROP POLICY IF EXISTS "Update autenticado" ON public.questions;
DROP POLICY IF EXISTS "Delete autenticado" ON public.questions;

-- Escrita apenas para usuário autenticado (uso pessoal: só quem tem login)
CREATE POLICY "Insert autenticado"
ON public.questions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Update autenticado"
ON public.questions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Delete autenticado"
ON public.questions FOR DELETE
TO authenticated
USING (true);
