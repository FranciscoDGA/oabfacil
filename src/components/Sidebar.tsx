import { BookOpen, Target, Users, BookMarked, Database, Lightbulb, PenLine, LogOut } from 'lucide-react';
import { signOut } from '../lib/auth';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userEmail: string;
}

export function Sidebar({ currentTab, setCurrentTab, userEmail }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Target },
    { id: 'onboarding', label: 'Como Usar (Guia)', icon: Lightbulb },
    { id: 'questions', label: 'Banco de Questões', icon: BookOpen },
    { id: 'lab', label: 'Laboratório', icon: PenLine },
    { id: 'exams', label: 'Simulados', icon: BookMarked },
    { id: 'community', label: 'Comunidade', icon: Users },
    { id: 'admin', label: 'Administração', icon: Database },
  ];

  return (
    <aside className="w-56 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-primary-600 p-2 rounded-lg">
          <BookMarked size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide">OAB Fácil</h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
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
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
            {userEmail.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="block text-xs font-medium text-slate-200 truncate">{userEmail}</span>
            <span className="block text-[10px] text-slate-500">Uso pessoal</span>
          </div>
          <button
            onClick={() => void signOut()}
            title="Sair"
            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
