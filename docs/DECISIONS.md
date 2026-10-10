# Decisões técnicas e de produto

| # | Decisão | Justificativa |
|---|---|---|
| D1 | Manter Vite+React+Supabase (sem Next.js/RN) | Auditoria mostrou a stack real; prompt mestre exige preservar |
| D2 | Editor = textarea + autosave próprio (zero libs novas de UI); vitest só como devDependency | §11/§30 do prompt mestre |
| D3 | Supabase Auth magic link single-user | Protege respostas pessoais; RLS exige identidade |
| D4 | IA via Edge Function `evaluate-attempt` (chave só no servidor); falha preserva texto e é comunicada | §31/§32 |
| D5 | Alterações WIP do desenvolvedor commitadas como-is antes dos nossos commits (`dcbe3fa`) | Não sobrescrever trabalho alheio |
| D6 | Honesty pass: remover/rotular toda alegação falsa (stats, "IA analisou", "espelho FGV", fórum fake, "Filtros" morto) | §11/Parte XI |
| D7 | Nome visível segue "OAB Fácil"; "Companheiro Jurídico Pessoal" é a visão do produto | Evita churn de marca sem pedido |
| D8 | Migrações via SQL Editor do painel (CLI não instalada, zero dependência nova) | Praticidade + decisão de não adicionar CLI sem necessidade |
| D9 | Projeto Supabase antigo (`ctwxwntzfplruemwyawr`) estava morto (DNS NXDOMAIN + placeholder); novo projeto `ixwdqzltfdyutropaogd` verificado vivo em 2026-10-09 | Evidência: DNS + REST + auth health |
| D10 | `service_role` exposta em conversa foi mantida fora do repo; recomendação de rotação emitida | Segurança |
| D11 | PWA: identidade "OAB Fácil" mantida no manifest | Consistência |
