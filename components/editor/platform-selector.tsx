"use client"

import { Check, ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

// TODO: Add Bitbucket markdown styles
export type PlatformType = "standard" | "github" | "gitlab" | "bitbucket"

interface Platform {
  id: PlatformType
  name: string
  description: string
  disabled?: boolean
}

const PLATFORMS: Platform[] = [
  {
    id: "standard",
    name: "Standard",
    description: "CommonMark standard",
  },
  {
    id: "github",
    name: "GitHub",
    description: "GitHub Markdown Style",
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "GitLab Markdown Style",
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    description: "Bitbucket Markdown",
    disabled: true,
  },
]

interface PlatformSelectorProps {
  platform: PlatformType
  onPlatformChange: (platform: PlatformType) => void
}

export function PlatformSelector({ platform, onPlatformChange }: PlatformSelectorProps) {
  const current = PLATFORMS.find((p) => p.id === platform)!

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 gap-1.5 text-xs font-medium" size="sm" variant="outline">
          {current.name}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        <div className="p-3 pb-2">
          <p className="text-foreground text-sm font-medium">Platform Style</p>
          <p className="text-muted-foreground text-xs">Choose markdown style</p>
        </div>
        <Separator />
        <div className="p-1.5">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              className={`hover:bg-accent flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                platform === p.id ? "bg-accent" : ""
              }`}
              disabled={p.disabled}
              onClick={() => onPlatformChange(p.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-sm font-medium">{p.name}</span>
                  {platform === p.id && <Check className="text-primary h-3.5 w-3.5" />}
                  {p.disabled && <Badge variant="secondary">Coming Soon</Badge>}
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
