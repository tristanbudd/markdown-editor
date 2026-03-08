"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Blocks } from "lucide-react"

import { DEFAULT_MARKDOWN } from "@/lib/default-markdown"
import type { PlatformStyleType } from "@/lib/markdown-components"
import { useEditorHistory } from "@/hooks/use-editor-history"
import { Button } from "@/components/ui/button"

import { ComponentPanel } from "./component-panel"
import { EditorHeader } from "./editor-header"
import { FormattingToolbar } from "./formatting-toolbar"
import { MarkdownPreview } from "./markdown-preview"
import { PlatformSelector, type PlatformType } from "./platform-selector"

type ViewMode = "split" | "editor" | "preview"

export function MarkdownEditor() {
  const {
    value: markdown,
    set: setMarkdown,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorHistory(DEFAULT_MARKDOWN)
  const [platform, setPlatform] = useState<PlatformType>("standard")
  const [viewMode, setViewMode] = useState<ViewMode>("split")
  const [activeCategory, setActiveCategory] = useState<PlatformStyleType | "all">("all")
  const [componentPanelOpen, setComponentPanelOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const stats = useMemo(() => {
    const words = markdown.trim().split(/\s+/).filter(Boolean).length
    const chars = markdown.length
    const lines = markdown.length === 0 ? 0 : markdown.split("\n").length
    return { words, chars, lines }
  }, [markdown])

  const handleInsertComponent = useCallback(
    (template: string) => {
      const textarea = textareaRef.current
      if (!textarea) {
        setMarkdown(markdown + template, true)
        return
      }

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = markdown.slice(0, start)
      const after = markdown.slice(end)

      setMarkdown(before + template + after)

      // Set cursor position after inserted text
      requestAnimationFrame(() => {
        textarea.focus()
        const newPosition = start + template.length
        textarea.setSelectionRange(newPosition, newPosition)
      })
    },
    [markdown, setMarkdown]
  )

  const handleWrapSelection = useCallback(
    (before: string, after: string) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = markdown.slice(start, end) || "text"
      const newValue =
        markdown.slice(0, start) + before + selectedText + after + markdown.slice(end)

      setMarkdown(newValue, true)

      // Set cursor position around the selected text
      requestAnimationFrame(() => {
        textarea.focus()
        const newStart = start + before.length
        const newEnd = newStart + selectedText.length
        textarea.setSelectionRange(newStart, newEnd)
      })
    },
    [markdown, setMarkdown]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault()
            handleWrapSelection("**", "**")
            break
          case "i":
            e.preventDefault()
            handleWrapSelection("*", "*")
            break
          case "k":
            e.preventDefault()
            handleInsertComponent("[link text](https://example.com)")
            break
          case "`":
            e.preventDefault()
            handleWrapSelection("`", "`")
            break
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "y":
            e.preventDefault()
            redo()
            break
        }
      }
      if (e.key === "Tab") {
        e.preventDefault()
        handleInsertComponent("  ")
      }
    },
    [handleWrapSelection, handleInsertComponent, undo, redo]
  )

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === "split") {
        setViewMode("editor")
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [viewMode])

  return (
    <div className="bg-background flex h-screen flex-col">
      <EditorHeader
        charCount={stats.chars}
        hasContent={markdown.length > 0}
        lineCount={stats.lines}
        viewMode={viewMode}
        wordCount={stats.words}
        onViewModeChange={setViewMode}
      />

      <div className="border-border bg-toolbar-bg toolbar-scroll flex items-center gap-2 border-b px-2 py-1">
        <div className="shrink-0">
          <PlatformSelector
            platform={platform}
            onPlatformChange={(newPlatform) => {
              setPlatform(newPlatform)

              if (
                activeCategory !== "all" &&
                activeCategory !== "standard" &&
                activeCategory !== newPlatform
              ) {
                setActiveCategory("all")
              }
            }}
          />
        </div>
        <div className="bg-border h-5 w-px shrink-0" />
        <FormattingToolbar
          canRedo={canRedo}
          canUndo={canUndo}
          onInsert={handleInsertComponent}
          onRedo={redo}
          onUndo={undo}
          onWrap={handleWrapSelection}
        />
        <div className="flex-1" />
        <Button
          className="h-7 shrink-0 gap-1.5 px-2.5 text-xs"
          size="sm"
          variant={componentPanelOpen ? "secondary" : "ghost"}
          onClick={() => setComponentPanelOpen(!componentPanelOpen)}
        >
          <Blocks className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Components</span>
        </Button>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Editor */}
          {(viewMode === "split" || viewMode === "editor") && (
            <div
              className={`flex flex-col ${viewMode === "split" ? "border-border w-1/2 border-r" : "w-full"}`}
            >
              <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-1.5">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Editor
                </span>
                <span className="text-muted-foreground font-mono text-[10px]">Markdown</span>
              </div>
              <div className="relative flex-1 overflow-hidden">
                <textarea
                  ref={textareaRef}
                  aria-label="Markdown editor"
                  className="bg-editor-bg text-foreground placeholder:text-muted-foreground absolute inset-0 h-full w-full resize-none overflow-x-hidden overflow-y-auto p-4 font-mono text-sm leading-relaxed focus:outline-none md:p-6"
                  placeholder="Start writing markdown..."
                  spellCheck={false}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value, true)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {(viewMode === "split" || viewMode === "preview") && (
            <div className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"}`}>
              <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-1.5">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Preview
                </span>
                <span className="text-muted-foreground text-[10px] capitalize">
                  {platform} style
                </span>
              </div>
              <div className="bg-preview-bg flex-1 overflow-hidden">
                <MarkdownPreview ref={previewRef} content={markdown} platform={platform} />
              </div>
            </div>
          )}
        </div>

        {/* Component Panel - overlays on small screens, sidebar on large */}
        <ComponentPanel
          activeCategory={activeCategory}
          isOpen={componentPanelOpen}
          platform={platform}
          onCategoryChange={setActiveCategory}
          onClose={() => setComponentPanelOpen(false)}
          onInsert={handleInsertComponent}
        />
      </div>

      {/* Mobile stats bar */}
      <div className="border-border bg-toolbar-bg flex items-center justify-between border-t px-4 py-1.5 lg:hidden">
        <div className="text-muted-foreground flex items-center gap-3 text-[10px]">
          <span>{stats.words} words</span>
          <span>{stats.chars} chars</span>
          <span>{stats.lines} lines</span>
        </div>
        <span className="text-muted-foreground text-[10px] capitalize">{platform}</span>
      </div>
    </div>
  )
}
