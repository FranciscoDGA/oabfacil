-- 0002_writing_lab.sql — P1 Laboratório de Escrita Jurídica
-- Executar no SQL Editor do painel do Supabase, após 0001_policies.sql.

-- 1. Exercícios de escrita
CREATE TABLE IF NOT EXISTS public.writing_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'discursiva' CHECK (tipo IN ('discursiva', 'peca')),
  titulo TEXT NOT NULL,
  enunciado TEXT NOT NULL,
  tempo_sugerido_min INTEGER,
  criterios JSONB NOT NULL DEFAULT '[]'::jsonb,
  dicas JSONB NOT NULL DEFAULT '[]'::jsonb,
  fonte JSONB NOT NULL DEFAULT '{"tipo":"pedagogica"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tentativas (uma linha por ciclo de escrita/reescrita de um usuário em um exercício)
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.writing_exercises(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'em_curso', 'concluida')),
  nivel_ajuda_usado INTEGER NOT NULL DEFAULT 0 CHECK (nivel_ajuda_usado BETWEEN 0 AND 5),
  tempo_gasto_seg INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Versões do texto (versionamento de rascunhos e reescritas)
CREATE TABLE IF NOT EXISTS public.attempt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  texto TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (attempt_id, numero)
);

-- 4. Avaliações pedagógicas (por versão)
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_version_id UUID NOT NULL REFERENCES public.attempt_versions(id) ON DELETE CASCADE,
  modelo TEXT NOT NULL DEFAULT 'ia',
  status TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'falhou', 'nao_configurada')),
  categorias JSONB NOT NULL DEFAULT '{}'::jsonb,
  pontos_fortes JSONB NOT NULL DEFAULT '[]'::jsonb,
  problemas JSONB NOT NULL DEFAULT '[]'::jsonb,
  recomendacoes JSONB NOT NULL DEFAULT '[]'::jsonb,
  aviso_limitacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RLS
ALTER TABLE public.writing_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Exercícios legíveis por autenticados" ON public.writing_exercises;
CREATE POLICY "Exercícios legíveis por autenticados"
ON public.writing_exercises FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Dono gerencia tentativas" ON public.attempts;
CREATE POLICY "Dono gerencia tentativas"
ON public.attempts FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Dono gerencia versões" ON public.attempt_versions;
CREATE POLICY "Dono gerencia versões"
ON public.attempt_versions FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Dono lê avaliações" ON public.evaluations;
CREATE POLICY "Dono lê avaliações"
ON public.evaluations FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1
  FROM public.attempt_versions v
  JOIN public.attempts a ON a.id = v.attempt_id
  WHERE v.id = attempt_version_id AND a.user_id = auth.uid()
));

-- Escrita em evaluations apenas via service role (Edge Function)
DROP POLICY IF EXISTS "Service role grava avaliações" ON public.evaluations;
CREATE POLICY "Service role grava avaliações"
ON public.evaluations FOR INSERT
TO service_role
WITH CHECK (true);

-- 6. Trigger de updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS attempts_touch ON public.attempts;
CREATE TRIGGER attempts_touch
BEFORE UPDATE ON public.attempts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 7. Exercício seed (autoral, rotulado como material pedagógico — NÃO é questão oficial de banca)
INSERT INTO public.writing_exercises (area, tipo, titulo, enunciado, tempo_sugerido_min, criterios, dicas, fonte)
VALUES (
  'Direito Civil',
  'discursiva',
  'Responsabilidade civil dos pais por ato do filho menor',
  'Roberto, 16 anos, dirigindo o automóvel de seu pai sem autorização, atropela Tício, que sofre graves lesões corporais. O pai estava em viagem a trabalho no momento do acidente e não sabia que o filho havia pegado o veículo.' || E'\n\n' ||
  'Com base no Código Civil brasileiro, discorra sobre a responsabilidade civil pelos danos causados a Tício. Indique os dispositivos legais aplicáveis, fundamente a posição dos pais e de Roberto, e conclua respondendo objetivamente quem deve reparar o dano e por quê.',
  30,
  '[
    {"id":"problema_juridico","titulo":"Identificação do problema jurídico","orientacao":"O enunciado pede a responsabilidade civil pelos danos e a posição dos pais e do menor."},
    {"id":"conclusao","titulo":"Conclusão objetiva","orientacao":"A resposta deve dizer quem responde (pai, filho ou ambos) e por quê."},
    {"id":"fundamentacao","titulo":"Fundamentação","orientacao":"Citam-se os arts. 1.86, 927, 932, I e 933 do Código Civil e se discute a culpa in vigilando."},
    {"id":"aplicacao","titulo":"Aplicação aos fatos","orientacao":"Liga a regra ao caso: filho menor sob autoridade/companhia, ausência de culpa na vigilância no caso concreto."},
    {"id":"dispositivos","titulo":"Dispositivos legais","orientacao":"Arts. 186 e 927 (ato ilícito e responsabilidade), 932, I e 933 (pais por filhos menores)."},
    {"id":"omissoes","titulo":"Omissões relevantes","orientacao":"Não esquecer a questão da idade (16 anos, relativa capacidade) e da posse/uso do veículo."},
    {"id":"clareza","titulo":"Clareza e estrutura","orientacao":"Parágrafos curtos: problema, regra, aplicação, conclusão."},
    {"id":"terminologia","titulo":"Precisão terminológica","orientacao":"Usar: responsabilidade civil, culpa in vigilando, reparação do dano — sem sinônimos vagos."}
  ]'::jsonb,
  '[
    "Pense: quem são os possíveis responsáveis no caso (menor, pais, ambos)?",
    "Procure no Código Civil os artigos que tratam da reparação civil e da responsabilidade dos pais por filhos menores.",
    "Estruture: (1) ato ilícito e nexo causal; (2) regra dos arts. 932, I e 933; (3) aplicação ao caso; (4) conclusão objetiva.",
    "Verifique se sua conclusão responde exatamente ao que foi perguntado e se os dispositivos citados estão corretos.",
    "Releia pedidos e requisições da resposta: ela precisa indicar quem repara o dano e por quê, com fundamentação."
  ]'::jsonb,
  '{"tipo":"pedagogica","autor":"exercício autoral do app","referencia":"Código Civil (Lei 10.406/2002), arts. 186, 927, 932 e 933"}'::jsonb
);
