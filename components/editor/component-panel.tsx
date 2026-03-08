"use client"

import { useState } from "react"
import {
  Ampersand,
  Blocks,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Search,
  Slash,
  Strikethrough,
  Terminal,
  X,
} from "lucide-react"

import {
  getComponentsForPlatform,
  PLATFORM_COMPONENTS,
  type InsertableComponent,
  type PlatformStyleType,
} from "@/lib/markdown-components/index"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { type PlatformType } from "./platform-selector"

const iconMap: Record<string, React.ReactNode> = {
  "heading-1": <Heading1 className="h-3.5 w-3.5" />,
  "heading-2": <Heading2 className="h-3.5 w-3.5" />,
  "heading-3": <Heading3 className="h-3.5 w-3.5" />,
  "heading-4": <Heading4 className="h-3.5 w-3.5" />,
  "heading-5": <Heading5 className="h-3.5 w-3.5" />,
  "heading-6": <Heading6 className="h-3.5 w-3.5" />,
  bold: <Bold className="h-3.5 w-3.5" />,
  italic: <Italic className="h-3.5 w-3.5" />,
  strikethrough: <Strikethrough className="h-3.5 w-3.5" />,
  "inline-code": <Code className="h-3.5 w-3.5" />,
  link: <Link className="h-3.5 w-3.5" />,
  // eslint-disable-next-line
  image: <Image className="h-3.5 w-3.5" />,
  list: <List className="h-3.5 w-3.5" />,
  "list-ordered": <ListOrdered className="h-3.5 w-3.5" />,
  quote: <Quote className="h-3.5 w-3.5" />,
  horizontal_rule: <Minus className="h-3.5 w-3.5" />,
  ampersand: <Ampersand className="h-3.5 w-3.5" />,
  slash: <Slash className="h-3.5 w-3.5" />,
  terminal: <Terminal className="h-3.5 w-3.5" />,
  minus: <Minus className="h-3.5 w-3.5" />,
}

const categoryConfig: Record<PlatformStyleType, { label: string }> = {
  standard: { label: "Standard" },
  github: { label: "GitHub" },
  gitlab: { label: "GitLab" },
  bitbucket: { label: "Bitbucket" },
}

interface ComponentPanelProps {
  platform: PlatformType
  activeCategory: PlatformStyleType | "all"
  onCategoryChange: (category: PlatformStyleType | "all") => void
  onInsert: (template: string) => void
  isOpen: boolean
  onClose: () => void
}

export function ComponentPanel({
  platform,
  activeCategory,
  onCategoryChange,
  onInsert,
  isOpen,
  onClose,
}: ComponentPanelProps) {
  const [search, setSearch] = useState("")

  const allComponents = getComponentsForPlatform(platform).filter((c) => c.show !== false)

  const filteredComponents = allComponents.filter((comp) => {
    const matchesSearch =
      search === "" ||
      comp.label.toLowerCase().includes(search.toLowerCase()) ||
      comp.description.toLowerCase().includes(search.toLowerCase())

    if (activeCategory === "all") return matchesSearch

    // Check which category this component belongs to
    const isStandard = PLATFORM_COMPONENTS.standard.some((c) => c.id === comp.id)
    const isPlatformSpecific = PLATFORM_COMPONENTS[platform as PlatformStyleType]?.some(
      (c) => c.id === comp.id
    )

    if (activeCategory === "standard") return matchesSearch && isStandard
    if (activeCategory === platform) return matchesSearch && isPlatformSpecific

    return false
  })

  const platformCategories: PlatformStyleType[] = ["github", "gitlab", "bitbucket"]

  if (!isOpen) return null

  return (
    <div className="border-border bg-card absolute inset-y-0 right-0 z-10 flex h-full min-h-0 w-64 shrink-0 flex-col border-l shadow-lg lg:relative lg:shadow-none">
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <Blocks className="text-primary h-4 w-4" />
          <span className="text-foreground text-sm font-medium">Components</span>
        </div>
        <Button className="h-6 w-6" size="icon" variant="ghost" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="px-3 py-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            className="h-8 pl-8 text-xs"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border-border flex flex-wrap gap-1 border-b px-3 pb-2">
        <Button
          className="h-6 px-2 text-[10px]"
          size="sm"
          variant={activeCategory === "all" ? "secondary" : "ghost"}
          onClick={() => onCategoryChange("all")}
        >
          All
        </Button>
        <Button
          className="h-6 px-2 text-[10px]"
          size="sm"
          variant={activeCategory === "standard" ? "secondary" : "ghost"}
          onClick={() => onCategoryChange("standard")}
        >
          Standard
        </Button>
        {platformCategories.map((cat) => {
          const isCurrentPlatform = cat === platform
          return (
            <Button
              key={cat}
              className={`h-6 px-2 text-[10px] ${!isCurrentPlatform ? "opacity-40" : ""}`}
              disabled={!isCurrentPlatform}
              size="sm"
              variant={activeCategory === cat ? "secondary" : "ghost"}
              onClick={() => onCategoryChange(cat)}
            >
              {categoryConfig[cat]?.label || cat}
            </Button>
          )
        })}
      </div>

      <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 gap-1 p-2">
          <TooltipProvider delayDuration={200}>
            {filteredComponents.map((comp: InsertableComponent) => {
              const isStandard = PLATFORM_COMPONENTS.standard.some((c) => c.id === comp.id)
              const categoryLabel = isStandard
                ? "Standard"
                : categoryConfig[platform as PlatformStyleType]?.label

              return (
                <Tooltip key={comp.id}>
                  <TooltipTrigger asChild>
                    <button
                      className="hover:bg-accent group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors"
                      onClick={() => onInsert(comp.template)}
                    >
                      <div className="border-border bg-background text-muted-foreground group-hover:border-primary/30 group-hover:text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors">
                        {iconMap[comp.icon] || <Code className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground truncate text-xs font-medium">
                            {comp.label}
                          </span>
                          <Badge
                            className="shrink-0 px-1 py-0 text-[9px] font-normal"
                            variant="secondary"
                          >
                            {categoryLabel}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground truncate text-[10px]">
                          {comp.description}
                        </p>
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-50 text-xs" side="left">
                    <p className="font-medium">{comp.label}</p>
                    <p className="text-muted-foreground mt-0.5">{comp.description}</p>
                    <p className="text-muted-foreground mt-1 font-mono text-[10px]">
                      (Click to insert)
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
          {filteredComponents.length === 0 && (
            <div className="text-muted-foreground py-8 text-center text-xs">
              No components found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
