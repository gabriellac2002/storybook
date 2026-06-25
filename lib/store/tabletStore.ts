import { create } from 'zustand';
import {
  Equipment,
  Operator,
  TabletEvent,
  TabletSession,
  TripEvent,
  StopEvent,
  ActiveStop,
  PcpGoals,
} from './tabletTypes';

// ── Re-export para conveniência dos consumidores ──────────────────────────────
export type { Equipment, Operator, TabletEvent, TabletSession, TripEvent, StopEvent, ActiveStop, PcpGoals };

// ── Store ─────────────────────────────────────────────────────────────────────

type TabletStore = {
  session: TabletSession;
  equipment: Equipment | null;
  events: TabletEvent[];
  slotLabel: string;
  hourGoal: number;
  dailyGoal: number;

  seed: (
    equipment: Equipment,
    session: Partial<TabletSession>,
    goals: PcpGoals,
    initialEvents?: TabletEvent[]
  ) => void;

  registerTrip: (subtype: 'productive' | 'sterile') => void;
  cancelLastTrip: () => void;
  startStop: () => void;
  endStop: () => void;
  endShift: () => void;
  logout: () => void;
  setTruckMode: (mode: 'producao' | 'demais') => void;
};

const DEFAULT_SESSION: TabletSession = {
  boundEquipmentId: null,
  operator: null,
  shiftStart: null,
  horimeterLabel: '—',
  activeStop: null,
  truckMode: null,
};

export const useTabletStore = create<TabletStore>((set, get) => ({
  session: DEFAULT_SESSION,
  equipment: null,
  events: [],
  slotLabel: '—',
  hourGoal: 0,
  dailyGoal: 0,

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
      tons: equipment.capacity,
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

  endShift: () => set({ session: DEFAULT_SESSION, events: [] }),

  logout: () =>
    set(state => ({
      session: {
        ...DEFAULT_SESSION,
        boundEquipmentId: state.session.boundEquipmentId,
      },
      events: [],
    })),

  setTruckMode: (mode) =>
    set(state => ({ session: { ...state.session, truckMode: mode } })),
}));

// ── Selectors ─────────────────────────────────────────────────────────────────

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
