# Skill: map-components

Lê uma tela ou trecho do `docs/parte_diaria_v46.html` e propõe a divisão em componentes React, indicando onde cada um vai, qual base shadcn usar e a ordem de extração.

## Como invocar

```
/map-components <nome-da-função ou linhas>
```

Exemplos:
```
/map-components renderMgmtDashboard
/map-components renderTabletOperationalTruck
/map-components linhas 576-608
```

---

## O que este skill faz

1. Lê o trecho indicado em `docs/parte_diaria_v46.html`
2. Identifica blocos com responsabilidade única
3. Para cada componente, define:
   - Nome (PascalCase)
   - Pasta de destino (ver estrutura abaixo)
   - Props interface resumida
   - Base shadcn recomendada
   - Complexidade: S / M / L
   - Linha aproximada no HTML

---

## Estrutura de pastas por feature

```
src/
  components/
    petra/        # Primitivos do design system — usados em todo o projeto
    tablet/       # UI do operador (tela de campo, cabine, tablet)
    management/   # UI do gestor (painel gerencial, dashboard, cadastros)
    modals/       # Os ~30 tipos de modal (um componente por tipo)
  lib/
    utils.ts      # cn() do shadcn
  hooks/          # hooks compartilhados (futuro)
```

### Critério de pasta

| Tela de origem | Pasta |
|---|---|
| renderTablet*, renderTabletOperational* | `tablet/` |
| renderMgmt* | `management/` |
| renderModal* | `modals/` |
| Usado em 2+ contextos (ícone, dot, chip) | `petra/` |

---

## Critérios de fronteira

**Extrair como componente** quando:
- Reaparece em mais de um lugar (reutilizável)
- Tem props claramente identificáveis
- Tem estado interno isolado
- É uma unidade semântica completa (card, botão, lista, modal)

**Deixar inline** quando:
- É layout puro (um `div` de espaçamento)
- Aparece uma única vez, sem variação
- Menos de 5 linhas sem lógica

---

## Mapa HTML → shadcn

| Padrão no HTML | shadcn base |
|---|---|
| `<button ...>` | `Button` |
| Card com borda / sombra | `Card` (CardHeader, CardContent, CardFooter) |
| Status chip / label colorida | `Badge` |
| `<input>`, `<select>`, `<textarea>` | `Input`, `Select`, `Textarea` |
| Modal (overlay div) | `Dialog` |
| Toast flutuante | `Sonner` |
| Abas / tabs | `Tabs` |
| Toggle / switch | `Switch` |
| `.tablet-btn` (80px min-h) | `Button` + classes Petra |
| `.tablet-btn-lg` (110px min-h) | `Button` + classes Petra |
| `.tablet-btn-xl` (140px min-h) | `Button` + classes Petra |
| `.stat-chip` | `Card` ou div puro |

---

## Formato de saída

```markdown
## Mapa: <NomeDaTela>

| # | Nome | Pasta | shadcn base | Complexidade | Linha |
|---|---|---|---|---|---|
| 1 | `TruckTripsCounter` | `management/` | `Card` | S | ~1480 |
| 2 | `TabletButton` | `tablet/` | `Button` | S | ~1490 |
| 3 | `StopModal` | `modals/` | `Dialog` | M | ~1510 |

### Props sugeridas

**TruckTripsCounter**
\`\`\`tsx
interface TruckTripsCounterProps {
  trips: number
  goal: number
  tons: number
}
\`\`\`

### Ordem de extração sugerida
1. Primitivos (S) → sem dependência de outros componentes
2. Compostos (M) → dependem dos primitivos
3. Telas completas (L) → por último
```
