import { Users, MessageSquare, TrendingUp, HelpCircle } from 'lucide-react';

export function Community() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="text-blue-500" />
          Comunidade OAB Fácil
        </h2>
        <p className="text-slate-400 text-lg">
          Discuta com outros estudantes, tire dúvidas e compartilhe seus macetes de aprovação.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300 shrink-0">
              US
            </div>
            <input 
              type="text" 
              placeholder="Tem alguma dúvida ou macete para compartilhar?" 
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Post 1 */}
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center font-bold">
                  AM
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Ana Maria</p>
                  <p className="text-slate-500 text-xs">Há 2 horas • Dúvida: Processo Penal</p>
                </div>
              </div>
              <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded font-medium">
                Dúvida
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Gente, não consigo entender a diferença prática entre o Recurso em Sentido Estrito (RESE) e a Apelação no Júri. Alguém tem um macete bom para não confundir na hora da prova?
            </p>
            <div className="flex gap-4 border-t border-slate-700 pt-4">
              <button className="flex items-center gap-2 text-slate-400 hover:text-blue-400 text-sm transition-colors">
                <TrendingUp size={16} /> 12
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors">
                <MessageSquare size={16} /> 5 Comentários
              </button>
            </div>
          </div>

          {/* Post 2 */}
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center font-bold">
                  JP
                </div>
                <div>
                  <p className="text-white font-medium text-sm">João Pedro</p>
                  <p className="text-slate-500 text-xs">Há 5 horas • Macete: Direito Constitucional</p>
                </div>
              </div>
              <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded font-medium">
                Macete
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Macete infalível para os legitimados da ADI (Art. 103 da CF)! Lembrem da regra dos 3:<br/><br/>
              <b>3 Pessoas:</b> Presidente, PGR, Governador<br/>
              <b>3 Mesas:</b> Senado, Câmara, Assembleia<br/>
              <b>3 Instituições:</b> OAB, Partido Político, Confederação Sindical
            </p>
            <div className="flex gap-4 border-t border-slate-700 pt-4">
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                <TrendingUp size={16} /> 145
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors">
                <MessageSquare size={16} /> 12 Comentários
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Direita (Ranking) */}
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-orange-500" size={18} /> Em Alta
            </h3>
            <div className="space-y-4">
              <div className="cursor-pointer group">
                <p className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors">#AprovacaoOAB38</p>
                <p className="text-xs text-slate-500">1.2k discussões</p>
              </div>
              <div className="cursor-pointer group">
                <p className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors">#DicasPeçaTrabalhista</p>
                <p className="text-xs text-slate-500">850 discussões</p>
              </div>
              <div className="cursor-pointer group">
                <p className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors">#Cronograma90Dias</p>
                <p className="text-xs text-slate-500">430 discussões</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 border border-blue-500/50">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <HelpCircle size={18} /> Mentoria Premium
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Precisa de ajuda individual com suas peças? Agende uma sessão com nossos mentores aprovados.
            </p>
            <button className="w-full bg-white text-blue-700 font-bold py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors">
              Encontrar Mentor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
