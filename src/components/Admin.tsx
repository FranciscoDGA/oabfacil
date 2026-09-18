import { useState } from 'react';
import { Upload, Database, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Papa from 'papaparse';

export function Admin() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ total: number; done: number } | null>(null);

  const processData = async (data: any[]) => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    setProgress({ total: data.length, done: 0 });

    try {
      // Format data to match our DB schema
      const formattedQuestions = data.map((item: any) => {
        let options = [];
        try {
          if (typeof item.options === 'string') {
            options = JSON.parse(item.options);
          } else if (Array.isArray(item.options)) {
            options = item.options;
          } else {
            // Se veio do CSV com colunas opcao_a, opcao_b, etc
            options = [item.opcao_a, item.opcao_b, item.opcao_c, item.opcao_d].filter(Boolean);
          }
        } catch (e) {
          options = [item.opcao_a, item.opcao_b, item.opcao_c, item.opcao_d].filter(Boolean);
        }

        return {
          subject: item.subject || item.disciplina || 'Geral',
          theme: item.theme || item.tema || 'Geral',
          text: item.text || item.enunciado || item.texto,
          options: options.length > 0 ? options : ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
          correct: parseInt(item.correct || item.correta || 0),
          explanation: item.explanation || item.explicacao || 'Sem explicação.'
        };
      }).filter(q => q.text);

      if (formattedQuestions.length === 0) {
        throw new Error('Nenhuma questão válida encontrada no arquivo.');
      }

      // Inserir em lotes (batch) de 100 para não estourar limite da API
      const BATCH_SIZE = 100;
      let insertedCount = 0;

      for (let i = 0; i < formattedQuestions.length; i += BATCH_SIZE) {
        const batch = formattedQuestions.slice(i, i + BATCH_SIZE);
        const { error: insertError } = await supabase
          .from('questions')
          .insert(batch);
        
        if (insertError) throw insertError;
        insertedCount += batch.length;
        setProgress({ total: formattedQuestions.length, done: insertedCount });
      }

      setSuccess(`✅ ${insertedCount} questões importadas com sucesso!`);
      setProgress(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro desconhecido ao importar.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const data = Array.isArray(json) ? json : json.questions || [];
          await processData(data);
        } catch (err) {
          setError('Arquivo JSON inválido.');
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          await processData(results.data);
        },
        error: (err) => {
          setError(`Erro ao ler CSV: ${err.message}`);
          setLoading(false);
        }
      });
    } else {
      setError('Formato não suportado. Use .csv ou .json');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Database className="text-primary-500" />
          Administração do Sistema
        </h2>
        <p className="text-slate-400">
          Gerencie o banco de dados do OAB Fácil. Importe milhares de questões de uma vez.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Importar Questões</h3>
          <p className="text-sm text-slate-400 mb-6">
            Faça upload de um arquivo <b>.csv</b> ou <b>.json</b> para popular o banco de dados.
          </p>

          <label className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            loading ? 'border-slate-600 bg-slate-800/50 cursor-not-allowed' : 'border-primary-500/50 hover:bg-primary-500/10 hover:border-primary-500 bg-slate-900/50'
          }`}>
            <Upload className={`w-10 h-10 mb-3 ${loading ? 'text-slate-500' : 'text-primary-500'}`} />
            <span className="text-sm font-medium text-slate-300">
              {loading ? 'Processando arquivo...' : 'Clique para selecionar arquivo'}
            </span>
            <input 
              type="file" 
              accept=".json,.csv" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>

          {progress && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Importando...</span>
                <span>{progress.done} / {progress.total}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.max(5, (progress.done / progress.total) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Como formatar o arquivo?</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <h4 className="text-sm font-bold text-slate-200 mb-2">Formato JSON esperado:</h4>
              <pre className="text-xs text-slate-400 overflow-x-auto">
{`[
  {
    "disciplina": "Direito Penal",
    "tema": "Homicídio",
    "enunciado": "Texto da questão...",
    "options": ["A) Errada", "B) Certa", "C) Errada", "D) Errada"],
    "correta": 1,
    "explicacao": "A letra B está certa porque..."
  }
]`}
              </pre>
            </div>
            
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <h4 className="text-sm font-bold text-slate-200 mb-2">Colunas do CSV esperadas:</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                <code className="text-primary-400">disciplina</code>, <code className="text-primary-400">tema</code>, <code className="text-primary-400">enunciado</code>, <code className="text-primary-400">opcao_a</code>, <code className="text-primary-400">opcao_b</code>, <code className="text-primary-400">opcao_c</code>, <code className="text-primary-400">opcao_d</code>, <code className="text-primary-400">correta</code> (0 a 3), <code className="text-primary-400">explicacao</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
