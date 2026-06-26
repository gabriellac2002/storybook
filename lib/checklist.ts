// Referência: docs/parte_diaria_v46.html linhas 800–884 — CHECKLIST_BY_KIND

export type ChecklistItemDef = {
  id: string;
  label: string;
  critical: boolean;
  icon: string;
};

const CHECKLIST_BY_KIND: Record<string, ChecklistItemDef[]> = {
  truck: [
    { id: 'freio',  label: 'Freios de Serviço',        critical: true,  icon: '🛑' },
    { id: 'pneu',   label: 'Pneus e Rodas',            critical: false, icon: '⚙️' },
    { id: 'lant',   label: 'Lanternagem',               critical: false, icon: '💡' },
    { id: 'oleo',   label: 'Nível de Óleo',            critical: false, icon: '🛢️' },
    { id: 'agua',   label: 'Nível de Água',            critical: false, icon: '💧' },
    { id: 'cinto',  label: 'Cinto de Segurança',       critical: true,  icon: '🔒' },
    { id: 'buz',    label: 'Buzina e Alarme de Ré',    critical: false, icon: '🔔' },
  ],
  loader: [
    { id: 'freio',  label: 'Freios',                   critical: true,  icon: '🛑' },
    { id: 'pneu',   label: 'Pneus e Rodas',            critical: false, icon: '⚙️' },
    { id: 'lant',   label: 'Lanternagem',               critical: false, icon: '💡' },
    { id: 'oleo',   label: 'Nível de Óleo',            critical: false, icon: '🛢️' },
    { id: 'caçamba',label: 'Estado da Caçamba',        critical: false, icon: '🪣' },
    { id: 'cinto',  label: 'Cinto de Segurança',       critical: true,  icon: '🔒' },
    { id: 'buz',    label: 'Buzina e Alarme de Ré',    critical: false, icon: '🔔' },
  ],
  excavator: [
    { id: 'freio',  label: 'Freios / Travas',          critical: true,  icon: '🛑' },
    { id: 'esteira',label: 'Esteiras',                 critical: false, icon: '⚙️' },
    { id: 'lant',   label: 'Lanternagem',               critical: false, icon: '💡' },
    { id: 'oleo',   label: 'Nível de Óleo Hidráulico', critical: false, icon: '🛢️' },
    { id: 'agua',   label: 'Nível de Água',            critical: false, icon: '💧' },
    { id: 'cinto',  label: 'Cinto de Segurança',       critical: true,  icon: '🔒' },
    { id: 'impl',   label: 'Estado do Implemento',     critical: false, icon: '🔨' },
    { id: 'buz',    label: 'Buzina e Alarme',          critical: false, icon: '🔔' },
  ],
  drill: [
    { id: 'comp',   label: 'Compressor / Pressão',     critical: true,  icon: '🌬️' },
    { id: 'hastes', label: 'Hastes de Perfuração',     critical: true,  icon: '⛏️' },
    { id: 'oleo',   label: 'Nível de Óleo',            critical: false, icon: '🛢️' },
    { id: 'agua',   label: 'Nível de Água',            critical: false, icon: '💧' },
    { id: 'cinto',  label: 'Cinto de Segurança',       critical: true,  icon: '🔒' },
    { id: 'bits',   label: 'Estado dos Bits',          critical: false, icon: '🔩' },
    { id: 'buz',    label: 'Alarme Sonoro',            critical: false, icon: '🔔' },
  ],
  grader: [
    { id: 'freio',  label: 'Freios',                   critical: true,  icon: '🛑' },
    { id: 'pneu',   label: 'Pneus',                    critical: false, icon: '⚙️' },
    { id: 'lant',   label: 'Lanternagem',               critical: false, icon: '💡' },
    { id: 'oleo',   label: 'Nível de Óleo',            critical: false, icon: '🛢️' },
    { id: 'agua',   label: 'Nível de Água',            critical: false, icon: '💧' },
    { id: 'cinto',  label: 'Cinto de Segurança',       critical: true,  icon: '🔒' },
    { id: 'lamina', label: 'Estado da Lâmina',         critical: false, icon: '🔪' },
    { id: 'buz',    label: 'Buzina e Alarme de Ré',    critical: false, icon: '🔔' },
  ],
  water: [
    { id: 'freio',  label: 'Freios',                   critical: true,  icon: '🛑' },
    { id: 'pneu',   label: 'Pneus',                    critical: false, icon: '⚙️' },
    { id: 'lant',   label: 'Lanternagem',               critical: false, icon: '💡' },
    { id: 'oleo',   label: 'Nível de Óleo',            critical: false, icon: '🛢️' },
    { id: 'tanque', label: 'Estanqueidade do Tanque',  critical: true,  icon: '💧' },
    { id: 'cinto',  label: 'Cinto de Segurança',       critical: true,  icon: '🔒' },
    { id: 'mang',   label: 'Mangueiras e Conexões',    critical: false, icon: '🔗' },
    { id: 'buz',    label: 'Buzina e Alarme de Ré',    critical: false, icon: '🔔' },
  ],
};

const CHECKLIST_DEFAULT: ChecklistItemDef[] = [
  { id: 'oleo',  label: 'Nível de Óleo',        critical: false, icon: '🛢️' },
  { id: 'agua',  label: 'Nível de Água',        critical: false, icon: '💧' },
  { id: 'cinto', label: 'Cinto de Segurança',   critical: true,  icon: '🔒' },
  { id: 'geral', label: 'Condição Geral',       critical: false, icon: '🔧' },
];

export function getChecklistItems(equipmentKind: string): ChecklistItemDef[] {
  return CHECKLIST_BY_KIND[equipmentKind] ?? CHECKLIST_DEFAULT;
}
