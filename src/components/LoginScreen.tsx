import { useState, type FormEvent } from 'react';
import { Trophy, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sendMagicLink } from '../lib/auth';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStatus('error');
      setErrorMsg('Digite um e-mail válido.');
      return;
    }
    setStatus('sending');
    const { error } = await sendMagicLink(email);
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('sent');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Trophy size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">OAB Fácil</h1>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">Entrar</h2>
          <p className="text-slate-400 text-sm mb-6">
            Use seu e-mail para receber um link de acesso. Sem senha.
          </p>

          {status === 'sent' ? (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-start gap-3 text-green-400 text-sm">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span>Link enviado para <b className="text-green-300">{email}</b>. Confira a caixa de entrada (e o spam) e clique no link para entrar.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={status === 'sending'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-primary-500 disabled:opacity-50"
                />
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  status === 'sending'
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
                }`}
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Enviando...
                  </>
                ) : (
                  'Enviar link de acesso'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-slate-600 text-center mt-6">
          Uso pessoal. Suas respostas e tentativas ficam protegidas e visíveis apenas para a sua conta.
        </p>
      </div>
    </div>
  );
}
