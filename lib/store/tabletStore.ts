import { create } from 'zustand';
import {
  Equipment,
  Operator,
  TabletEvent,
  TabletPhase,
  TabletSession,
  TripEvent,
  StopEvent,
  ActiveStop,
  PcpGoals,
} from './tabletTypes';
import { findOperator } from '@/lib/data/operators';
import { findEquipment as findEquipmentRecord } from '@/lib/data/equipments';

// ── Re-export para conveniência dos consumidores ──────────────────────────────
export type { Equipment, Operator, TabletEvent, TabletSession, TripEvent, StopEvent, ActiveStop, PcpGoals, TabletPhase };

// ── Store ─────────────────────────────────────────────────────────────────────

type TabletStore = {
  session: TabletSession;
  equipment: Equipment | null;
  events: TabletEvent[];
  slotLabel: string;
  hourGoal: number;
  dailyGoal: number;

  // fluxo de autenticação
  login: (username: string, password: string) => 'ok' | 'invalid' | 'no-equipment';
  bindEquipment: (id: string) => void;
  completeChecklist: () => void;
  completeHorimeter: (values: Record<string, number>) => void;

  // operação
  registerTrip: (subtype: 'productive' | 'sterile') => void;
  cancelLastTrip: () => void;
  startStop: () => void;
  endStop: () => void;
  endShift: () => void;
  logout: () => void;
  setTruckMode: (mode: 'producao' | 'demais') => void;

  // seed (demo / storybook)
  seed: (
    equipment: Equipment,
    session: Partial<TabletSession>,
    goals: PcpGoals,
    initialEvents?: TabletEvent[]
  ) => void;
};

const DEFAULT_SESSION: TabletSession = {
  boundEquipmentId: null,
  operator: null,
  shiftStart: null,
  horimeterLabel: '—',
  activeStop: null,
  truckMode: null,
  adminNeedsBinding: false,
  checklistDone: false,
  initialHorimeter: null,
  initialHorimeters: null,
};

export const useTabletStore = create<TabletStore>((set, get) => ({
  session: DEFAULT_SESSION,
  equipment: null,
  events: [],
  slotLabel: '—',
  hourGoal: 0,
  dailyGoal: 0,

  // ── Fluxo de autenticação ──────────────────────────────────────────────────

  login: (username, password) => {
    const op = findOperator(username, password);
    if (!op) return 'invalid';

    const { session } = get();

    // Admin sem equipamento vinculado → tela de vinculação
    if (!session.boundEquipmentId) {
      if (op.role !== 'admin') return 'no-equipment';
      set(s => ({
        session: { ...s.session, operator: { id: op.id, name: op.name, role: op.role }, adminNeedsBinding: true },
      }));
      return 'ok';
    }

    // Operador logado com equipamento vinculado → inicia turno
    set(s => ({
      session: {
        ...s.session,
        operator: { id: op.id, name: op.name, role: op.role },
        shiftStart: new Date().toISOString(),
        checklistDone: false,
        initialHorimeter: null,
        initialHorimeters: null,
        activeStop: null,
        adminNeedsBinding: false,
      },
      events: [],
    }));
    return 'ok';
  },

  bindEquipment: (id) => {
    const record = findEquipmentRecord(id);
    if (!record) return;
    set(s => ({
      equipment: {
        id: record.id,
        code: record.code,
        name: record.name,
        category: record.category,
        kind: record.kind,
        capacity: record.capacity,
        lastHorimeter: record.lastHorimeter,
        lastHorimeters: record.lastHorimeters,
      },
      session: {
        ...DEFAULT_SESSION,
        boundEquipmentId: id,
      },
      events: [],
    }));
  },

  completeChecklist: () =>
    set(s => ({ session: { ...s.session, checklistDone: true } })),

  completeHorimeter: (values) => {
    const keys = Object.keys(values);
    const isMulti = keys.length > 1;
    const label = isMulti
      ? 'Múltiplos horímetros'
      : `${Object.values(values)[0].toFixed(1)}h`;
    set(s => ({
      session: {
        ...s.session,
        initialHorimeter: isMulti ? null : (Object.values(values)[0] ?? null),
        initialHorimeters: isMulti ? values : null,
        horimeterLabel: label,
      },
    }));
  },

  // ── Operação ───────────────────────────────────────────────────────────────

  seed: (equipment, session, goals, initialEvents = []) =>
    set({
      equipment,
      session: { ...DEFAULT_SESSION, ...session },
      slotLabel: goals.slotLabel,
      hourGoal: goals.hourGoal,
      dailyGoal: goals.dailyGoal,
      events: initialEvents,
    }),

  registerTrip: (subtype) => {
    const { session, equipment } = get();
    if (!session.operator || !equipment) return;
    const event: TripEvent = {
      id: crypto.randomUUID(),
      type: 'trip',
      subtype,
      ts: new Date().toISOString(),
      tons: equipment.capacity ?? 0,
      equipment: equipment.id,
      operator: session.operator.name,
    };
    set(state => ({ events: [event, ...state.events] }));
  },

  cancelLastTrip: () =>
    set(state => {
      const idx = state.events.findIndex(e => e.type === 'trip');
      if (idx === -1) return state;
      const events = [...state.events];
      events.splice(idx, 1);
      return { events };
    }),

  // TODO: substituir por openModal('parada') quando modais estiverem implementados
  startStop: () =>
    set(state => ({
      session: { ...state.session, activeStop: { startTs: new Date().toISOString() } },
    })),

  endStop: () => {
    const { session, equipment } = get();
    if (!session.activeStop || !session.operator || !equipment) return;
    const endTs = new Date().toISOString();
    const duration =
      new Date(endTs).getTime() - new Date(session.activeStop.startTs).getTime();
    const event: StopEvent = {
      id: crypto.randomUUID(),
      type: 'stop',
      startTs: session.activeStop.startTs,
      endTs,
      duration,
      equipment: equipment.id,
      operator: session.operator.name,
    };
    set(state => ({
      events: [event, ...state.events],
      session: { ...state.session, activeStop: null },
    }));
  },

  endShift: () =>
    set(s => ({
      session: { ...DEFAULT_SESSION, boundEquipmentId: s.session.boundEquipmentId },
      events: [],
    })),

  logout: () =>
    set(s => ({
      session: { ...DEFAULT_SESSION, boundEquipmentId: s.session.boundEquipmentId },
      events: [],
    })),

  setTruckMode: (mode) =>
    set(state => ({ session: { ...state.session, truckMode: mode } })),
}));

// ── Selectors ─────────────────────────────────────────────────────────────────
// Seletores que retornam array NÃO devem ser passados diretamente para useTabletStore:
// filter() cria nova referência a cada chamada → Zustand detecta mudança → loop infinito.
// Use inline: useTabletStore(s => selectX(s).length) ou useShallow(selectX).

export const selectTabletPhase = (s: TabletStore): TabletPhase => {
  const { session } = s;
  if (session.adminNeedsBinding) return 'equipment';
  if (!session.boundEquipmentId || !session.operator) return 'login';
  if (!session.checklistDone) return 'checklist';
  if (session.initialHorimeter == null && session.initialHorimeters == null) return 'horimeter';
  return 'operational';
};

export const selectTripEvents = (s: TabletStore): TripEvent[] =>
  s.events.filter((e): e is TripEvent => e.type === 'trip');

export const selectProductiveTrips = (s: TabletStore): TripEvent[] =>
  selectTripEvents(s).filter(t => t.subtype === 'productive');

export const selectSterileTrips = (s: TabletStore): TripEvent[] =>
  selectTripEvents(s).filter(t => t.subtype === 'sterile');

export const selectTotalTons = (s: TabletStore): number =>
  selectProductiveTrips(s).reduce((a, t) => a + t.tons, 0);

export const selectStopEvents = (s: TabletStore): StopEvent[] =>
  s.events.filter((e): e is StopEvent => e.type === 'stop');

export const selectStopDurationMs = (s: TabletStore): number =>
  selectStopEvents(s).reduce((a, e) => a + e.duration, 0);

export const selectLastTrip = (s: TabletStore): TripEvent | null =>
  selectTripEvents(s)[0] ?? null;

export const selectHourTrips = (s: TabletStore): number => {
  const now = new Date();
  const slotStart = new Date(now);
  slotStart.setMinutes(0, 0, 0);
  const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
  return selectProductiveTrips(s).filter(
    t => new Date(t.ts) >= slotStart && new Date(t.ts) < slotEnd
  ).length;
};
