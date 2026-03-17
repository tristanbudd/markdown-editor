/**
 * @file styles.ts
 * @description Shared Tailwind class strings for markdown preview elements.
 * Edit here to update styles consistently across the app.
 */

export const PARAGRAPH_STYLE = "leading-relaxed text-foreground/90 my-3"

export const HEADING_STYLES = {
  h1: "text-2xl font-bold tracking-tight text-foreground mb-4 pb-2 border-b border-border scroll-m-20",
  h2: "text-xl font-semibold tracking-tight text-foreground mt-8 mb-3 pb-1.5 border-b border-border scroll-m-20",
  h3: "text-lg font-semibold tracking-tight text-foreground mt-6 mb-2 scroll-m-20",
  h4: "text-base font-semibold tracking-tight text-foreground mt-5 mb-1.5 scroll-m-20",
  h5: "text-sm font-semibold tracking-tight text-foreground mt-4 mb-1 scroll-m-20",
  h6: "text-sm font-medium tracking-tight text-muted-foreground mt-4 mb-1 scroll-m-20",
} as const

export type HeadingLevel = keyof typeof HEADING_STYLES

export const CODE_STYLES = {
  inline: "bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-xs",
  block: "border-border bg-muted/50 my-4 overflow-x-auto rounded-lg border p-4 text-sm",
}

export const BLOCKQUOTE_STYLE =
  "border-primary/40 text-muted-foreground my-4 border-l-4 pl-4 italic"

export const LIST_STYLES = {
  ul: "!mt-6 mb-4 ml-6 space-y-2 list-disc",
  ol: "my-2 ml-4 list-decimal space-y-1",
  task: "ml-0 list-none pl-0",
  item: "leading-relaxed",
}

export const TABLE_STYLES = {
  wrapper: "my-6 w-full overflow-y-auto",
  table: "w-full overflow-hidden rounded-lg",
  thead: "bg-muted/50 border-b",
  tbody: "divide-border divide-y",
  tr: "hover:bg-muted/30 transition-colors",
  th: "text-foreground border-r px-4 py-3 text-left font-semibold last:border-0",
  td: "text-muted-foreground border-r px-4 py-3 last:border-0",
}

export const LINK_STYLE = "text-primary hover:text-primary/80 underline underline-offset-2"

export const HR_STYLE = "border-border my-8"

export const IMAGE_STYLE = "border-border h-auto max-w-full rounded-lg border"
