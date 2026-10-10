import { supabase } from './supabase';

export interface WritingExercise {
  id: string;
  area: string;
  tipo: 'discursiva' | 'peca';
  titulo: string;
  enunciado: string;
  tempo_sugerido_min: number | null;
  criterios: { id: string; titulo: string; orientacao: string }[];
  dicas: string[];
  fonte: { tipo: string; autor?: string; referencia?: string };
  created_at: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  exercise_id: string;
  status: 'rascunho' | 'em_curso' | 'concluida';
  nivel_ajuda_usado: number;
  created_at: string;
  updated_at: string;
}

export interface AttemptVersion {
  id: string;
  attempt_id: string;
  numero: number;
  texto: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
  attempt_version_id: string;
  status: 'ok' | 'falhou' | 'nao_configurada';
  categorias: Record<string, { diagnostico: string; orientacao: string; trecho?: string }>;
  pontos_fortes: string[];
  problemas: { trecho: string; falha: string; como_corrigir: string }[];
  recomendacoes: string[];
  aviso_limitacoes: string | null;
  created_at: string;
}

export function nextVersionNumber(versions: { numero: number }[]): number {
  if (versions.length === 0) return 1;
  return Math.max(...versions.map((v) => v.numero)) + 1;
}

export async function listExercises(): Promise<WritingExercise[]> {
  const { data, error } = await supabase
    .from('writing_exercises')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as WritingExercise[];
}

async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Sessão expirada. Entre novamente.');
  return data.user.id;
}

export async function getOrCreateAttempt(exerciseId: string): Promise<Attempt> {
  const userId = await currentUserId();
  const { data: existing, error: fetchError } = await supabase
    .from('attempts')
    .select('*')
    .eq('exercise_id', exerciseId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  if (fetchError) throw fetchError;
  if (existing && existing.length > 0) return existing[0] as Attempt;

  const { data: created, error: insertError } = await supabase
    .from('attempts')
    .insert({ user_id: userId, exercise_id: exerciseId, status: 'em_curso' })
    .select()
    .single();
  if (insertError) throw insertError;
  return created as Attempt;
}

export async function getOrCreateWorkingVersion(attemptId: string): Promise<AttemptVersion> {
  const { data: versions, error } = await supabase
    .from('attempt_versions')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('numero', { ascending: false });
  if (error) throw error;
  if (versions && versions.length > 0) return versions[0] as AttemptVersion;

  const numero = nextVersionNumber([]);
  const { data: created, error: insertError } = await supabase
    .from('attempt_versions')
    .insert({ attempt_id: attemptId, numero, texto: '' })
    .select()
    .single();
  if (insertError) throw insertError;
  return created as AttemptVersion;
}

export async function saveVersionText(versionId: string, texto: string): Promise<void> {
  const { error } = await supabase
    .from('attempt_versions')
    .update({ texto })
    .eq('id', versionId);
  if (error) throw error;
}

export async function startRewrite(attemptId: string): Promise<AttemptVersion> {
  const { data: versions, error } = await supabase
    .from('attempt_versions')
    .select('numero')
    .eq('attempt_id', attemptId);
  if (error) throw error;
  const numero = nextVersionNumber(versions ?? []);
  const { data: created, error: insertError } = await supabase
    .from('attempt_versions')
    .insert({ attempt_id: attemptId, numero, texto: '' })
    .select()
    .single();
  if (insertError) throw insertError;
  return created as AttemptVersion;
}

export async function listVersions(attemptId: string): Promise<AttemptVersion[]> {
  const { data, error } = await supabase
    .from('attempt_versions')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('numero', { ascending: true });
  if (error) throw error;
  return (data ?? []) as AttemptVersion[];
}

export async function getEvaluation(versionId: string): Promise<Evaluation | null> {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('attempt_version_id', versionId)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[0] as Evaluation;
}

export async function bumpHelpLevel(attemptId: string, nivel: number): Promise<void> {
  const { data, error } = await supabase
    .from('attempts')
    .select('nivel_ajuda_usado')
    .eq('id', attemptId)
    .single();
  if (error) throw error;
  const atual = (data?.nivel_ajuda_usado ?? 0) as number;
  if (nivel > atual) {
    await supabase.from('attempts').update({ nivel_ajuda_usado: nivel }).eq('id', attemptId);
  }
}

export type EvaluationResult =
  | { ok: true; evaluation: Evaluation }
  | { ok: false; kind: 'nao_configurada' | 'erro'; message: string };

export async function requestEvaluation(versionId: string): Promise<EvaluationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('evaluate-attempt', {
      body: { attempt_version_id: versionId },
    });
    if (error) {
      const status = (error as { context?: { status?: number } }).context?.status;
      if (status === 501) {
        return {
          ok: false,
          kind: 'nao_configurada',
          message: 'A avaliação por IA ainda não está configurada no servidor (falta o secret OPENAI_API_KEY). Seu texto continua salvo.',
        };
      }
      return {
        ok: false,
        kind: 'erro',
        message: 'Não foi possível concluir a avaliação agora. Seu texto foi salvo — tente novamente em instantes.',
      };
    }
    if (data?.status === 'nao_configurada') {
      return {
        ok: false,
        kind: 'nao_configurada',
        message: data.message ?? 'A avaliação por IA ainda não está configurada no servidor. Seu texto continua salvo.',
      };
    }
    return { ok: true, evaluation: data as Evaluation };
  } catch {
    return {
      ok: false,
      kind: 'erro',
      message: 'Falha de conexão ao pedir a avaliação. Seu texto foi salvo.',
    };
  }
}
