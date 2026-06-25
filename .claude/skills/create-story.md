# Skill: create-story

Cria um arquivo de story do Storybook para um componente React já extraído do HTML.

## Como invocar

```
/create-story <NomeDoComponente>
```

Exemplos:
```
/create-story TabletButton
/create-story KpiCard
/create-story StopModal
```

---

## O que este skill faz

1. Lê o componente em `src/components/<feature>/<NomeDoComponente>.tsx`
2. Identifica todas as props e variantes
3. Cria `stories/<feature>/<NomeDoComponente>.stories.tsx` com:
   - Story `Default` e uma story por variante/estado relevante
   - Background correto (dark para tablet, light para management)
   - `autodocs` habilitado
   - Args tipados corretamente

---

## Estrutura de story

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ComponentName } from '../../src/components/<feature>/ComponentName'

const meta = {
  title: '<Feature>/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: '<dark|light>' },
  },
  args: {
    // defaults sensatos para todos os args
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variant2: Story = {
  args: { ... },
}
```

---

## Regras de nomenclatura

| `title` no Storybook | Feature | Exemplo |
|---|---|---|
| `Petra/ComponentName` | `petra/` | `Petra/PetraIcon` |
| `Tablet/ComponentName` | `tablet/` | `Tablet/TabletButton` |
| `Management/ComponentName` | `management/` | `Management/KpiCard` |
| `Modals/ComponentName` | `modals/` | `Modals/StopModal` |

---

## Backgrounds padrão

```tsx
// Componente do tablet (fundo escuro)
parameters: {
  backgrounds: { default: 'dark' },
}

// Componente do painel gerencial (fundo claro)
parameters: {
  backgrounds: { default: 'light' },
}

// Componente de modal (fundo escurecido)
parameters: {
  backgrounds: { default: 'dark' },
  layout: 'centered',
}
```

---

## Boas histórias a criar por tipo

### Botões (TabletButton, etc.)
- `Default` — variante principal
- `AllSizes` — md, lg, xl em linha
- `AllVariants` — primary, success, danger, warning, secondary
- `WithIcon` — com ícone
- `Disabled` — estado desabilitado

### Cards (KpiCard, FleetCard, etc.)
- `Default` — dados típicos
- `WithTrend` — com indicador de tendência
- `Loading` — skeleton state (se aplicável)

### Modais (StopModal, etc.)
- `Default` — aberta por padrão (`parameters: { layout: 'fullscreen' }`)
- `WithReasonSelected` — com motivo selecionado

### Ícones (PetraIcon)
- `Default` — um ícone
- `Gallery` — grid de todos os ícones
- `Sizes` — tamanhos 16, 24, 32, 48

---

## Checklist

- [ ] Story renderiza sem erro
- [ ] `autodocs` ativado (tag `['autodocs']`)
- [ ] Background correto (dark/light)
- [ ] Ao menos 2 stories (Default + 1 variante)
- [ ] Args com valores válidos (sem undefined)
