import { useEffect, useState } from 'react';
import { PenLine, Loader2, BookOpen } from 'lucide-react';
import { listExercises, type WritingExercise } from '../../lib/lab';
import { ExercicioView } from './ExercicioView';

export function Laboratorio() {
  const [exercises, setExercises] = useState<WritingExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WritingExercise | null>(null);

  useEffect(() => {
    listExercises()
      .then(setExercises)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    return <ExercicioView exercise={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <PenLine className="text-primary-500" />
          Laboratório de Escrita
        </h2>
        <p className="text-slate-400">
          Treine respostas discursivas: redija, receba avaliação pedagógica, use dicas e reescreva. A avaliação é orientação de estudo — não é nota de banca.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-[40vh] text-slate-400">
          <Loader2 className="animate-spin mr-3" size={28} />
          Carregando exercícios...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
          Não foi possível carregar os exercícios: {error}
        </div>
      )}

      {!loading && !error && exercises.length === 0 && (
        <div className="p-8 bg-slate-800 border border-slate-700 rounded-2xl text-center text-slate-400">
          <BookOpen className="mx-auto mb-3 text-slate-500" size={32} />
          <p className="text-lg font-bold text-slate-200 mb-1">Nenhum exercício cadastrado ainda.</p>
          <p className="text-sm">Rode a migração <code className="text-slate-300">0002_writing_lab.sql</code> no painel do Supabase (inclui um exercício de exemplo).</p>
        </div>
      )}

      {!loading && !error && exercises.length > 0 && (
        <div className="space-y-4">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelected(ex)}
              className="w-full text-left bg-slate-800 border border-slate-700 hover:border-primary-500/50 rounded-2xl p-6 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary-900/50 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {ex.area}
                </span>
                <span className="text-slate-500 text-xs uppercase">{ex.tipo === 'discursiva' ? 'Questão discursiva' : 'Peça prático-profissional'}</span>
                {ex.tempo_sugerido_min && (
                  <span className="text-slate-500 text-xs ml-auto">{ex.tempo_sugerido_min} min sugeridos</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{ex.titulo}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{ex.enunciado}</p>
              <p className="text-xs text-slate-600 mt-2">
                Fonte: {ex.fonte.tipo === 'pedagogica' ? 'exercício pedagógico autoral (não é questão oficial de banca)' : ex.fonte.tipo}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
