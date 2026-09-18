import { PlayCircle, FileText, Crosshair, Zap } from 'lucide-react';

export function MentorshipPills() {
  const pills = [
    {
      title: "Como gerenciar as 5h da 1ª Fase",
      duration: "3 min",
      type: "Estratégia",
      icon: Clock,
      color: "bg-blue-500",
      description: "Comece pelas disciplinas que você tem mais afinidade (Peso 1: Ética, Constitucional). Deixe matérias longas (Empresarial, Tributário) para o final."
    },
    {
      title: "Chute Consciente",
      duration: "2 min",
      type: "Técnica",
      icon: Crosshair,
      color: "bg-red-500",
      description: "A FGV adora usar palavras absolutas para invalidar alternativas ('Sempre', 'Nunca', 'Apenas'). Desconfie fortemente dessas opções."
    },
    {
      title: "O Segredo do Vade Mecum",
      duration: "4 min",
      type: "2ª Fase",
      icon: BookOpen,
      color: "bg-emerald-500",
      description: "Treine o uso do Índice Remissivo. Marque as palavras-chave principais do seu edital. Não decore artigos, saiba como encontrá-los rápido."
    },
    {
      title: "Branco na hora da Peça?",
      duration: "2 min",
      type: "Emocional",
      icon: Zap,
      color: "bg-purple-500",
      description: "Respire. Faça o esqueleto básico (Endereçamento -> Qualificação -> Fatos -> Direito -> Pedidos). Só os fatos e a estrutura já garantem pontuação."
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pills.map((pill, idx) => (
        <div key={idx} className="group cursor-pointer bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all duration-300 rounded-2xl p-5 flex gap-4">
          <div className={`${pill.color}/20 h-14 w-14 shrink-0 rounded-xl flex items-center justify-center`}>
            <PlayCircle className={pill.color.replace('bg-', 'text-')} size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">
                {pill.type}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                {pill.duration}
              </span>
            </div>
            <h5 className="font-bold text-slate-200 group-hover:text-white transition-colors mb-2">
              {pill.title}
            </h5>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
              {pill.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Importing icons here to avoid modifying props or missing imports
import { Clock, BookOpen } from 'lucide-react';
