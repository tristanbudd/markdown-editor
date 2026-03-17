/**
 * @file styles.ts
 * @description Shared Tailwind class strings for markdown preview elements.
 * Edit here to update styles consistently across the app.
 */

export const PARAGRAPH_STYLE = "leading-relaxed text-foreground/90 my-3"

export const HEADING_STYLES = {
  h1: "text-2xl font-bold tracking-tight text-foreground mb-4 pb-2 border-b border-border",
  h2: "text-xl font-semibold tracking-tight text-foreground mt-8 mb-3 pb-1.5 border-b border-border",
  h3: "text-lg font-semibold tracking-tight text-foreground mt-6 mb-2",
  h4: "text-base font-semibold tracking-tight text-foreground mt-5 mb-1.5",
  h5: "text-sm font-semibold tracking-tight text-foreground mt-4 mb-1",
  h6: "text-sm font-medium tracking-tight text-muted-foreground mt-4 mb-1",
} as const

export type HeadingLevel = keyof typeof HEADING_STYLES
