'use client';

// Referência: docs/parte_diaria_v46.html linhas 632–748 — renderTabletLogin()

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PetraIcon } from '@/components/petra/PetraIcon';
import { useTabletStore } from '@/lib/store/tabletStore';

export type LoginViewProps = {
  className?: string;
};

export const LoginView: React.FC<LoginViewProps> = ({ className }) => {
  const equipment = useTabletStore(s => s.equipment);
  const session   = useTabletStore(s => s.session);
  const login     = useTabletStore(s => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = login(username.trim(), password);
    setLoading(false);
    if (result === 'invalid')      setError('Usuário ou senha incorretos.');
    else if (result === 'no-equipment') setError('Tablet não vinculado. Solicite ao administrador.');
    else setError(null);
  };

  const isBound = !!session.boundEquipmentId;

  return (
    <div className={cn(
      'relative flex min-h-screen items-center justify-center overflow-hidden bg-tablet-bg p-6',
      className
    )}>
      {/* gradiente decorativo de fundo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(4,63,137,0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(244,199,24,0.15), transparent 50%)',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-petra-blue shadow-2xl shadow-petra-blue/40">
            <PetraIcon name="rock" size={40} className="text-petra-yellow" />
          </div>
          <p className="hairline mb-2 text-sm text-petra-yellow">Sistema Operacional</p>
          <h1 className="font-display text-3xl font-black text-white">Parte Diária Digital</h1>

          {/* chip de equipamento vinculado */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-xl border px-4 py-3"
            style={isBound
              ? { borderColor: 'rgba(4,63,137,0.4)', background: 'rgba(4,63,137,0.15)' }
              : { borderColor: 'rgba(244,199,24,0.3)', background: 'rgba(244,199,24,0.08)' }}>
            {isBound && equipment ? (
              <>
                <PetraIcon name={equipment.kind as any} size={28} className="shrink-0 text-petra-yellow" />
                <div className="text-left">
                  <div className="hairline text-xs text-tablet-text-dim">Equipamento Vinculado</div>
                  <div className="text-base font-bold text-white">
                    {equipment.code} — {equipment.name}
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl" aria-hidden>⚠️</span>
                <div className="text-left">
                  <div className="text-sm font-semibold text-op-amber">Tablet sem equipamento</div>
                  <div className="text-xs text-tablet-text-dim">Login admin → Vincular Equipamento</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-tablet-border bg-tablet-surface p-6 shadow-2xl"
        >
          <div className="space-y-2">
            <Label htmlFor="tlogin-user" className="hairline text-sm text-tablet-text-dim">
              Usuário
            </Label>
            <Input
              id="tlogin-user"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="operador"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="h-auto border-2 border-tablet-border bg-tablet-bg px-4 py-4 font-mono text-xl text-white focus:border-petra-blue-light"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tlogin-pass" className="hairline text-sm text-tablet-text-dim">
              Senha
            </Label>
            <Input
              id="tlogin-pass"
              type="password"
              autoComplete="current-password"
              placeholder="••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-auto border-2 border-tablet-border bg-tablet-bg px-4 py-4 font-mono text-xl text-white focus:border-petra-blue-light"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-op-red/30 bg-op-red/10 px-4 py-3 text-base font-black text-op-red"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-petra-blue text-xl font-black uppercase tracking-wider text-white shadow-lg shadow-petra-blue/30 hover:bg-petra-blue-light active:scale-[0.98]"
          >
            <PetraIcon name="unlock" size={22} />
            Entrar
          </Button>
        </form>

        {/* Credenciais demo */}
        <div className="mt-6 rounded-lg border border-tablet-border bg-tablet-surface/50 p-3 text-center text-xs text-tablet-text-dim">
          <span className="hairline text-petra-yellow">Credenciais Demo: </span>
          <span className="font-mono">admin/admin · operador/123</span>
        </div>
      </div>
    </div>
  );
};
