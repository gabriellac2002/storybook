# Frontend Guide

Patterns and rules for all client-side code. Read this before writing or editing any component,
hook, view, or page.

## Component anatomy

```tsx
import { cn } from '@/lib/utils';

export type UserCardProps = {
  className?: string;
  name: string;
  email: string;
};

export const UserCard: React.FC<UserCardProps> = ({ className, name, email }) => {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>
  );
};
```

Rules:

- `type` over `interface` for props.
- Always include `className?: string` so the caller can override layout.
- Use `cn()` for class merging — never concatenate strings manually.
- Use `React.FC<Props>` for component typing.

## `use client` — boundary components only

`'use client'` marks a **boundary**. Everything below that boundary is already a client component —
child components do **not** need their own `'use client'`.

**Views** (`src/features/*/views/`) are the primary client boundary. They own hooks and state, so
they declare `'use client'`.

**Pages** (`src/app/**/page.tsx`) are Server Components by default and should stay that way. A page
should not declare `'use client'` — it delegates to a view instead.

**Feature components** (`src/features/*/components/`) and global components should not declare
`'use client'` unless they are consumed directly by a server component. If a component only appears
inside views, it inherits the client context from the view.

```tsx
// src/app/(private)/mentoring-sessions/page.tsx — Server Component, no 'use client'
import { MentoringSessionsPage } from '@/features/mentoring-sessions/views/mentoring-sessions-page';

const Page: React.FC = () => <MentoringSessionsPage />;
export default Page;
```

```tsx
// src/features/mentoring-sessions/views/mentoring-sessions-page.tsx — client boundary
'use client';

import { useState } from 'react';
// ...
```

The only other place that typically needs `'use client'` is a **context provider** that wraps client
hooks.

## Types

- Regular imports for types — do **not** use `import type` or `import { type Foo }`.

## Functions inside components

Top-level and module-level functions: use function declarations (`function foo() {}`).

Handlers and callbacks **inside a component**: use arrow functions.

```tsx
// ✅
const handleSubmit = async () => {
  await save(data);
};

// ❌ — function declarations inside components blur the component/function distinction
function handleSubmit() { ... }
```

## Reference stability

Never create a new array or object literal as a fallback value inside a component body. Each render
produces a new reference, which breaks `useMemo`, `useEffect`, and any hook that compares
dependencies by identity.

```tsx
// ❌ — [] is a new reference every render; any useMemo that depends on `items` will re-run
//      even when the actual data hasn't changed
const items = data ?? [];
const processed = useMemo(() => items.map(transform), [items]);

// ✅ — handle the nullable inside the memo; the dependency is `data`, which is stable
const processed = useMemo(() => (data ?? []).map(transform), [data]);
```

The same applies to object literals used as default prop values or hook arguments:

```tsx
// ❌
const config = options ?? {};
useEffect(() => { ... }, [config]);

// ✅
useEffect(() => { ... }, [options]);
```

## Styling

- Prefer semantic color tokens: `bg-background`, `text-foreground`, `text-muted-foreground`,
  `border-border`, `bg-primary`, `text-destructive`. Avoid hardcoded colors like `bg-white` or
  `text-gray-500`.
- `components/ui/` is managed by the shadcn CLI — do not edit those files. Create wrappers if you
  need custom behavior.
- Use `cva` for component variants:

```tsx
import { cva } from 'class-variance-authority';

const badge = cva('rounded-full px-2 py-1 text-xs font-medium', {
  variants: {
    status: {
      active: 'bg-success/10 text-success',
      inactive: 'bg-muted text-muted-foreground',
    },
  },
});
```

## Responsive layout

Prefer Tailwind responsive classes over JavaScript media query detection for layout toggling.

```tsx
// ✅ — pure CSS, no JS needed
<span className="hidden md:inline">Full label</span>
<span className="md:hidden">Short</span>

// ❌ — JS detection adds complexity and delays render
const isMobile = useIsMobile();
return isMobile ? <span>Short</span> : <span>Full label</span>;
```

`isMobile` corresponds to the `md:` breakpoint (≥ 768 px), not `sm:`. Use JS detection only when the
difference must affect behavior (e.g., touch events, camera access), not layout.

## i18n

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('featureName.section');
// usage: t('key'), t('keyWithParam', { name: value })
```

- Translation files: `/messages/en.json` and `/messages/pt-BR.json`. Always add new keys to **both**
  files under the same namespace.
- Never hardcode user-visible strings — always go through `t()`.
- Server components use `getTranslations()` (async) instead of `useTranslations`.

## Loading state

**Page-level loading** (initial data fetch, no data yet): use `Skeleton` components that match the
shape of the content.

```tsx
if (isLoading) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
```

**Inline loading** (list fetch inside a view): use a centered spinner.

```tsx
if (loading) {
  return (
    <div className="flex justify-center py-10">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
```

**Action loading** (button mutation in progress): disable the button and show an inline spinner.
`mutateAsync` does not show loading automatically — you must wire it up manually using the
mutation's `isPending` / loading flag.

```tsx
<Button onClick={() => approve()} disabled={approving}>
  {approving && <Loader2 className="size-4 animate-spin" />}
  {t('approve')}
</Button>
```

## Referências externas

- [Next.js 16 — App Router](https://nextjs.org/docs/app)
- [React 19](https://react.dev/reference/react)
- [TypeScript 5](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [cva](https://cva.style/docs)
- [react-hook-form](https://react-hook-form.com/api)
- [next-intl](https://next-intl-docs.vercel.app)
- [lucide-react](https://lucide.dev/icons)

## Error state

Use `MessageDisplay` for page-level errors. Always distinguish `notFound` from generic errors.

```tsx
import { MessageDisplay, MessageDisplayPrimaryButton } from '@/components/message-display';
import { AppError } from '@/lib/error';
import { CalendarDays } from 'lucide-react';

if (error || !data) {
  const isNotFound = error instanceof AppError && error.type === 'notFound';
  return (
    <MessageDisplay
      intent="error"
      icon={CalendarDays}
      title={isNotFound ? t('notFound') : t('loadError')}
      description={isNotFound ? t('notFoundDescription') : t('loadErrorDescription')}
      className="absolute inset-0"
    >
      <MessageDisplayPrimaryButton href="/back">{t('back')}</MessageDisplayPrimaryButton>
    </MessageDisplay>
  );
}
```

`className="absolute inset-0"` is required when the view renders inside the sidebar layout — the
content area doesn't grow below the breadcrumbs, so the message must be positioned absolutely to
fill the full available area.

**Empty state** (data loaded but list is empty): use `MessageDisplay` with `intent="info"` and a
contextual icon. Same `absolute inset-0` rule applies inside the sidebar layout.

```tsx
if (items.length === 0) {
  return (
    <MessageDisplay
      size="default"
      icon={CalendarPlus}
      title={t('emptyTitle')}
      description={t('emptyDescription')}
      className="absolute inset-0"
    />
  );
}
```
