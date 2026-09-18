-- 1. Criação da Tabela de Questões
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  theme TEXT NOT NULL,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security) para segurança (Leitura pública)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questões são públicas para leitura" 
ON public.questions FOR SELECT 
USING (true);

-- 3. Inserindo 5 questões de exemplo (Você pode inserir milhares aqui usando importação CSV no painel do Supabase)
INSERT INTO public.questions (subject, theme, text, options, correct, explanation) VALUES
('Direito Penal', 'Crimes contra o patrimônio', 'Caio, com intenção de subtrair para si coisa alheia móvel, aborda Tício na rua e, simulando portar arma de fogo, exige que este lhe entregue o celular. Qual é o crime cometido por Caio?', '["a) Furto simples.", "b) Furto qualificado pelo emprego de fraude.", "c) Roubo circunstanciado pelo emprego de arma de fogo.", "d) Roubo simples."]', 3, 'A simulação de porte de arma caracteriza a grave ameaça inerente ao crime de roubo simples (art. 157, caput, CP). Não incide a majorante de arma de fogo pois a arma era apenas simulada.'),

('Direito Constitucional', 'Controle de Constitucionalidade', 'Sobre a Ação Direta de Inconstitucionalidade (ADI), quem possui legitimidade universal para propô-la?', '["a) O Governador de Estado.", "b) A Mesa da Assembleia Legislativa.", "c) O Conselho Federal da OAB.", "d) Confederação sindical."]', 2, 'O Conselho Federal da OAB possui legitimidade universal para propor ADI (Art. 103, VII, da CF), não precisando demonstrar pertinência temática.'),

('Ética Profissional', 'Infrações e Sanções Disciplinares', 'A sanção disciplinar de censura é aplicável em qual dos casos abaixo?', '["a) Quando houver locupletamento à custa do cliente.", "b) Em casos de violação a preceito do Código de Ética e Disciplina.", "c) Quando o advogado se recusar injustificadamente a prestar contas.", "d) Em casos de condenação por crime infamante."]', 1, 'A censura é aplicável nos casos de infrações definidas no art. 36 do EAOAB e violação a preceito do Código de Ética (Art. 36, II, do EAOAB).'),

('Direito Civil', 'Direitos da Personalidade', 'Os direitos da personalidade, salvo exceção legal, são:', '["a) Transmissíveis e irrenunciáveis.", "b) Intransmissíveis e irrenunciáveis.", "c) Intransmissíveis e renunciáveis.", "d) Relativos e disponíveis."]', 1, 'Com exceção dos casos previstos em lei, os direitos da personalidade são intransmissíveis e irrenunciáveis, não podendo o seu exercício sofrer limitação voluntária (Art. 11 do Código Civil).'),

('Direito Administrativo', 'Licitações', 'Na Nova Lei de Licitações (Lei 14.133/2021), a modalidade de licitação obrigatória para a aquisição de bens e serviços comuns é o:', '["a) Leilão.", "b) Concorrência.", "c) Pregão.", "d) Diálogo Competitivo."]', 2, 'O pregão é a modalidade de licitação obrigatória para aquisição de bens e serviços comuns, cujo critério de julgamento poderá ser o de menor preço ou o de maior desconto (Art. 29 da Lei 14.133/21).');
