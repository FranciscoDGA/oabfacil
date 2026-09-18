import { useState } from 'react';
import { Filter, ChevronRight } from 'lucide-react';

const mockQuestions = [
  {
    id: 1,
    subject: 'Direito Penal',
    theme: 'Crimes contra o patrimônio',
    text: 'Caio, com intenção de subtrair para si coisa alheia móvel, aborda Tício na rua e, simulando portar arma de fogo, exige que este lhe entregue o celular. Tício, assustado, entrega o bem. Caio foge, mas é capturado pela polícia dois quarteirões depois. Qual é o crime cometido por Caio?',
    options: [
      'a) Furto simples.',
      'b) Furto qualificado pelo emprego de fraude.',
      'c) Roubo circunstanciado pelo emprego de arma de fogo.',
      'd) Roubo simples.',
    ],
    correct: 3, // index 3 = d
    explanation: 'A simulação de porte de arma caracteriza a grave ameaça inerente ao crime de roubo simples (art. 157, caput, CP). Não incide a majorante de arma de fogo pois a arma era apenas simulada.'
  }
];

export function QuestionBank() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const question = mockQuestions[0];

  const handleAnswer = () => {
    if (selectedOption !== null) {
      setShowAnswer(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Banco de Questões</h2>
          <p className="text-slate-400">Pratique com questões reais da FGV.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl border border-slate-700 transition-colors">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-primary-900/50 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            {question.subject}
          </span>
          <span className="text-slate-500 text-sm">{question.theme}</span>
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
          <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl animate-in fade-in zoom-in-95 duration-300">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              {selectedOption === question.correct ? (
                <span className="text-green-500">Correto! 🎉</span>
              ) : (
                <span className="text-red-500">Incorreto</span>
              )}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="font-semibold text-slate-100">Explicação:</span> {question.explanation}
            </p>
            <button 
              onClick={() => {
                setSelectedOption(null);
                setShowAnswer(false);
              }}
              className="mt-6 flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium text-sm"
            >
              Próxima questão <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
