export type TabletPhase = 'login' | 'equipment' | 'checklist' | 'horimeter' | 'operational';

export type Operator = {
  id: string;
  name: string;
  role: 'operator' | 'admin';
};

export type Equipment = {
  id: string;
  code: string;
  name: string;
  category: string;
  kind: string; // corresponde a IconName em PetraIcon
  capacity?: number; // toneladas/m³ por viagem
  lastHorimeter?: number;
  lastHorimeters?: Record<string, number>;
};

export type TripEvent = {
  id: string;
  type: 'trip';
  subtype: 'productive' | 'sterile';
  ts: string;
  tons: number;
  equipment: string;
  operator: string;
};

export type StopEvent = {
  id: string;
  type: 'stop';
  startTs: string;
  endTs: string;
  duration: number; // ms
  equipment: string;
  operator: string;
};

export type TabletEvent = TripEvent | StopEvent;

export type ActiveStop = { startTs: string };

export type TabletSession = {
  boundEquipmentId: string | null;
  operator: Operator | null;
  shiftStart: string | null;
  horimeterLabel: string;
  activeStop: ActiveStop | null;
  truckMode: 'producao' | 'demais' | null;
  // fluxo pré-operação
  adminNeedsBinding: boolean;
  checklistDone: boolean;
  initialHorimeter: number | null;
  initialHorimeters: Record<string, number> | null;
};

export type PcpGoals = {
  slotLabel: string;
  hourGoal: number;
  dailyGoal: number;
};
