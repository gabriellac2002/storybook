# Skill: extract-component

Converte um trecho do `docs/parte_diaria_v46.html` em um componente React usando shadcn como base onde aplicável.

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

## O que este skill faz

1. Lê o trecho indicado em `docs/parte_diaria_v46.html`
2. Lê `docs/ARQUITETURA.md` para contexto de domínio se necessário
3. Identifica: props, variantes, estado local, handlers
4. Escolhe a pasta correta (ver estrutura abaixo)
5. Cria o componente React em `src/components/<feature>/<Nome>.tsx` usando shadcn onde aplicável
6. Marca o HTML com comentário `[EXTRACTED: ...]`
7. Sugere os próximos passos (criar story via `/create-story`)

---

## Estrutura de pastas

```
src/components/
  petra/        # Primitivos do design system (PetraIcon, StatusDot, StatChip)
  tablet/       # UI do operador de campo (TabletButton, ChecklistItem, HorimeterInput)
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

## Como usar shadcn como base

shadcn está instalado em `src/components/ui/`. Importe e estilize por cima:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Aplique classes Petra sobre o shadcn:
<Button
  className="min-h-[80px] text-xl font-display bg-petra-blue text-white hover:bg-petra-blue-dark"
>
  VIAGEM PRODUTIVA
</Button>
```

### Mapa de conversão HTML → shadcn

| CSS/HTML original | shadcn + classes Petra |
|---|---|
| `<button class="tablet-btn ...">` | `<Button className="min-h-[80px] text-xl ...">` |
| `<button class="tablet-btn-lg ...">` | `<Button className="min-h-[110px] text-2xl ...">` |
| `<button class="tablet-btn-xl ...">` | `<Button className="min-h-[140px] text-3xl ...">` |
| Card com borda `mgmt-card` | `<Card className="border border-gray-200">` |
| Badge de status | `<Badge variant="outline" className="...">` |
| `<input class="...">` | `<Input className="...">` |
| Modal overlay | `<Dialog>` + `<DialogContent>` |
| Toast (`toast()`) | Sonner (`toast()`) ou componente Toast |

### Quando NÃO usar shadcn

- Botões do tablet com layout de ícone grande em cima + label embaixo → JSX customizado (shadcn Button não suporta bem esse layout)
- `.stat-chip` (pequeno chip de stats dentro de modal) → div simples com Tailwind
- Elementos puramente de display sem interação → HTML/JSX direto

---

## Padrão de componente — seguir docs/FRONTEND.md

**Leia `docs/FRONTEND.md` antes de criar qualquer componente.** Resumo das regras que se aplicam à conversão:

```tsx
// Referência: docs/parte_diaria_v46.html linha <N> — <NomeFunçãoOriginal>()
// [Descrição do que o componente faz no sistema]

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'  // se tiver variantes
import { Button } from '@/components/ui/button'  // se usar shadcn
import { PetraIcon, IconName } from '@/components/petra/PetraIcon'  // se usar ícone

export type <Nome>Props = {
  className?: string;   // SEMPRE incluir — o caller precisa poder sobrescrever
  // ... demais props tipadas (sem any)
};

export const <Nome>: React.FC<<Nome>Props> = ({ className, ... }) => {
  // Handlers dentro do componente → arrow functions
  const handleClick = () => { ... };

  return (
    <div className={cn('...classes-base...', className)}>
      {/* JSX aqui */}
    </div>
  );
};
```

### Regras críticas do padrão

| Regra | Correto | Errado |
|---|---|---|
| Props | `type XProps = { ... }` | `interface XProps { ... }` |
| Componente | `React.FC<XProps>` | `function X(props: XProps)` |
| Classes | `cn('base', className)` | `'base ' + className` |
| Handlers | `const handleX = () => {}` | `function handleX() {}` |
| Tipos import | `import { IconName }` | `import type { IconName }` |
| Variantes | `cva(...)` | if/else de className |

### `'use client'`

**Boundary components apenas** — views e context providers.

Componentes individuais **não** precisam de `'use client'` se estão dentro de uma view que já o declara. Só adicionar se o componente for consumido diretamente por um Server Component E usar estado/eventos.

---

## Conversão de HTML para JSX

| HTML original | JSX React |
|---|---|
| `class="..."` | `className="..."` |
| `onclick="fn()"` | `onClick={handleFn}` (arrow function) |
| `style="color:red"` | `style={{ color: 'red' }}` |
| Template literal `${expr}` | `{expr}` em JSX |
| `icon('truck', 32)` | `<PetraIcon name="truck" size={32} />` |
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

Após criar o componente, adicionar **logo antes** do trecho convertido:

```html
<!-- [EXTRACTED: ComponentName]
     Componente: src/components/<feature>/ComponentName.tsx
     Story: stories/<feature>/ComponentName.stories.tsx
     Data: YYYY-MM-DD
-->
```

Ver progresso: `/conversion-progress`

---

## Checklist antes de concluir

- [ ] Componente compila sem erros TypeScript
- [ ] Props tipadas (sem `any`)
- [ ] `'use client'` correto (presente se necessário, ausente se não for)
- [ ] shadcn usado como base onde faz sentido
- [ ] Comentário `[EXTRACTED]` adicionado no HTML
- [ ] Sugeriu `/create-story <NomeDoComponente>` como próximo passo

---

## Componentes já extraídos

| Componente | Pasta | Linha no HTML |
|---|---|---|
| `PetraIcon` | `petra/` | 350–411 |
| `StatusDot` | `petra/` | CSS linhas 53–55 |
| `TabletButton` | `tablet/` | CSS linhas 50–52 |
| `KpiCard` | `management/` | ~3950+ |
