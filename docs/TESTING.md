# Testes e homologação

## Comandos (executar e reportar saída real)
```
npm run lint      # oxlint
npx tsc -p tsconfig.app.json --noEmit
npm run build     # tsc -b && vite build
npm test          # vitest run
```

## Estado em 2026-10-09 (pré-entrega P0+P1)
- lint: 0 erros / 0 avisos
- tsc: 0 erros
- build: exit 0 (PWA gerada)
- test: 6/6 (versão nextVersionNumber; autosave do editor; mensagem honesta quando IA não configurada; reescrita cria versão nova e limpa avaliação)

## Checklist de aceite do Laboratório (prompt mestre §33)
- [x] Abrir exercício
- [x] Registrar resposta (textarea)
- [x] Salvar resposta (autosave 2,5 s + blur; indicador salvando/salvo/erro)
- [x] Sair da tela (beforeunload avisa se houver texto não salvo)
- [x] Recuperar resposta (mesma tentativa é reaberta com o texto salvo)
- [x] Solicitar correção (botão; salva antes de enviar)
- [x] Tratar falha do serviço de IA (estado honesto; texto preservado)
- [x] Exibir avaliação recebida (categorias, trecho, orientação, aviso de limitação)
- [x] Reescrever resposta (nova versão)
- [x] Recuperar versões anteriores (lista com data)
- [ ] Comparar versões (diff lado a lado — pendente P2)
- [x] Acesso autorizado aos dados (RLS por auth.uid(); Edge Function valida posse)
- [ ] Tela pequena (teste manual em dispositivo — pendente homologação sua)
- [x] Regressão: abas antigas continuam compilando e testando

## Homologação manual pendente (requer seu Supabase + secret)
1. Rodar `0001_policies.sql` e `0002_writing_lab.sql` no SQL Editor.
2. Entrar por magic link no app de verdade (`npm run dev`).
3. Resolver uma questão do banco (seed `seed.sql`).
4. Fazer um exercício no Laboratório com IA configurada.
5. Verificar em celular real.
