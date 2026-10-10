# Arquitetura técnica real (auditada em 2026-10-09)

## Stack
| Camada | Tecnologia |
|---|---|
| Front | Vite 8 · React 19 · TypeScript ~6 · Tailwind 4 · lucide-react · papaparse |
| Rotas | SPA com `useState` em `src/App.tsx` (sem react-router) |
| Backend | Supabase (Postgres, RLS, Auth, Edge Functions/Deno) |
| Auth | Magic link por e-mail (`signInWithOtp`), single-user pessoal |
| PWA | vite-plugin-pwa (manifest "OAB Fácil") |
| Testes | vitest + @testing-library/react (jsdom) |
| Lint | oxlint |

## Banco de dados (tabelas)
- `questions` — banco de questões (SELECT público; escrita só autenticado).
- `writing_exercises`, `attempts`, `attempt_versions`, `evaluations` — Laboratório (RLS por `auth.uid()`; `evaluations` gravadas pela Edge Function via service role).

## IA
- Edge Function `evaluate-attempt` (Deno): valida JWT do usuário, confirma posse da tentativa, chama OpenAI (`OPENAI_API_KEY` secret; `OPENAI_MODEL` opcional, padrão `gpt-4o-mini`), grava `evaluations` e retorna. Sem secret → HTTP 501 `nao_configurada` (UI mostra estado honesto e preserva o texto do aluno).

## Segredos
- Cliente: apenas `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` em `.env.local` (gitignorado).
- Servidor: `OPENAI_API_KEY` como secret do Supabase. `service_role` fora do repo por decisão.

## Débitos conhecidos
- Ícones PWA (`pwa-192x192.png` etc.) referenciados no manifest mas ausentes em `public/`.
- Comunidade e Simulados são WIP sem backend.
- Sem router, sem registro de tempo de estudo, sem caderno de erros (roadmap).
