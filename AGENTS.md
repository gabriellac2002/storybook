<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend patterns — read before writing any component

@docs/FRONTEND.md

Key rules (full detail in the file above):
- `type` over `interface` for props
- Always include `className?: string` — caller must be able to override layout
- Use `cn()` from `@/lib/utils` for class merging, never concatenate strings
- Use `React.FC<Props>` for component typing
- `'use client'` on boundary components only (views/contexts) — individual components should NOT declare it unless consumed directly by a server component
- Handlers inside components → arrow functions
- `cva` for component variants
- Never edit `components/ui/` — create wrappers instead
- Prefer semantic color tokens (`bg-background`, `text-muted-foreground`, etc.) — use Petra tokens for brand elements
