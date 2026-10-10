import { useState } from 'react';
import { Timer, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

export function ExamSimulator() {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  // Mock data para o simulado
  const totalQuestions = 80;
  const [answeredCount, setAnsweredCount] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const startExam = () => setExamStarted(true);
  const finishExam = () => {
    setExamStarted(false);
    setExamFinished(true);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAnswer = (idx: number) => {
    if (!answers[currentQuestion]) {
      setAnsweredCount(prev => prev + 1);
    }
    setAnswers(prev => ({ ...prev, [currentQuestion]: idx }));
  };

  if (examFinished) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Simulado Concluído!</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Você concluiu este roteiro de treino. Esta versão ainda é um simulacro: as questões oficiais e o cálculo real de nota ainda não estão conectados.
          </p>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Pontuação</p>
              <p className="text-3xl font-bold text-white">—</p>
              <p className="text-xs text-slate-500 mt-2">Sem correção oficial nesta versão</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Tempo Total</p>
              <p className="text-3xl font-bold text-white">3h 45m</p>
              <p className="text-xs text-slate-500 mt-2">Dentro do limite de 5h</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Pior Disciplina</p>
              <p className="text-xl font-bold text-red-400 mt-2">Dir. Tributário</p>
              <p className="text-xs text-slate-500 mt-2">2 acertos de 5</p>
            </div>
          </div>

          <button onClick={() => { setExamFinished(false); setCurrentQuestion(1); setAnsweredCount(0); setAnswers({}); }} className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-bold transition-colors">
            Voltar aos Simulados
          </button>
        </div>
      </div>
    );
  }

  if (examStarted) {
    return (
      <div className="max-w-5xl mx-auto flex gap-8 animate-in fade-in duration-300">
        {/* Painel da Questão */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between bg-slate-800 border border-slate-700 p-4 rounded-2xl">
            <span className="text-primary-400 font-bold bg-primary-500/10 px-3 py-1 rounded-lg">Questão {currentQuestion} de {totalQuestions}</span>
            <div className="flex items-center gap-2 text-slate-300 font-mono bg-slate-900 px-4 py-2 rounded-lg">
              <Timer size={18} className="text-orange-400" />
              04:59:45
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="mb-6 flex gap-2">
              <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold uppercase">Direito Civil</span>
            </div>
            <p className="text-lg text-slate-200 mb-8 leading-relaxed">
              [Questão {currentQuestion}] João, dirigindo seu veículo particular com excesso de velocidade, colide com o muro da casa de Maria, causando graves danos estruturais. Maria procura você, como advogado(a), para ajuizar ação indenizatória. Sobre a responsabilidade civil no caso, assinale a afirmativa correta:
            </p>

            <div className="space-y-3">
              {["A) João responde objetivamente pelos danos.", "B) A responsabilidade de João depende da comprovação de dolo.", "C) João responde subjetivamente, devendo ser provada sua culpa.", "D) Não há responsabilidade se João for menor de 21 anos."].map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(idx)} 
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${answers[currentQuestion] === idx ? 'bg-primary-600/20 border-primary-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button 
                onClick={handlePrev}
                disabled={currentQuestion === 1}
                className={`px-4 py-2 font-medium transition-colors ${currentQuestion === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Anterior
              </button>
              {currentQuestion < totalQuestions ? (
                <button 
                  onClick={handleNext}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  Próxima <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={finishExam}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                >
                  Finalizar <CheckCircle2 size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cartão Resposta Lateral */}
        <div className="w-72 shrink-0">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sticky top-8">
            <h3 className="font-bold text-white mb-4">Cartão Resposta</h3>
            <div className="grid grid-cols-5 gap-2 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {Array.from({ length: totalQuestions }).map((_, idx) => {
                const qNum = idx + 1;
                const isAnswered = answers[qNum] !== undefined;
                const isCurrent = currentQuestion === qNum;
                
                return (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentQuestion(qNum)}
                    className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-colors ${isCurrent ? 'ring-2 ring-white scale-110' : ''} ${isAnswered ? 'bg-primary-600 text-white border-primary-500' : 'bg-slate-900 border border-slate-700 text-slate-500 hover:border-slate-500'}`}
                  >
                    {qNum}
                  </button>
                );
              })}
            </div>
            <div className="pt-4 border-t border-slate-700 space-y-4">
              <div className="text-sm text-slate-400 flex justify-between">
                <span>Respondidas:</span>
                <span className="text-white font-bold">{answeredCount}/{totalQuestions}</span>
              </div>
              <button onClick={finishExam} className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 py-3 rounded-xl font-bold transition-all">
                Entregar Prova
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Simulados da 1ª Fase</h2>
        <p className="text-slate-400">Treine resistência, gerencie seu tempo e mapeie seus pontos fracos.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 hover:border-primary-500/50 transition-colors">
          <div className="w-14 h-14 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mb-6">
            <Timer size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Simulado Completo FGV</h3>
          <p className="text-slate-400 mb-6">Prova realística com 80 questões e tempo cronometrado de 5 horas. Ideal para domingos.</p>
          <ul className="space-y-2 mb-8 text-sm text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary-500" /> 80 questões inéditas</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary-500" /> 5 horas de duração</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary-500" /> Relatório de desempenho no final</li>
          </ul>
          <button onClick={startExam} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-colors">
            Iniciar Simulado
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle size={12} /> Pegadinha FGV
          </div>
          <h3 className="text-xl font-bold text-white mb-4 mt-6">Atenção ao Padrão!</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Dica de estudo para Crimes contra a Administração Pública (Peculato, Corrupção): revise os tipos legais e as elementares de posse e finalidade.
          </p>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Dica Rápida</p>
            <p className="text-sm text-slate-300">Peculato exige a posse do bem em razão do cargo. Se ele não tem a posse e subtrai, é furto!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
