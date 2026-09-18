import { Lightbulb, Target, BookOpen, Clock, Brain, FileSignature } from 'lucide-react';
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
          Seu guia definitivo para extrair o máximo da plataforma e garantir sua aprovação.
        </p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-6">Sua Jornada de Aprovação</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Item 1 */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-primary-500/50 transition-colors">
            <div className="bg-primary-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Target className="text-primary-400" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">1. Diagnóstico Inicial</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Comece pelo Dashboard. O sistema analisará seus acertos e erros para montar um cronograma adaptativo. Faremos você focar no que mais cai e no que você tem mais dificuldade.
            </p>
          </div>

          {/* Item 2 */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="text-blue-400" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">2. Banco de Questões (1ª Fase)</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Resolva pelo menos 50 questões por dia. Leia sempre as explicações, mesmo quando acertar. A OAB é repetitiva; dominar o padrão da banca FGV é essencial.
            </p>
          </div>

          {/* Item 3 */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors">
            <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Brain className="text-purple-400" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">3. Flash Revisão</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Use nossos Flashcards no seu tempo livre (ônibus, filas). Deslize para a direita ou esquerda. Nossa repetição espaçada garantirá que você memorize os artigos mais cobrados (Art. 5º CF, Súmulas).
            </p>
          </div>

          {/* Item 4 */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-colors">
            <div className="bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <FileSignature className="text-orange-400" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">4. Correção de Peças por IA (2ª Fase)</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Treine suas petições e recursos no nosso editor. A Inteligência Artificial vai pontuar sua peça usando o espelho oficial da FGV, indicando onde você perdeu pontos (Endereçamento, Fatos, Pedidos).
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
          Dicas rápidas e estratégias de prova que ninguém te conta na faculdade.
        </p>
        
        <MentorshipPills />
      </div>
    </div>
  );
}
