import { BookOpen, Target, Users, BookMarked, Trophy, Database } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Target },
    { id: 'questions', label: 'Banco de Questões', icon: BookOpen },
    { id: 'exams', label: 'Simulados', icon: BookMarked },
    { id: 'community', label: 'Comunidade', icon: Users },
    { id: 'admin', label: 'Administração', icon: Database },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-primary-600 p-2 rounded-lg">
          <Trophy size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide">OAB Fácil</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentTab === item.id 
                ? 'bg-primary-600/10 text-primary-500 font-medium border border-primary-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
            US
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-slate-200">Usuário Teste</span>
            <span className="text-xs text-slate-500">Plano Premium</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
