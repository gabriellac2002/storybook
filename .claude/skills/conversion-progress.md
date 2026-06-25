# Skill: conversion-progress

Mostra o status atual da conversão HTML → React: o que já foi extraído, o que está em andamento e o que ainda falta.

## Como invocar

```
/conversion-progress
```

Sem argumentos. Roda na raiz do projeto.

---

## O que este skill faz

1. Escaneia `docs/parte_diaria_v46.html` pelos comentários `[EXTRACTED: ...]`
2. Lista todos os componentes criados em `src/components/`
3. Mostra as stories em `stories/`
4. Gera um relatório de progresso com % de cobertura estimada

---

## Como marcar um trecho como convertido no HTML

Após extrair um componente, adicionar este comentário **logo antes** do trecho original:

```html
<!-- [EXTRACTED: ComponentName]
     Componente: src/components/<feature>/ComponentName.tsx
     Story: stories/<feature>/ComponentName.stories.tsx
     Data: YYYY-MM-DD
-->
```

Para checar via terminal:
```bash
grep -n "EXTRACTED" docs/parte_diaria_v46.html
```

---

## Formato de saída esperado

```markdown
## Progresso da conversão — Petra Agregados

### Componentes extraídos (5)

| Componente | Feature | Story | Data |
|---|---|---|---|
| `PetraIcon` | petra | ✅ | 2026-06-25 |
| `StatusDot` | petra | ✅ | 2026-06-25 |
| `TabletButton` | tablet | ✅ | 2026-06-25 |
| `KpiCard` | management | ✅ | 2026-06-25 |
| `StopModal` | modals | ⏳ story pendente | 2026-06-25 |

### Telas mapeadas mas não extraídas

- `renderTabletOperationalTruck` → ver /map-components renderTabletOperationalTruck
- `renderMgmtDashboard` (parcial — KpiCard extraído, restante pendente)

### Telas não iniciadas

- renderTabletLogin
- renderTabletChecklist
- renderTabletHorimeter
- renderTabletOperationalLoader
- ... (lista completa em docs/ARQUITETURA.md seção 7.2)

### Próximo passo sugerido

\`/map-components renderTabletOperationalTruck\`
```

---

## Referência das telas por prioridade

Com base na frequência de uso e complexidade (extrair na ordem sugerida):

### Alta prioridade (usadas em todos os turnos)
1. Tela operacional do caminhão (`renderTabletOperationalTruck`) — tipo mais comum
2. KPIs do dashboard gerencial (`renderMgmtDashboard`) — gestão diária
3. Modal de parada (`renderModal` → tipo `parada`) — muito frequente

### Média prioridade  
4. Tela de login do tablet (`renderTabletLogin`)
5. Checklist NR-12 (`renderTabletChecklist`)
6. Tela da carregadeira (`renderTabletOperationalLoader`)

### Baixa prioridade (menos frequente)
7. PCP (`renderMgmtPCP`)
8. Estoque (`renderMgmtStock`)
9. Perfuratriz, britagem, rebritagem
