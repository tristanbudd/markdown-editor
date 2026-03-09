"use client"

import { forwardRef, useMemo, type ElementType, type HTMLAttributes, type ReactNode } from "react"
import { Link } from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { ScrollArea } from "@/components/ui/scroll-area"

import type { PlatformType } from "./platform-selector"

interface MarkdownPreviewProps {
  content: string
  platform: PlatformType
}

interface HeadingProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  id?: string
  children: ReactNode
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  function MarkdownPreview({ content, platform }, ref) {
    const remarkPlugins = useMemo(() => {
      const plugins: Array<typeof remarkGfm | typeof remarkMath> = []
      plugins.push(remarkGfm)
      if (platform === "github" || platform === "gitlab") {
        plugins.push(remarkMath)
      }
      return plugins
    }, [platform])

    const rehypePlugins = useMemo(() => {
      const plugins: Array<
        typeof rehypeKatex | typeof rehypeHighlight | typeof rehypeRaw | typeof rehypeSlug
      > = []
      plugins.push(rehypeRaw)
      if (platform === "github" || platform === "gitlab" || platform === "bitbucket") {
        plugins.push(rehypeSlug)
        plugins.push(rehypeHighlight)
      }
      if (platform === "github" || platform === "gitlab") {
        plugins.push(rehypeKatex)
      }
      return plugins
    }, [platform])

    const Heading = ({ as: Tag = "h2", children, className = "", id, ...props }: HeadingProps) => {
      const showAnchor = platform === "github" && id

      return (
        <Tag {...props} className={`group relative ${className}`} id={id}>
          {showAnchor && (
            <a
              aria-label="Anchor link"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 -left-6 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              href={`#${id}`}
            >
              <Link className="h-4 w-4" />
            </a>
          )}
          {children}
        </Tag>
      )
    }

    return (
      <ScrollArea className="h-full">
        <div ref={ref} className="prose prose-sm dark:prose-invert max-w-none p-6 md:p-8">
          <ReactMarkdown
            components={{
              h1: ({ children, ...props }) => (
                <Heading
                  as="h1"
                  {...props}
                  className="text-foreground border-border mb-4 scroll-m-20 border-b pb-2 text-2xl font-bold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h2: ({ children, ...props }) => (
                <Heading
                  as="h2"
                  {...props}
                  className="text-foreground border-border mt-8 mb-3 scroll-m-20 border-b pb-1.5 text-xl font-semibold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h3: ({ children, ...props }) => (
                <Heading
                  as="h3"
                  {...props}
                  className="text-foreground mt-6 mb-2 scroll-m-20 text-lg font-semibold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h4: ({ children, ...props }) => (
                <Heading
                  as="h4"
                  {...props}
                  className="text-foreground mt-5 mb-1.5 scroll-m-20 text-base font-semibold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h5: ({ children, ...props }) => (
                <Heading
                  as="h5"
                  {...props}
                  className="text-foreground mt-4 mb-1 scroll-m-20 text-sm font-semibold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h6: ({ children, ...props }) => (
                <Heading
                  as="h6"
                  {...props}
                  className="text-muted-foreground mt-4 mb-1 scroll-m-20 text-sm font-medium tracking-tight"
                >
                  {children}
                </Heading>
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
              code: ({ className, children, ...props }) => {
                const isInline = !className
                // Only string children are expected for inline code
                const codeValue = Array.isArray(children) ? children.join("") : children
                // Regex for HEX, RGB, HSL
                const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                const rgbRegex =
                  /^rgb\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/
                const hslRegex =
                  /^hsl\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})%\s*,\s*([0-9]{1,3})%\s*\)$/
                let color = null
                if (typeof codeValue === "string") {
                  if (hexRegex.test(codeValue)) {
                    color = codeValue
                  } else if (rgbRegex.test(codeValue)) {
                    color = codeValue
                  } else if (hslRegex.test(codeValue)) {
                    color = codeValue
                  }
                }
                if (isInline) {
                  return (
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      <code
                        className="md-hover-label-inline bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-xs"
                        {...props}
                      >
                        {children}
                        {color && (
                          <span
                            aria-label={`Color preview for ${color}`}
                            style={{
                              display: "inline-block",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: color,
                              marginLeft: "0.4em",
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                      </code>
                    </span>
                  )
                }
                return (
                  <code className={`${className} font-mono text-sm`} {...props}>
                    {children}
                  </code>
                )
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
              pre: ({ ...props }) => (
                <pre
                  {...props}
                  className="md-hover-label border-border bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm"
                />
              ),
              summary: ({ ...props }) => (
                <summary
                  {...props}
                  className="bg-muted/30 text-foreground hover:bg-muted/50 cursor-pointer px-4 py-2.5 font-medium transition-colors select-none"
                />
              ),
              sup: ({ ...props }) => (
                <sup {...props} className="md-hover-label-inline text-primary text-xs" />
              ),
            }}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
          >
            {content}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    )
  }
)
