import { useState, useEffect } from 'react';
import { ChevronRight, Loader2, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Question {
  id: string;
  subject: string;
  theme: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .limit(50); // Carrega até 50 questões de uma vez
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Embaralhar as questões para não ser sempre na mesma ordem
          const shuffled = data.sort(() => 0.5 - Math.random());
          setQuestions(shuffled);
        }
      } catch (error) {
        console.error('Erro ao buscar questões:', error);
        setFetchError('Não foi possível conectar ao banco de dados. Verifique a conexão e as credenciais do Supabase (.env.local).');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Carregando banco de questões do Supabase...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400 text-center px-6">
        {fetchError ? (
          <>
            <p className="text-xl font-bold mb-2 text-red-400">Falha ao carregar o banco.</p>
            <p>{fetchError}</p>
          </>
        ) : (
          <>
            <p className="text-xl font-bold mb-2">Nenhuma questão encontrada.</p>
            <p>O banco de dados está acessível, mas ainda não há questões cadastradas.</p>
            <p className="text-sm mt-4 text-slate-500">Rode o <code className="text-slate-300">seed.sql</code> ou importe questões pelo painel do Supabase.</p>
          </>
        )}
      </div>
    );
  }

  const question = questions[currentIndex];

  const handleAnswer = () => {
    if (selectedOption !== null) {
      setShowAnswer(true);
    }
  };

  const playAudio = (textToRead: string) => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const nextQuestion = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setSelectedOption(null);
    setShowAnswer(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert('Você finalizou esta bateria de questões! Parabéns!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Banco de Questões</h2>
          <p className="text-slate-400">
            Questão {currentIndex + 1} de {questions.length} disponíveis
          </p>
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary-900/50 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {question.subject}
            </span>
            <span className="text-slate-500 text-sm">{question.theme}</span>
          </div>
          <button 
            onClick={() => playAudio(question.text + ". Alternativas: " + question.options.join(". "))}
            className={`p-2 rounded-full transition-colors ${isPlayingAudio ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
            title="Ouvir questão"
          >
            <Volume2 size={20} className={isPlayingAudio ? "animate-pulse" : ""} />
          </button>
        </div>

        <p className="text-lg text-slate-200 mb-8 leading-relaxed">
          {question.text}
        </p>

        <div className="space-y-3 mb-8">
          {question.options.map((opt, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = showAnswer && index === question.correct;
            const isWrong = showAnswer && isSelected && index !== question.correct;
            
            let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
            if (showAnswer) {
              if (isCorrect) btnClass += "bg-green-500/20 border-green-500 text-green-100";
              else if (isWrong) btnClass += "bg-red-500/20 border-red-500/50 text-red-200";
              else btnClass += "bg-slate-800/50 border-slate-700 text-slate-400 opacity-50";
            } else {
              btnClass += isSelected 
                ? "bg-primary-600/20 border-primary-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50";
            }

            return (
              <button
                key={index}
                disabled={showAnswer}
                onClick={() => setSelectedOption(index)}
                className={btnClass}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {!showAnswer ? (
          <button 
            onClick={handleAnswer}
            disabled={selectedOption === null}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              selectedOption !== null 
                ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Responder
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-white font-bold flex items-center gap-2">
                  {selectedOption === question.correct ? (
                    <span className="text-green-500">Correto! 🎉</span>
                  ) : (
                    <span className="text-red-500">Incorreto</span>
                  )}
                </h4>
                <button 
                  onClick={() => playAudio(question.explanation)}
                  className={`p-1.5 rounded-md ${isPlayingAudio ? 'bg-primary-500/20 text-primary-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                <span className="font-semibold text-slate-100">Explicação:</span> {question.explanation}
              </p>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-slate-800/50">
                <button 
                  onClick={nextQuestion}
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium text-sm px-4 py-2 bg-primary-500/10 rounded-lg hover:bg-primary-500/20"
                >
                  Próxima questão <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
