"use client"

import { useRef, useState } from "react"
import {
  ClipboardType,
  Columns2,
  Download,
  FileCode,
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

const ALLOWED_EXTENSIONS = [".md", ".txt"]

const BLOCKED_MIME_PREFIXES = [
  "image/",
  "video/",
  "audio/",
  "application/zip",
  "application/x-rar",
  "application/gzip",
  "application/pdf",
  "application/octet-stream",
  "application/x-executable",
  "application/wasm",
]

interface EditorHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  hasContent: boolean
  wordCount: number
  charCount: number
  lineCount: number
  onExportMarkdown: () => void
  onImportFile: (content: string) => void
  onExportRaw: () => void
}

export function EditorHeader({
  viewMode,
  hasContent,
  wordCount,
  charCount,
  lineCount,
  onViewModeChange,
  onExportRaw,
  onExportMarkdown,
  onImportFile,
}: EditorHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMsg, setDialogMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function showDialog(msg: string) {
    setDialogMsg(msg)
    setDialogOpen(true)
  }

  function handleImportClick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    // Check MIME type
    if (file.type && BLOCKED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
      showDialog(`Cannot import "${file.name}". This file type (${file.type}) is not a text file.`)
      return
    }

    // Check extension
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    const hasKnownExt = ALLOWED_EXTENSIONS.includes(ext)

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showDialog("File is too large. Maximum size is 5MB.")
      return
    }

    // If there is content, ask for confirmation
    if (hasContent) {
      setPendingFile(file)
      setConfirmOpen(true)
      return
    }
    importFile(file, hasKnownExt)
  }

  function importFile(file: File, hasKnownExt: boolean) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text !== "string") {
        showDialog("Could not read file contents.")
        return
      }
      const nullByteCount = (text.match(/\0/g) || []).length
      if (nullByteCount > 0) {
        showDialog(
          `Cannot import "${file.name}". This appears to be a binary file, not a text file.`
        )
        return
      }
      const nonPrintable = text.replace(/[\x20-\x7E\t\n\r\u00A0-\uFFFF]/g, "")
      if (text.length > 0 && nonPrintable.length / text.length > 0.1) {
        showDialog(
          `Cannot import "${file.name}". This file contains too many non-printable characters and doesn't appear to be text.`
        )
        return
      }
      if (!hasKnownExt && !file.type.startsWith("text/")) {
        const proceed = confirm(
          `"${file.name}" has an unrecognized extension. The content looks like text. Import anyway?`
        )
        if (!proceed) return
      }
      onImportFile(text)
    }
    reader.onerror = () => {
      showDialog("Failed to read the file.")
    }
    reader.readAsText(file)
  }

  function handleDialogAction() {
    if (pendingFile) {
      const ext = "." + pendingFile.name.split(".").pop()?.toLowerCase()
      const hasKnownExt = ALLOWED_EXTENSIONS.includes(ext)
      importFile(pendingFile, hasKnownExt)
    }
    setPendingFile(null)
    setConfirmOpen(false)
  }

  function handleDialogCancel() {
    setPendingFile(null)
    setConfirmOpen(false)
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

          {/* File input - hidden, triggered by Import button */}
          <input
            ref={fileInputRef}
            accept=".md,.txt"
            aria-label="Import file"
            className="hidden"
            type="file"
            onChange={handleImportClick}
          />

          {/* Import/Export buttons - 420px and above */}
          <Button
            className="hidden h-8 gap-1.5 text-xs min-[420px]:flex"
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
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
              <DropdownMenuItem className="gap-2" onClick={onExportMarkdown}>
                <FileCode className="h-4 w-4" />
                Markdown (.md)
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={onExportRaw}>
                <ClipboardType className="h-4 w-4" />
                Export Raw
              </DropdownMenuItem>
              {/*<DropdownMenuSeparator />*/}
              {/* TODO: Add HTML & PDF Export Options */}
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
              <DropdownMenuItem className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <FileUp className="h-4 w-4" />
                Import
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2" onClick={onExportMarkdown}>
                <FileCode className="h-4 w-4" />
                Export Markdown
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={onExportRaw}>
                <ClipboardType className="h-4 w-4" />
                Export Raw
              </DropdownMenuItem>
              {/* TODO: Add HTML & PDF Export Options */}
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
            <AlertDialogCancel onClick={handleDialogCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDialogAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error AlertDialog for import failures */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Failed</AlertDialogTitle>
            <AlertDialogDescription>{dialogMsg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialogOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
