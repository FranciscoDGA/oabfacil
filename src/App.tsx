import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { QuestionBank } from './components/QuestionBank';
import { Admin } from './components/Admin';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'questions':
        return <QuestionBank />;
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
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
