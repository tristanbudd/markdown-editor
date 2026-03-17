/**
 * @file page.tsx
 * @description Root page ("/"). Renders the editor, or a fallback message on viewports narrower than 350px.
 */

import { Monitor } from "lucide-react"

import { MarkdownEditor } from "@/components/editor/markdown-editor"

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      {/* Unsupported screen size message - below 350px */}
      <div className="bg-background text-foreground flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center max-[349px]:flex min-[350px]:hidden">
        <Monitor className="text-foreground h-12 w-12" />
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Unsupported Screen Size</h1>
          <p className="text-muted-foreground text-sm">
            Please use a device with a larger screen to access the editor.
          </p>
        </div>
      </div>

      {/* Main content - 350px and above */}
      <div className="hidden h-full w-full min-[350px]:block">
        <MarkdownEditor />
      </div>
    </main>
  )
}
