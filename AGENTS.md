# AGENTS.md — Regras permanentes do OAB Fácil

## O que é este app
Aplicativo pessoal de formação jurídica (mobile-first PWA). Visão completa: `docs/PRODUCT_VISION.md`.

## Stack real (não presumir o contrário)
- **Vite 8 + React 19 + TypeScript + Tailwind 4** — NÃO é Next.js, NÃO é React Native.
- Backend **Supabase** (Postgres + RLS + Auth magic link + Edge Functions).
- Comandos: `npm run dev` · `npm run build` (tsc -b && vite build) · `npm run lint` (oxlint) · `npm test` (vitest).
- Porta padrão do dev: 5173.

## Regras inegociáveis
1. **Honestidade**: nenhum número inventado, nenhum botão que não faz nada, nenhuma promessa de nota/aprovação, nenhum "espelho oficial" não documentado. Se a funcionalidade não existe, dizer que não existe.
2. **Avaliação por IA é pedagógica** — nunca é nota de banca; sempre exibir o aviso de limitação.
3. **Segurança**: chaves só em `.env.local` (VITE_*) ou secrets do Supabase (Edge Functions). `service_role` NUNCA no repo, no cliente ou em logs.
4. **Preservar trabalho alheio**: antes de editar, `git status`; não sobrescrever alterações locais não relacionadas.
5. **Migrações SQL**: ficam em `supabase/migrations/` e são executadas no SQL Editor do painel (sem CLI instalada). Nunca aplicar SQL destrutivo sem backup/plano.
6. **Testes**: toda entrega nova passa por `tsc --noEmit` + `lint` + `build` + `test`, com saída real reportada. Nunca afirmar que algo funciona sem evidência.
7. **Edições incrementais**: uma entrega por vez, na ordem do `docs/ROADMAP.md`.

## Onde mexer para cada módulo
- Abas/rotas: `src/App.tsx` (switch) + `src/components/Sidebar.tsx`.
- Banco de questões: `src/components/QuestionBank.tsx` (tabela `questions`).
- Laboratório de escrita: `src/components/lab/` + `src/lib/lab.ts` + `supabase/functions/evaluate-attempt/`.
- Auth: `src/lib/auth.ts` + `src/components/LoginScreen.tsx`.
- Schema: `supabase/migrations/`.

## Estado conhecido (verdade em 2026-10-09)
- P0 concluído (auth, policies, honesty pass, build destravado).
- P1 (Laboratório) implementado no cliente e no schema; **avaliação por IA depende do secret `OPENAI_API_KEY` ainda não criado**.
- Simulados/Comunidade são WIP com estrutura real mas sem backend — tratados com textos honestos.
