import { Target, BookOpen, Clock, Activity, CheckCircle } from 'lucide-react';
import { GamificationWidget } from './GamificationWidget';

export function Dashboard() {
  const stats = [
    { label: 'Questões Resolvidas', value: '1.248', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Taxa de Acerto', value: '68%', icon: Target, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Horas de Estudo', value: '45h', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Simulados Feitos', value: '4', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Olá, Estudante 👋</h2>
        <p className="text-slate-400">Aqui está o resumo do seu progresso até a aprovação.</p>
      </div>

      <GamificationWidget />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-500/20 text-primary-500 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Questões Resolvidas</p>
              <h3 className="text-2xl font-bold text-white">142</h3>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Meta: 300 questões na semana</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Tempo de Estudo</p>
              <h3 className="text-2xl font-bold text-white">12h 30m</h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Simulados Feitos</p>
              <h3 className="text-2xl font-bold text-white">4</h3>
            </div>
          </div>
          <p className="text-sm text-green-400 font-medium">+10% de evolução na nota</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Meta do Dia</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                </div>
                <span className="text-slate-200 line-through opacity-70">Revisar Direito Constitucional</span>
              </div>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">Feito</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-slate-500"></div>
                <span className="text-slate-200">Resolver 20 questões de Direito Penal</span>
              </div>
              <button className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded transition-colors">
                Iniciar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Recomendado para Você</h3>
          <div className="space-y-4">
            <div className="group cursor-pointer p-4 bg-gradient-to-r from-slate-800 to-slate-800/50 hover:from-slate-700 hover:to-slate-800 rounded-xl border border-slate-700 transition-all">
              <h4 className="text-slate-200 font-medium group-hover:text-primary-400 transition-colors">Videoaula: Dos Crimes Contra a Vida</h4>
              <p className="text-sm text-slate-400 mt-1">Direito Penal • 45 min</p>
            </div>
            <div className="group cursor-pointer p-4 bg-gradient-to-r from-slate-800 to-slate-800/50 hover:from-slate-700 hover:to-slate-800 rounded-xl border border-slate-700 transition-all">
              <h4 className="text-slate-200 font-medium group-hover:text-primary-400 transition-colors">Resumo: Controle de Constitucionalidade</h4>
              <p className="text-sm text-slate-400 mt-1">Direito Constitucional • Leitura de 10 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
