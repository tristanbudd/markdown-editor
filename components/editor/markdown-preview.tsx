"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { ScrollArea } from "@/components/ui/scroll-area"

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <ScrollArea className="h-full">
      <div className="prose prose-sm dark:prose-invert max-w-none p-6 md:p-8">
        <ReactMarkdown
          components={{
            h1: ({ children, ...props }) => (
              <h1
                {...props}
                className="text-foreground border-border mb-4 scroll-m-20 border-b pb-2 text-2xl font-bold tracking-tight"
              >
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2
                {...props}
                className="text-foreground border-border mt-8 mb-3 scroll-m-20 border-b pb-1.5 text-xl font-semibold tracking-tight"
              >
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3
                {...props}
                className="text-foreground mt-6 mb-2 scroll-m-20 text-lg font-semibold tracking-tight"
              >
                {children}
              </h3>
            ),
            h4: ({ children, ...props }) => (
              <h4
                {...props}
                className="text-foreground mt-5 mb-1.5 scroll-m-20 text-base font-semibold tracking-tight"
              >
                {children}
              </h4>
            ),
            h5: ({ children, ...props }) => (
              <h5
                {...props}
                className="text-foreground mt-4 mb-1 scroll-m-20 text-sm font-semibold tracking-tight"
              >
                {children}
              </h5>
            ),
            h6: ({ children, ...props }) => (
              <h6
                {...props}
                className="text-muted-foreground mt-4 mb-1 scroll-m-20 text-sm font-medium tracking-tight"
              >
                {children}
              </h6>
            ),
            strong: ({ children, ...props }) => (
              <strong {...props} className="text-foreground font-bold">
                {children}
              </strong>
            ),
            em: ({ children, ...props }) => (
              <em {...props} className="italic">
                {children}
              </em>
            ),
            del: ({ children, ...props }) => (
              <del {...props} className="text-muted-foreground">
                {children}
              </del>
            ),
            code: ({ children, className, ...props }) => {
              const isInline = !className
              if (isInline) {
                return (
                  <code
                    {...props}
                    className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-xs"
                  >
                    {children}
                  </code>
                )
              }
              return null
            },
            a: ({ ...props }) => (
              <a
                {...props}
                className="md-hover-label-inline text-primary hover:text-primary/80 underline underline-offset-2"
                rel="noopener noreferrer"
                target="_blank"
              />
            ),
            img: ({ ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                {...props}
                alt={props.alt || ""}
                className="md-hover-label-inline border-border h-auto max-w-full rounded-lg border"
                loading="lazy"
              />
            ),
            ul: ({ className, ...props }) => {
              const isTaskList = className?.includes("contains-task-list")
              return (
                <ul
                  {...props}
                  className={`md-hover-label my-2 ml-4 ${
                    isTaskList ? "ml-0 list-none pl-0" : "list-disc"
                  } space-y-1`}
                />
              )
            },
            ol: ({ ...props }) => (
              <ol {...props} className="md-hover-label my-2 ml-4 list-decimal space-y-1" />
            ),
            li: ({ ...props }) => (
              <li {...props} className="text-muted-foreground leading-relaxed" />
            ),
            blockquote: ({ ...props }) => (
              <blockquote
                {...props}
                className="md-hover-label border-primary/40 text-muted-foreground my-4 border-l-3 pl-4 italic"
              />
            ),
            hr: () => <hr className="md-hover-label border-border my-8" />,
          }}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  )
}
