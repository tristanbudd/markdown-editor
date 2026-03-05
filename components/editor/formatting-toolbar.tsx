"use client"

import {
  Bold,
  CheckSquare,
  ChevronDown,
  Code,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LayoutGrid,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table,
  Type,
  Undo2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ToolbarButtonConfig {
  icon: React.ReactNode
  label: string
  shortcut?: string
}

interface ToolbarGroup {
  icon: React.ReactNode
  label: string
  items: ToolbarButtonConfig[]
}

// TODO: Implement toolbar button actions
// - Each button should insert corresponding markdown syntax at cursor position
// - Handle text selection (wrap selected text with formatting)
// - Support keyboard shortcuts (Ctrl+B for bold, etc.)
// - Connect Undo/Redo to editor history state
function ToolbarButton({ icon, label, shortcut }: ToolbarButtonConfig) {
  // TODO: Add onClick handler that inserts markdown syntax based on label
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="h-7 w-7 shrink-0" size="icon" variant="ghost">
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs" side="bottom">
        {label}
        {shortcut && <span className="text-muted-foreground ml-1.5">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  )
}

function ToolbarDropdown({ icon, label, items }: ToolbarGroup) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button className="h-7 shrink-0 gap-0.5 px-1.5" size="sm" variant="ghost">
              {icon}
              <ChevronDown className="h-3 w-3" />
              <span className="sr-only">{label}</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent className="text-xs" side="bottom">
          {label}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="min-w-[140px]">
        {items.map((item) => (
          // TODO: Add onClick handler to insert markdown syntax
          <DropdownMenuItem key={item.label} className="gap-2">
            {item.icon}
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="text-muted-foreground ml-auto text-xs">{item.shortcut}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function FormattingToolbar() {
  const historyButtons: ToolbarButtonConfig[] = [
    { icon: <Undo2 className="h-3.5 w-3.5" />, label: "Undo", shortcut: "Ctrl+Z" },
    { icon: <Redo2 className="h-3.5 w-3.5" />, label: "Redo", shortcut: "Ctrl+Y" },
  ]

  const headingItems: ToolbarButtonConfig[] = [
    { icon: <Heading1 className="h-4 w-4" />, label: "Heading 1" },
    { icon: <Heading2 className="h-4 w-4" />, label: "Heading 2" },
    { icon: <Heading3 className="h-4 w-4" />, label: "Heading 3" },
  ]

  const textItems: ToolbarButtonConfig[] = [
    { icon: <Bold className="h-4 w-4" />, label: "Bold", shortcut: "Ctrl+B" },
    { icon: <Italic className="h-4 w-4" />, label: "Italic", shortcut: "Ctrl+I" },
    { icon: <Strikethrough className="h-4 w-4" />, label: "Strikethrough" },
    { icon: <Code className="h-4 w-4" />, label: "Code", shortcut: "Ctrl+`" },
  ]

  const linkItems: ToolbarButtonConfig[] = [
    { icon: <Link className="h-4 w-4" />, label: "Link", shortcut: "Ctrl+K" },
    { icon: <ImageIcon className="h-4 w-4" />, label: "Image" },
  ]

  const listItems: ToolbarButtonConfig[] = [
    { icon: <List className="h-4 w-4" />, label: "Bullet List" },
    { icon: <ListOrdered className="h-4 w-4" />, label: "Numbered List" },
    { icon: <CheckSquare className="h-4 w-4" />, label: "Task List" },
  ]

  const blockItems: ToolbarButtonConfig[] = [
    { icon: <Quote className="h-4 w-4" />, label: "Blockquote" },
    { icon: <Table className="h-4 w-4" />, label: "Table" },
    { icon: <Minus className="h-4 w-4" />, label: "Divider" },
  ]

  return (
    <TooltipProvider delayDuration={300}>
      {/* Compact view - dropdowns (below lg) */}
      <div className="flex shrink-0 items-center gap-0.5 lg:hidden">
        {historyButtons.map((btn) => (
          <ToolbarButton key={btn.label} {...btn} />
        ))}
        <Separator className="mx-1 h-5" orientation="vertical" />
        <ToolbarDropdown
          icon={<Heading className="h-3.5 w-3.5" />}
          items={headingItems}
          label="Headings"
        />
        <ToolbarDropdown
          icon={<Type className="h-3.5 w-3.5" />}
          items={textItems}
          label="Text Formatting"
        />
        <ToolbarDropdown
          icon={<Link className="h-3.5 w-3.5" />}
          items={linkItems}
          label="Links & Media"
        />
        <ToolbarDropdown icon={<List className="h-3.5 w-3.5" />} items={listItems} label="Lists" />
        <ToolbarDropdown
          icon={<LayoutGrid className="h-3.5 w-3.5" />}
          items={blockItems}
          label="Blocks"
        />
      </div>

      {/* Full view - all buttons (lg and above) */}
      <div className="hidden shrink-0 items-center gap-0.5 lg:flex">
        {historyButtons.map((btn) => (
          <ToolbarButton key={btn.label} {...btn} />
        ))}
        <Separator className="mx-1 h-5" orientation="vertical" />
        {headingItems.map((btn) => (
          <ToolbarButton key={btn.label} icon={btn.icon} label={btn.label} />
        ))}
        <Separator className="mx-1 h-5" orientation="vertical" />
        {textItems.map((btn) => (
          <ToolbarButton key={btn.label} {...btn} />
        ))}
        <Separator className="mx-1 h-5" orientation="vertical" />
        {linkItems.map((btn) => (
          <ToolbarButton key={btn.label} {...btn} />
        ))}
        <Separator className="mx-1 h-5" orientation="vertical" />
        {listItems.map((btn) => (
          <ToolbarButton key={btn.label} {...btn} />
        ))}
        <Separator className="mx-1 h-5" orientation="vertical" />
        {blockItems.map((btn) => (
          <ToolbarButton key={btn.label} {...btn} />
        ))}
      </div>
    </TooltipProvider>
  )
}
