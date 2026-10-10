# Roadmap (ordem do prompt mestre, §30)

## P0 — Base estável ✅ (2026-10-09)
- Auth magic link (substitui "Usuário Teste" fake).
- Policies: escrita em `questions` só autenticado.
- Build destravado (3 erros TS6133 corrigidos); lint zerado.
- Honesty pass: Dashboard/Onboarding/QuestionBank/Simulados sem números nem "IA/espelho" inventados; fórum fake removido; mojibake corrigido.
- Documentação (AGENTS.md + docs/).

## P1 — Laboratório de escrita 🟡 (código pronto; falta secret da IA)
- Schema `0002_writing_lab.sql` (exercícios, tentativas, versões, avaliações + RLS).
- UI: aba Laboratório — editor com autosave (estado real salvando/salvo/erro), dicas 0–5 com registro de nível, avaliação, reescrita, histórico de versões.
- Edge Function `evaluate-attempt` pronta para deploy.
- Testes: 6 automatizados (autosave, falha de IA honesta, reescrita, versionamento).
- **Pendente seu**: colar `0001`/`0002` no SQL Editor · publicar a função · criar secret `OPENAI_API_KEY`.

## P2 — Avaliação estruturada com fontes oficiais
Quando houver espelho/edital documentado: campos de critério oficial separados da avaliação IA.

## P3 — 1ª fase completa
Persistir tentativas de questões, caderno de erros, revisão espaçada, simulados com questões reais identificadas por fonte.

## P4 — Disciplinas e documentos
Matriz FIC (insumo no projeto Rota OAB, marcar "a confirmar no PPC"), biblioteca pessoal, fichamentos.

## P5 — Painel real
Estatísticas derivadas de dados reais; remover qualquer resíduo decorativo.

## P6 — Magistratura e trilha ética opcional
Concursos jurídicos, ENAM (verificar regulamentação vigente), trilha de reflexão ética separada da avaliação.
