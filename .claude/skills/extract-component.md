# Skill: extract-component

Converte um trecho do `docs/parte_diaria_v46.html` em um componente React.

## Como invocar

```
/extract-component <NomeDoComponente> [linhas ou função de referência]
```

Exemplos:
```
/extract-component TabletButton linhas 1490-1530
/extract-component KpiCard renderMgmtDashboard (linha ~3980)
/extract-component StopModal tipo "parada" em renderModal (linha ~2556)
```

---

## REGRA #1 — shadcn sempre primeiro

**Antes de escrever qualquer elemento HTML nativo, verifique se há um componente shadcn em `components/ui/`.**

### Componentes instalados (26 de junho 2026)

```
button         input          label          textarea       select
card           badge          separator      tabs           switch
avatar         alert          tooltip        dropdown-menu  dialog
skeleton       progress       checkbox       radio-group    scroll-area
sonner         table          popover        sheet          input-group
command
```

### Mapeamento direto: necessidade → shadcn

| Quando precisar de… | Use |
|---|---|
| Qualquer botão clicável | `Button` (`variant`: default, destructive, outline, ghost, link) |
| Campo de texto/número | `Input` |
| Label acessível vinculada a input | `Label` |
| Área de texto longa | `Textarea` |
| Dropdown de seleção | `Select` |
| Toggle on/off | `Switch` |
| Caixa de seleção | `Checkbox` |
| Opções exclusivas | `RadioGroup` |
| Container com cabeçalho | `Card` + `CardHeader` + `CardContent` |
| Status chip / tag | `Badge` |
| Modal / diálogo | `Dialog` + `DialogContent` + `DialogHeader` |
| Painel deslizante lateral | `Sheet` |
| Banner de aviso inline | `Alert` |
| Tooltip de hover | `Tooltip` |
| Menu de contexto / ações | `DropdownMenu` |
| Placeholder de carregamento | `Skeleton` |
| Barra de progresso determinada | `Progress` |
| Área scrollável controlada | `ScrollArea` |
| Menu ancorado em elemento | `Popover` |
| Tabela de dados | `Table` + `TableHead` + `TableRow` + `TableCell` |
| Lista pesquisável / combobox | `Command` |
| Notificações toast | `Sonner` (`toast()`) |
| Seções com abas | `Tabs` |
| Linha divisória | `Separator` |
| Foto/iniciais de usuário | `Avatar` |
| Input com prefixo/sufixo | `InputGroup` |

### Como personalizar sem editar `components/ui/`

Passe `className` para sobrescrever estilos. shadcn usa `cn()` internamente, então as classes adicionais sempre ganham:

```tsx
// Botão de produção grande do tablet — usa Button com override agressivo
<Button
  onClick={onPress}
  disabled={isDisabled}
  className="h-full w-full flex-col gap-2 rounded-2xl text-3xl font-black bg-op-green hover:bg-op-green-dark shadow-xl shadow-op-green/30"
>
  <PetraIcon name="dump" size={56} />
  BASCULAMENTO
</Button>

// Input do horímetro — usa Input com estilo grande
<Input
  type="number"
  className="h-auto border-2 border-tablet-border bg-tablet-bg py-4 text-center font-display text-3xl text-petra-yellow"
/>

// Badge de status colorido
<Badge className="bg-op-green/10 text-op-green border-op-green/20">
  APTO
</Badge>
```

### Quando NÃO usar shadcn

Apenas elementos sem componente equivalente: `div`, `span`, `p`, `section`, `ul/li` — ou seja, puramente de display sem interação.

**Todo elemento interativo (botão, input, select, checkbox, modal, etc.) usa shadcn, sem exceção.** `Button` aceita qualquer `className`, inclusive `h-full flex-col gap-2 text-3xl` — não há motivo para usar `<button>` nativo.

---

## O que este skill faz

1. Lê o trecho indicado em `docs/parte_diaria_v46.html`
2. Identifica: props, variantes, estado local, handlers
3. Escolhe a pasta correta (ver estrutura abaixo)
4. **Seleciona os componentes shadcn adequados** para cada elemento
5. Cria o componente React em `components/<feature>/<Nome>.tsx`
6. Marca o HTML com comentário `[EXTRACTED: ...]`
7. Cria a story via `/create-story` ou sugere o comando

---

## Estrutura de pastas

```
components/
  petra/        # Primitivos do design system (PetraIcon, StatusDot, StatChip)
  tablet/       # UI do operador de campo (ChecklistItem, HorimeterInput, OpHeader)
  management/   # UI do painel gerencial (KpiCard, FleetCard, EventFeed)
  modals/       # Modais (StopModal, AlertModal, FinalizeShiftModal...)
```

### Escolha da pasta

| Função de origem | Pasta |
|---|---|
| `renderTablet*`, `renderTabletOperational*` | `tablet/` |
| `renderMgmt*` | `management/` |
| `renderModal*` | `modals/` |
| Usado em 2+ contextos | `petra/` |

---

## Padrão de componente — seguir docs/FRONTEND.md

```tsx
// Referência: docs/parte_diaria_v46.html linha <N> — <NomeFunçãoOriginal>()
// [EXTRACTED: NomeDoComponente]

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';   // se tiver variantes
import { Button }   from '@/components/ui/button'; // shadcn primeiro
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { PetraIcon, IconName } from '@/components/petra/PetraIcon';

export type <Nome>Props = {
  className?: string;  // SEMPRE incluir
  // demais props (sem any)
};

export const <Nome>: React.FC<<Nome>Props> = ({ className, ... }) => {
  const handleClick = () => { ... };  // handlers → arrow functions

  return (
    <div className={cn('...classes-base...', className)}>
      {/* JSX aqui */}
    </div>
  );
};
```

### Regras críticas

| Regra | Correto | Errado |
|---|---|---|
| Props | `type XProps = { ... }` | `interface XProps { ... }` |
| Componente | `React.FC<XProps>` | `function X(props: XProps)` |
| Classes | `cn('base', className)` | `'base ' + className` |
| Handlers | `const handleX = () => {}` | `function handleX() {}` |
| Tipos import | `import { IconName }` | `import type { IconName }` |
| Variantes | `cva(...)` | if/else de className |
| Shadcn | `<Button>`, `<Input>`, etc. | `<button>`, `<input>` nativos |

### `'use client'`

**Boundary components apenas** — views e context providers. Componentes individuais NÃO precisam de `'use client'` se estão dentro de uma view que já o declara.

---

## Conversão de HTML para JSX

| HTML original | JSX React |
|---|---|
| `class="..."` | `className="..."` |
| `onclick="fn()"` | `onClick={handleFn}` (arrow function) |
| `style="color:red"` | `style={{ color: 'red' }}` |
| Template literal `${expr}` | `{expr}` em JSX |
| `icon('truck', 32)` | `<PetraIcon name="truck" size={32} />` |
| `<button class="tablet-btn ...">` | `<Button className="...">` |
| `<input class="...">` | `<Input className="...">` |
| `<input type="checkbox">` | `<Checkbox />` |
| Modal overlay | `<Dialog><DialogContent>` |
| Toast (`toast()`) | `toast()` do Sonner |
| Barra de progresso | `<Progress value={pct} />` |
| Condicional `x ? a : b` | `{x ? a : b}` em JSX |
| Loop `arr.map(...)` | `{arr.map(...)}` em JSX |

---

## Classes Tailwind disponíveis (tokens Petra)

Definidas em `app/globals.css`:

```
Marca:     bg-petra-blue, text-petra-blue, bg-petra-yellow, text-petra-yellow
Tablet:    bg-tablet-bg, bg-tablet-surface, bg-tablet-surface-2, bg-tablet-surface-3
           text-tablet-text, text-tablet-text-dim, text-tablet-text-muted
           border-tablet-border, border-tablet-border-light
Status:    bg-op-green, bg-op-red, bg-op-orange, text-op-green, text-op-red
Fontes:    font-display (Archivo), font-mono (JetBrains Mono)
```

---

## Marcação de rastreamento no HTML

Adicionar **logo antes** do trecho convertido:

```html
// [EXTRACTED: ComponentName]
```

Ver progresso: `/conversion-progress`

---

## Checklist antes de concluir

- [ ] Componente compila sem erros TypeScript
- [ ] Props tipadas (sem `any`)
- [ ] shadcn usado para todos os elementos interativos (Button, Input, Label, etc.)
- [ ] `'use client'` correto (ausente na maioria dos componentes)
- [ ] Comentário `[EXTRACTED]` adicionado no HTML
- [ ] Story criada ou `/create-story <Nome>` sugerido como próximo passo

---

## Componentes já extraídos

| Componente | Pasta | Linha no HTML |
|---|---|---|
| `PetraIcon` | `petra/` | 350–411 |
| `StatusDot` | `petra/` | CSS 53–55 |
| `OpHeader` | `tablet/` | 1270–1298 |
| `ActiveStopBanner` | `tablet/` | 1312–1325 |
| `TurnoInfoBar` | `tablet/` | 1406–1448 |
| `OpActionsPanel` | `tablet/` | 1453–1482 |
| `StopButton` | `tablet/` | inline |
| `TruckCountersPanel` | `tablet/` | 1557–1598 |
| `TruckProductionButtons` | `tablet/` | 1526–1551 |
| `OpControlsColumn` | `tablet/` | 1634–1648 |
| `ChecklistProgressHeader` | `tablet/` | 906–920 |
| `ChecklistItem` | `tablet/` | 944–1001 |
| `HorimeterInput` | `tablet/` | 1150–1168 |
| `KpiCard` | `management/` | ~3950+ |
| `FleetCard` | `management/` | 4186–4213 |
