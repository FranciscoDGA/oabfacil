import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2, Lightbulb, Sparkles, RotateCcw, History, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import {
  type WritingExercise,
  type Attempt,
  type AttemptVersion,
  type Evaluation,
  getOrCreateAttempt,
  getOrCreateWorkingVersion,
  saveVersionText,
  startRewrite,
  listVersions,
  getEvaluation,
  bumpHelpLevel,
  requestEvaluation,
} from '../../lib/lab';

interface Props {
  exercise: WritingExercise;
  onBack: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type EvalState = 'none' | 'loading' | 'done' | 'unavailable';

export function ExercicioView({ exercise, onBack }: Props) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [version, setVersion] = useState<AttemptVersion | null>(null);
  const [versions, setVersions] = useState<AttemptVersion[]>([]);
  const [texto, setTexto] = useState('');
  const [lastSavedTexto, setLastSavedTexto] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [maxHint, setMaxHint] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evalState, setEvalState] = useState<EvalState>('none');
  const [evalMessage, setEvalMessage] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dirtyRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const a = await getOrCreateAttempt(exercise.id);
        if (cancelled) return;
        setAttempt(a);
        const v = await getOrCreateWorkingVersion(a.id);
        if (cancelled) return;
        setVersion(v);
        setTexto(v.texto);
        setLastSavedTexto(v.texto);
        setMaxHint(a.nivel_ajuda_usado);
        const vs = await listVersions(a.id);
        if (cancelled) return;
        setVersions(vs);
        const ev = await getEvaluation(v.id);
        if (cancelled) return;
        if (ev) {
          setEvaluation(ev);
          setEvalState(ev.status === 'ok' ? 'done' : 'unavailable');
        }
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Erro ao abrir o exercício.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [exercise.id]);

  const doSave = useCallback(
    async (textoToSave: string) => {
      if (!version) return;
      setSaveStatus('saving');
      try {
        await saveVersionText(version.id, textoToSave);
        setLastSavedTexto(textoToSave);
        dirtyRef.current = false;
        setSaveStatus('saved');
        setSaveError('');
      } catch {
        setSaveStatus('error');
        setSaveError('Não foi possível salvar. Verifique a conexão — seu texto continua na tela.');
      }
    },
    [version]
  );

  const handleTextChange = (novo: string) => {
    setTexto(novo);
    dirtyRef.current = true;
    setSaveStatus('idle');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void doSave(novo);
    }, 2500);
  };

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current && texto !== lastSavedTexto) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [texto, lastSavedTexto]);

  const revealHint = (level: number) => {
    setMaxHint((prev) => {
      const next = Math.max(prev, level);
      if (attempt) void bumpHelpLevel(attempt.id, next);
      return next;
    });
  };

  const handleEvaluate = async () => {
    if (!version) return;
    if (dirtyRef.current || texto !== lastSavedTexto) {
      await doSave(texto);
    }
    setEvalState('loading');
    setEvalMessage('');
    const result = await requestEvaluation(version.id);
    if (result.ok) {
      setEvaluation(result.evaluation);
      setEvalState('done');
      const vs = await listVersions(attempt!.id);
      setVersions(vs);
    } else {
      setEvalState('unavailable');
      setEvalMessage(result.message);
    }
  };

  const handleRewrite = async () => {
    if (!attempt) return;
    if (dirtyRef.current || texto !== lastSavedTexto) {
      await doSave(texto);
    }
    const nova = await startRewrite(attempt.id);
    setVersion(nova);
    setTexto('');
    setLastSavedTexto('');
    dirtyRef.current = false;
    setSaveStatus('idle');
    setEvaluation(null);
    setEvalState('none');
    setEvalMessage('');
    const vs = await listVersions(attempt.id);
    setVersions(vs);
    textareaRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-slate-400">
        <Loader2 className="animate-spin mr-3" size={28} /> Abrindo exercício...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6">
          <ArrowLeft size={18} /> Voltar
        </button>
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">{loadError}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-200">
        <ArrowLeft size={18} /> Voltar aos exercícios
      </button>

      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="bg-primary-900/50 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">{exercise.area}</span>
          {exercise.tempo_sugerido_min && (
            <span className="text-slate-500 text-xs">Tempo sugerido: {exercise.tempo_sugerido_min} min</span>
          )}
          <span className="text-slate-600 text-xs ml-auto">
            Fonte: {exercise.fonte.tipo === 'pedagogica' ? 'pedagógica (não oficial)' : exercise.fonte.tipo}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">{exercise.titulo}</h2>
        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{exercise.enunciado}</p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white">Sua resposta</h3>
          <span className="text-xs flex items-center gap-1.5" data-save-status={saveStatus}>
            {saveStatus === 'saving' && <><Loader2 size={12} className="animate-spin text-slate-400" /> <span className="text-slate-400">Salvando...</span></>}
            {saveStatus === 'saved' && <><CheckCircle2 size={12} className="text-green-500" /> <span className="text-green-500">Salvo</span></>}
            {saveStatus === 'error' && <><AlertCircle size={12} className="text-red-400" /> <span className="text-red-400">Erro ao salvar</span></>}
            {saveStatus === 'idle' && (texto === '' ? <span className="text-slate-600">Rascunho vazio</span> : <span className="text-slate-500">Não salvo ainda</span>)}
          </span>
        </div>

        {saveStatus === 'error' && (
          <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" /> {saveError}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={texto}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={() => {
            if (dirtyRef.current) void doSave(texto);
          }}
          placeholder="Redija sua resposta aqui. O salvamento é automático."
          className="w-full min-h-[40vh] bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 leading-relaxed focus:outline-none focus:border-primary-500 resize-y"
        />
        <p className="text-xs text-slate-500 mt-2">{texto.trim().length} caracteres</p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb size={18} className="text-yellow-400" /> Ajuda progressiva
        </h3>
        <p className="text-xs text-slate-500 mb-4">Nível 0 é tentar sozinho. Cada dica aberta registra o nível de ajuda usado nesta tentativa.</p>
        <div className="space-y-2">
          {exercise.dicas.map((dica, idx) => {
            const level = idx + 1;
            const revealed = maxHint >= level;
            return (
              <div key={level} className="border border-slate-700 rounded-xl p-3 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Nível {level}</span>
                  {!revealed && (
                    <button
                      onClick={() => revealHint(level)}
                      className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                    >
                      Ver dica
                    </button>
                  )}
                </div>
                {revealed && <p className="text-sm text-slate-300 mt-2">{dica}</p>}
              </div>
            );
          })}
        </div>
        {exercise.criterios.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs font-bold text-slate-400 mb-2">Critérios avaliados</p>
            <ul className="text-xs text-slate-500 space-y-1">
              {exercise.criterios.map((c) => (
                <li key={c.id}>• <b className="text-slate-400">{c.titulo}</b>: {c.orientacao}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => void handleEvaluate()}
          disabled={evalState === 'loading' || texto.trim().length === 0}
          className={`flex-1 min-w-[200px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            evalState === 'loading' || texto.trim().length === 0
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
          }`}
        >
          {evalState === 'loading' ? (
            <><Loader2 size={18} className="animate-spin" /> Avaliando...</>
          ) : (
            <><Sparkles size={18} /> Pedir avaliação</>
          )}
        </button>
        {evaluation && (
          <button
            onClick={() => void handleRewrite()}
            className="flex-1 min-w-[200px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <RotateCcw size={18} /> Reescrever (nova versão)
          </button>
        )}
        <button
          onClick={() => setShowVersions(!showVersions)}
          className="py-3 px-4 rounded-xl font-medium flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
        >
          <History size={18} /> Versões ({versions.length})
        </button>
      </div>

      {showVersions && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-3">Histórico de versões</h3>
          {versions.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma versão salva ainda.</p>
          ) : (
            <ul className="space-y-2">
              {versions.map((v) => (
                <li key={v.id} className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm">
                  <span className="text-slate-300">Versão {v.numero}{v.id === version?.id ? ' (atual)' : ''}</span>
                  <span className="text-slate-500 text-xs">{new Date(v.created_at).toLocaleString('pt-BR')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {evalState === 'unavailable' && (
        <div className="p-4 bg-orange-500/20 border border-orange-500/50 rounded-xl text-orange-300 text-sm flex items-start gap-2">
          <Info size={18} className="shrink-0 mt-0.5" />
          <span>{evalMessage}</span>
        </div>
      )}

      {evalState === 'done' && evaluation && (
        <div className="bg-slate-800/80 border border-primary-600/30 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles size={18} className="text-primary-400" /> Avaliação pedagógica
            </h3>
            <p className="text-xs text-slate-500">
              Orientação de estudo gerada por IA. Não é nota oficial e não reproduz o espelho de banca.
            </p>
          </div>

          {Object.entries(evaluation.categorias).length > 0 && (
            <div className="space-y-3">
              {Object.entries(evaluation.categorias).map(([cat, info]) => (
                <div key={cat} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                  <p className="text-sm font-bold text-slate-200 mb-1 capitalize">{cat.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-slate-400">{info.diagnostico}</p>
                  <p className="text-sm text-primary-300 mt-2">→ {info.orientacao}</p>
                  {info.trecho && <p className="text-xs text-slate-500 mt-2 italic">Trecho: "{info.trecho}"</p>}
                </div>
              ))}
            </div>
          )}

          {evaluation.pontos_fortes.length > 0 && (
            <div>
              <p className="text-sm font-bold text-green-400 mb-2">Pontos fortes</p>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                {evaluation.pontos_fortes.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {evaluation.problemas.length > 0 && (
            <div>
              <p className="text-sm font-bold text-red-400 mb-2">Problemas a corrigir</p>
              <div className="space-y-3">
                {evaluation.problemas.map((prob, i) => (
                  <div key={i} className="bg-slate-900/50 border border-red-500/20 rounded-xl p-4">
                    {prob.trecho && <p className="text-xs text-slate-500 italic mb-1">"{prob.trecho}"</p>}
                    <p className="text-sm text-slate-300 mb-1">{prob.falha}</p>
                    <p className="text-sm text-primary-300">→ {prob.como_corrigir}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {evaluation.recomendacoes.length > 0 && (
            <div>
              <p className="text-sm font-bold text-slate-300 mb-2">Recomendações de estudo</p>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                {evaluation.recomendacoes.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {evaluation.aviso_limitacoes && (
            <p className="text-xs text-slate-500 border-t border-slate-700 pt-3">{evaluation.aviso_limitacoes}</p>
          )}
        </div>
      )}
    </div>
  );
}
