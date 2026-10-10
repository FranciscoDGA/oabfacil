import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { QuestionBank } from './components/QuestionBank';
import { Admin } from './components/Admin';
import { Onboarding } from './components/Onboarding';
import { ExamSimulator } from './components/ExamSimulator';
import { Community } from './components/Community';
import { Laboratorio } from './components/lab/Laboratorio';
import { LoginScreen } from './components/LoginScreen';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-slate-400">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'onboarding':
        return <Onboarding />;
      case 'questions':
        return <QuestionBank />;
      case 'lab':
        return <Laboratorio />;
      case 'exams':
        return <ExamSimulator />;
      case 'community':
        return <Community />;
      case 'admin':
        return <Admin />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <h2 className="text-2xl font-bold mb-2">Em breve...</h2>
            <p>Este módulo está em desenvolvimento.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userEmail={session.user.email ?? ''}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
