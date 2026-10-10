import { Lightbulb, Target, BookOpen, Clock, PenLine, Construction } from 'lucide-react';
import { MentorshipPills } from './MentorshipPills';

export function Onboarding() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Lightbulb className="text-yellow-400" />
          Como usar o OAB Fácil
        </h2>
        <p className="text-slate-400 text-lg">
          Guia rápido do que já está disponível e do que está em construção.
        </p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-6">O que existe hoje</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="text-blue-400" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">1. Banco de Questões (1ª Fase)</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Resolva questões com explicação e fundamentação, ouça o enunciado por voz e avance no seu ritmo. Leia sempre as explicações, mesmo quando acertar.
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-primary-500/50 transition-colors">
            <div className="bg-primary-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <PenLine className="text-primary-400" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">2. Laboratório de Escrita (2ª Fase)</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Redija respostas discursivas com salvamento automático, receba avaliação pedagógica por IA (quando configurada), use dicas progressivas e reescreva comparando versões. A avaliação é orientação de estudo — <b>não é nota de banca</b>.
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-colors">
            <div className="bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Target className="text-orange-400" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">3. Simulados</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Estrutura de simulado com cronômetro e cartão-resposta disponível. As questões oficiais e o cálculo real de nota <b>ainda não estão conectados</b> — hoje é um roteiro de treino.
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-slate-500/50 transition-colors">
            <div className="bg-slate-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Construction className="text-slate-300" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">4. Em construção</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Flashcards com revisão espaçada, caderno de erros, cronograma por disciplina e painel com estatísticas reais. Nada disso está pronto ainda — e não vai aparecer como se estivesse.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="text-slate-400" />
          Pílulas de Mentoria
        </h3>
        <p className="text-slate-400 mb-6">
          Dicas rápidas de estratégia de prova.
        </p>

        <MentorshipPills />
      </div>
    </div>
  );
}
