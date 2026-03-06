"use client"

import { useMemo } from "react"

import { HEADING_STYLES, PARAGRAPH_STYLE } from "@/lib/markdown-components/styles"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MarkdownPreviewProps {
  content: string
  // TODO: Add platform prop to apply platform-specific markdown styles
  // platform?: "standard" | "github" | "gitlab" | "bitbucket"
}

// Simple markdown renderer for headings and basic text
function renderMarkdown(content: string): React.ReactNode[] {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Heading detection
    const h6Match = line.match(/^######\s+(.*)$/)
    const h5Match = line.match(/^#####\s+(.*)$/)
    const h4Match = line.match(/^####\s+(.*)$/)
    const h3Match = line.match(/^###\s+(.*)$/)
    const h2Match = line.match(/^##\s+(.*)$/)
    const h1Match = line.match(/^#\s+(.*)$/)

    if (h6Match) {
      elements.push(
        <h6 key={i} className={HEADING_STYLES.h6}>
          {h6Match[1]}
        </h6>
      )
    } else if (h5Match) {
      elements.push(
        <h5 key={i} className={HEADING_STYLES.h5}>
          {h5Match[1]}
        </h5>
      )
    } else if (h4Match) {
      elements.push(
        <h4 key={i} className={HEADING_STYLES.h4}>
          {h4Match[1]}
        </h4>
      )
    } else if (h3Match) {
      elements.push(
        <h3 key={i} className={HEADING_STYLES.h3}>
          {h3Match[1]}
        </h3>
      )
    } else if (h2Match) {
      elements.push(
        <h2 key={i} className={HEADING_STYLES.h2}>
          {h2Match[1]}
        </h2>
      )
    } else if (h1Match) {
      elements.push(
        <h1 key={i} className={HEADING_STYLES.h1}>
          {h1Match[1]}
        </h1>
      )
    } else if (line === "") {
      elements.push(<br key={i} />)
    } else {
      elements.push(
        <p key={i} className={PARAGRAPH_STYLE}>
          {line}
        </p>
      )
    }
  }

  return elements
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const rendered = useMemo(() => renderMarkdown(content), [content])

  return (
    <ScrollArea className="h-full">
      <div className="prose prose-sm dark:prose-invert max-w-none p-6 md:p-8">{rendered}</div>
    </ScrollArea>
  )
}
