"use client"

import { useState } from "react"
import {
  Columns2,
  Download,
  FileCode,
  FileDown,
  FileText,
  FileUp,
  Menu,
  Moon,
  PanelLeft,
  PanelRight,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import { FaMarkdown } from "react-icons/fa"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ViewMode = "split" | "editor" | "preview"

interface EditorHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  hasContent: boolean
  wordCount: number
  charCount: number
  lineCount: number
}

export function EditorHeader({
  viewMode,
  onViewModeChange,
  hasContent,
  wordCount,
  charCount,
  lineCount,
}: EditorHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [confirmOpen, setConfirmOpen] = useState(false)

  // TODO: Implement file import functionality
  // - Accept .md, .txt, .markdown files
  // - Read file contents and parse as markdown
  // - Validate file size limits
  // - Handle encoding issues (UTF-8)
  function handleImportClick() {
    if (hasContent) {
      setConfirmOpen(true)
    }
  }

  return (
    <>
      <header className="border-border bg-toolbar-bg flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2"
            type="button"
            onClick={() => window.location.reload()}
          >
            <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-md">
              <FaMarkdown className="text-primary-foreground h-4 w-4" />
            </div>
            <h1 className="text-foreground text-base font-semibold tracking-tight">
              Markdown Editor
            </h1>
          </button>

          {/* View mode buttons - desktop (with split option, 768px+) */}
          <div className="border-border bg-background hidden items-center gap-1 rounded-md border p-0.5 md:flex">
            <Button
              className="h-7 gap-1.5 px-2.5 text-xs"
              size="sm"
              variant={viewMode === "editor" ? "secondary" : "ghost"}
              onClick={() => onViewModeChange("editor")}
            >
              <PanelLeft className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Editor</span>
            </Button>
            <Button
              className="h-7 gap-1.5 px-2.5 text-xs"
              size="sm"
              variant={viewMode === "split" ? "secondary" : "ghost"}
              onClick={() => onViewModeChange("split")}
            >
              <Columns2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Split</span>
            </Button>
            <Button
              className="h-7 gap-1.5 px-2.5 text-xs"
              size="sm"
              variant={viewMode === "preview" ? "secondary" : "ghost"}
              onClick={() => onViewModeChange("preview")}
            >
              <PanelRight className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Preview</span>
            </Button>
          </div>

          {/* View mode buttons - mobile (no split option, below 768px) */}
          <div className="border-border bg-background flex items-center gap-1 rounded-md border p-0.5 md:hidden">
            <Button
              className="h-7 gap-1.5 px-2.5 text-xs max-[511px]:w-7 max-[511px]:px-0 min-[512px]:px-2.5"
              size="sm"
              variant={viewMode === "editor" || viewMode === "split" ? "secondary" : "ghost"}
              onClick={() => onViewModeChange("editor")}
            >
              <PanelLeft className="h-3.5 w-3.5" />
              <span className="hidden min-[512px]:inline">Editor</span>
            </Button>
            <Button
              className="h-7 gap-1.5 px-2.5 text-xs max-[511px]:w-7 max-[511px]:px-0 min-[512px]:px-2.5"
              size="sm"
              variant={viewMode === "preview" ? "secondary" : "ghost"}
              onClick={() => onViewModeChange("preview")}
            >
              <PanelRight className="h-3.5 w-3.5" />
              <span className="hidden min-[512px]:inline">Preview</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stats - hidden on mobile */}
          <div className="text-muted-foreground mr-2 hidden items-center gap-3 text-xs lg:flex">
            <span>{wordCount} words</span>
            <span className="text-border">|</span>
            <span>{charCount} chars</span>
            <span className="text-border">|</span>
            <span>{lineCount} lines</span>
          </div>

          {/* Import/Export buttons - 420px and above */}
          <Button
            className="hidden h-8 gap-1.5 text-xs min-[420px]:flex"
            size="sm"
            variant="outline"
            onClick={handleImportClick}
          >
            <FileUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="hidden h-8 gap-1.5 text-xs min-[420px]:flex"
                size="sm"
                variant="outline"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* TODO: Implement export to Markdown - download raw .md file */}
              <DropdownMenuItem className="gap-2">
                <FileCode className="h-4 w-4" />
                Markdown (.md)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* TODO: Implement export to HTML - convert markdown to HTML and download */}
              <DropdownMenuItem className="gap-2">
                <FileText className="h-4 w-4" />
                HTML (.html)
              </DropdownMenuItem>
              {/* TODO: Implement export to PDF - convert to PDF and download */}
              <DropdownMenuItem className="gap-2">
                <FileDown className="h-4 w-4" />
                PDF (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Combined File menu - below 420px */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex h-8 w-8 min-[420px]:hidden" size="icon" variant="outline">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2" onClick={handleImportClick}>
                <FileUp className="h-4 w-4" />
                Import
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* TODO: Implement export to Markdown */}
              <DropdownMenuItem className="gap-2">
                <FileCode className="h-4 w-4" />
                Export Markdown
              </DropdownMenuItem>
              {/* TODO: Implement export to HTML */}
              <DropdownMenuItem className="gap-2">
                <FileText className="h-4 w-4" />
                Export HTML
              </DropdownMenuItem>
              {/* TODO: Implement export to PDF */}
              <DropdownMenuItem className="gap-2">
                <FileDown className="h-4 w-4" />
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            className="h-8 w-8"
            size="icon"
            title="Toggle theme"
            variant="ghost"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      {/* Import Warning Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace Content?</AlertDialogTitle>
            <AlertDialogDescription>
              You have existing content. Importing will replace it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* TODO: Implement continue action - trigger file picker and replace content */}
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
