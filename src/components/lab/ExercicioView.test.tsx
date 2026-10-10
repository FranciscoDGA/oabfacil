import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ExercicioView } from './ExercicioView';
import type { WritingExercise } from '../../lib/lab';

vi.mock('../../lib/lab', () => ({
  getOrCreateAttempt: vi.fn(),
  getOrCreateWorkingVersion: vi.fn(),
  saveVersionText: vi.fn(),
  startRewrite: vi.fn(),
  listVersions: vi.fn(),
  getEvaluation: vi.fn(),
  bumpHelpLevel: vi.fn(),
  requestEvaluation: vi.fn(),
}));

import * as lab from '../../lib/lab';

const exercise: WritingExercise = {
  id: 'ex-1',
  area: 'Direito Civil',
  tipo: 'discursiva',
  titulo: 'Responsabilidade civil dos pais',
  enunciado: 'Roberto, 16 anos, dirige sem autorização e atropela Tício. Discorra sobre a responsabilidade civil.',
  tempo_sugerido_min: 30,
  criterios: [{ id: 'conclusao', titulo: 'Conclusão objetiva', orientacao: 'Dizer quem responde.' }],
  dicas: ['Dica nível 1', 'Dica nível 2', 'Dica nível 3', 'Dica nível 4', 'Dica nível 5'],
  fonte: { tipo: 'pedagogica' },
  created_at: '2026-10-09T00:00:00Z',
};

const attempt = {
  id: 'att-1',
  user_id: 'user-1',
  exercise_id: 'ex-1',
  status: 'em_curso' as const,
  nivel_ajuda_usado: 0,
  created_at: '2026-10-09T00:00:00Z',
  updated_at: '2026-10-09T00:00:00Z',
};

const version = {
  id: 'ver-1',
  attempt_id: 'att-1',
  numero: 1,
  texto: '',
  created_at: '2026-10-09T00:00:00Z',
};

const evaluationOk = {
  id: 'ev-1',
  attempt_version_id: 'ver-1',
  status: 'ok' as const,
  categorias: {
    conclusao: { diagnostico: 'Falta conclusão.', orientacao: 'Feche com quem responde.' },
  },
  pontos_fortes: ['Identificou o problema.'],
  problemas: [{ trecho: 'final', falha: 'Sem dispositivos.', como_corrigir: 'Cite os arts. 932 e 933.' }],
  recomendacoes: ['Releia responsabilidade civil.'],
  aviso_limitacoes: 'Avaliação pedagógica, não nota oficial.',
  created_at: '2026-10-09T00:00:00Z',
};

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('ExercicioView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(lab.getOrCreateAttempt).mockResolvedValue(attempt);
    vi.mocked(lab.getOrCreateWorkingVersion).mockResolvedValue(version);
    vi.mocked(lab.saveVersionText).mockResolvedValue(undefined);
    vi.mocked(lab.startRewrite).mockResolvedValue({ ...version, id: 'ver-2', numero: 2 });
    vi.mocked(lab.listVersions).mockResolvedValue([version]);
    vi.mocked(lab.getEvaluation).mockResolvedValue(null);
    vi.mocked(lab.bumpHelpLevel).mockResolvedValue(undefined);
    vi.mocked(lab.requestEvaluation).mockResolvedValue({
      ok: false,
      kind: 'nao_configurada',
      message: 'A avaliação por IA ainda não está configurada no servidor (falta o secret OPENAI_API_KEY). Seu texto continua salvo.',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('exibe o enunciado e salva o rascunho automaticamente após digitar', async () => {
    render(<ExercicioView exercise={exercise} onBack={() => {}} />);
    await flush();

    expect(screen.getByText(exercise.titulo)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Redija sua resposta/);
    fireEvent.change(textarea, { target: { value: 'Os pais respondem com base nos arts. 932, I e 933 do Código Civil.' } });

    await act(async () => {
      vi.advanceTimersByTime(2600);
    });
    await flush();

    expect(lab.saveVersionText).toHaveBeenCalledWith('ver-1', 'Os pais respondem com base nos arts. 932, I e 933 do Código Civil.');
    expect(screen.getByText('Salvo')).toBeInTheDocument();
  });

  it('mostra mensagem honesta quando a avaliação por IA não está configurada', async () => {
    render(<ExercicioView exercise={exercise} onBack={() => {}} />);
    await flush();

    const textarea = screen.getByPlaceholderText(/Redija sua resposta/);
    fireEvent.change(textarea, { target: { value: 'Resposta de teste com texto suficiente para avaliação pedagógica.' } });

    fireEvent.click(screen.getByText('Pedir avaliação'));
    await flush();

    expect(screen.getByText(/A avaliação por IA ainda não está configurada/)).toBeInTheDocument();
  });

  it('oferece reescrita após avaliação concluída e cria nova versão', async () => {
    vi.mocked(lab.getEvaluation).mockResolvedValue(evaluationOk);

    render(<ExercicioView exercise={exercise} onBack={() => {}} />);
    await flush();

    expect(screen.getByRole('heading', { name: /Avaliação pedagógica/ })).toBeInTheDocument();
    expect(screen.getByText(/Não é nota oficial/)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Reescrever/));
    await flush();

    expect(lab.startRewrite).toHaveBeenCalledWith('att-1');
    const textarea = screen.getByPlaceholderText(/Redija sua resposta/) as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
    expect(screen.queryByRole('heading', { name: /Avaliação pedagógica/ })).not.toBeInTheDocument();
  });
});
