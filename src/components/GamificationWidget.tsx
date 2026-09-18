import { Flame, Coins, Trophy, TrendingUp } from 'lucide-react';

export function GamificationWidget() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Ofensiva */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center gap-4 hover:border-orange-500/50 transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Flame className="text-orange-500" size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">Ofensiva</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">12</span>
            <span className="text-xs text-slate-500">dias</span>
          </div>
        </div>
      </div>

      {/* JusCoins */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center gap-4 hover:border-yellow-500/50 transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Coins className="text-yellow-500" size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-400 font-medium">JusCoins</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">850</span>
          </div>
        </div>
      </div>

      {/* Liga Atual */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500/50 transition-colors cursor-pointer group md:col-span-2">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Trophy className="text-blue-500" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <p className="text-sm text-slate-400 font-medium">Liga Bacharel</p>
            <span className="text-xs text-primary-400 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> Zona de Promoção
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-700">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 text-right">Faltam 150 pts para a Liga Advogado</p>
        </div>
      </div>
    </div>
  );
}
