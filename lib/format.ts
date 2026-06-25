const pad = (n: number) => String(n).padStart(2, '0');

export function fmtDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}h ${pad(m)}min` : `${m}m ${pad(sec)}s`;
}

export function fmtTimeShort(ts: string): string {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
