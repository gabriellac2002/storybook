export type Operator = {
  id: string;
  name: string;
  role: 'operator' | 'admin';
};

export type Equipment = {
  id: string;
  code: string;
  kind: string; // corresponde a IconName em PetraIcon
  capacity: number; // toneladas por viagem
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
};

export type PcpGoals = {
  slotLabel: string;
  hourGoal: number;
  dailyGoal: number;
};
