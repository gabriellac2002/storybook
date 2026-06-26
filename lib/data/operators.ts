// Referência: docs/parte_diaria_v46.html linha ~5981 — operators[]
// Dado estático de demo. Produção: substituir por chamada de API.

export type OperatorRecord = {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'operator' | 'admin';
};

export const OPERATORS: OperatorRecord[] = [
  { id: 'u1', username: 'admin',     password: 'admin', name: 'João Silva',      role: 'admin'    },
  { id: 'u2', username: 'operador',  password: '123',   name: 'Carlos Pereira',  role: 'operator' },
  { id: 'u3', username: 'operador2', password: '123',   name: 'Roberto Santos',  role: 'operator' },
  { id: 'u4', username: 'operador3', password: '123',   name: 'Marcos Oliveira', role: 'operator' },
  { id: 'u5', username: 'operador4', password: '123',   name: 'Pedro Almeida',  role: 'operator' },
];

// Demo: senha é opcional — qualquer username válido entra mesmo sem senha
export function findOperator(username: string, password: string, requireAdmin = false): OperatorRecord | null {
  const u = username.trim().toLowerCase();
  const match = OPERATORS.find(o => {
    const usernameMatch = o.username.toLowerCase() === u;
    const roleOk = requireAdmin ? o.role === 'admin' : true;
    return usernameMatch && roleOk;
  });
  return match ?? null;
}
