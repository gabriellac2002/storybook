// Referência: docs/parte_diaria_v46.html linha ~5990 — equipments[]
// Dado estático. kind mapeado para IconName de PetraIcon.

export type EquipmentRecord = {
  id: string;
  code: string;
  name: string;
  kind: string; // IconName
  category: string;
  capacity?: number; // t por viagem (caminhões) ou m³ (carregadeiras)
  lastHorimeter?: number; // equipamentos de horímetro único
  lastHorimeters?: Record<string, number>; // rebritagem (múltiplos)
};

export const EQUIPMENTS: EquipmentRecord[] = [
  // Caminhões de Produção
  { id: 'UT-08', code: 'UT-08', kind: 'truck', name: 'Mercedes-Benz Axor 4144',   category: 'Caminhões de Produção', capacity: 25.4, lastHorimeter: 8420.5  },
  { id: 'UT-09', code: 'UT-09', kind: 'truck', name: 'Mercedes-Benz Actros 4844', category: 'Caminhões de Produção', capacity: 33,   lastHorimeter: 11247.5 },
  { id: 'UT-10', code: 'UT-10', kind: 'truck', name: 'Mercedes-Benz Actros 4844', category: 'Caminhões de Produção', capacity: 33,   lastHorimeter: 9821.0  },
  // Carregadeiras
  { id: 'UC-06', code: 'UC-06', kind: 'loader', name: 'Volvo L120E', category: 'Carregadeiras', capacity: 5, lastHorimeter: 22100.0 },
  { id: 'UC-07', code: 'UC-07', kind: 'loader', name: 'Volvo L120F', category: 'Carregadeiras', capacity: 5, lastHorimeter: 19850.7 },
  { id: 'UC-08', code: 'UC-08', kind: 'loader', name: 'Volvo L120F', category: 'Carregadeiras', capacity: 5, lastHorimeter: 17430.2 },
  // Escavadeiras
  { id: 'UC-11', code: 'UC-11', kind: 'excavator', name: 'Volvo EC460B', category: 'Escavadeiras', lastHorimeter: 11320.4 },
  { id: 'UC-13', code: 'UC-13', kind: 'excavator', name: 'Volvo EC460B', category: 'Escavadeiras', lastHorimeter: 9876.1  },
  // Motoniveladoras
  { id: 'MN-01', code: 'MN-01', kind: 'grader', name: 'CAT 140M', category: 'Motoniveladoras', lastHorimeter: 5240.5 },
  // Perfuratrizes
  { id: 'UP-05', code: 'UP-05', kind: 'drill', name: 'Wolf Pneumática',  category: 'Perfuração', lastHorimeter: 3421.8 },
  { id: 'UP-09', code: 'UP-09', kind: 'drill', name: 'Wolf Hidráulica',  category: 'Perfuração', lastHorimeter: 5102.3 },
  // Serviço
  { id: 'US-07', code: 'US-07', kind: 'water', name: 'Caminhão Pipa', category: 'Serviço', capacity: 15000, lastHorimeter: 8770.0 },
  // Britagem
  { id: 'UB-02', code: 'UB-02', kind: 'crusher', name: 'Britador Primário',    category: 'Britagem', lastHorimeters: { alimentador: 18200.0, britador: 18190.5 } },
  { id: 'URB-01', code: 'URB-01', kind: 'rebritagem', name: 'Linha de Rebritagem', category: 'Britagem', lastHorimeters: { alimSec: 8200, britSec: 8195, alimTer: 7800, britTer: 7790, alimQua: 6500, britQua: 6490, peneira1: 8100, peneira2: 8050, peneira3: 7900 } },
];

export function findEquipment(id: string): EquipmentRecord | null {
  return EQUIPMENTS.find(e => e.id === id) ?? null;
}

export const EQUIPMENT_CATEGORIES = [...new Set(EQUIPMENTS.map(e => e.category))];

export function groupedEquipments(): Record<string, EquipmentRecord[]> {
  return EQUIPMENTS.reduce<Record<string, EquipmentRecord[]>>((acc, eq) => {
    (acc[eq.category] ??= []).push(eq);
    return acc;
  }, {});
}
