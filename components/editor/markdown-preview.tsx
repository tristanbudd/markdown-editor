"use client"

// TODO: Implement markdown rendering
// - Use react-markdown or similar library for parsing
// - Support GitHub Markdown Style (GFM) syntax
// - Add syntax highlighting for code blocks (e.g., react-syntax-highlighter)
// - Support platform-specific styles (GitHub, GitLab, Bitbucket)
// - Add copy button for code blocks
// - Support mermaid diagrams
// - Handle image rendering and lazy loading
import { ScrollArea } from "@/components/ui/scroll-area"

interface MarkdownPreviewProps {
  content: string
  // TODO: Add platform prop to apply platform-specific markdown styles
  // platform?: "standard" | "github" | "gitlab" | "bitbucket"
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  // TODO: Replace pre tag with actual markdown renderer
  // Example: <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  return (
    <ScrollArea className="h-full">
      <div className="p-6 md:p-8">
        <pre className="text-foreground/90 font-mono text-sm leading-relaxed break-words whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </ScrollArea>
  )
}
