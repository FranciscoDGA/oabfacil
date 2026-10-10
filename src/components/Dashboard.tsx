import { BookOpen, PenLine } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Olá 👋</h2>
        <p className="text-slate-400">Acompanhe seu progresso real. Nada de números decorativos: os indicadores abaixo entram em uso conforme você estuda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Questões resolvidas</p>
              <h3 className="text-2xl font-bold text-white">—</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500">Sem dados ainda. Resolva questões no Banco de Questões para começar a contar.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary-500/20 text-primary-500 rounded-xl">
              <PenLine size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Exercícios de escrita</p>
              <h3 className="text-2xl font-bold text-white">—</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500">Sem dados ainda. Abra o Laboratório e redija sua primeira resposta.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Tempo de estudo</p>
              <h3 className="text-2xl font-bold text-white">—</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500">Sem dados ainda. O registro de tempo chega em uma próxima etapa.</p>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-2">Por onde começar</h3>
        <ul className="space-y-2 text-slate-300 text-sm list-disc list-inside">
          <li><b>Banco de Questões</b>: resolva questões com explicação (disponível).</li>
          <li><b>Laboratório</b>: treine respostas discursivas com correção e reescrita (novo).</li>
          <li><b>Como Usar</b>: leia o guia rápido da plataforma.</li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Metas diárias, recomendações personalizadas e estatísticas entram em versões futuras — sem números inventados.</p>
      </div>
    </div>
  );
}
