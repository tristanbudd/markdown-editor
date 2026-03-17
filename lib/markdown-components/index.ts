/**
 * @file index.ts
 * @description Public API for the markdown-components module. Exports shared types,
 * per-platform component lists, and the helper for resolving components by platform.
 */

import { BITBUCKET_COMPONENTS } from "./bitbucket"
import { GITHUB_COMPONENTS } from "./github"
import { GITLAB_COMPONENTS } from "./gitlab"
import { STANDARD_COMPONENTS } from "./standard"

export { HEADING_STYLES, PARAGRAPH_STYLE, type HeadingLevel } from "./styles"

export interface InsertableComponent {
  id: string
  label: string
  description: string
  icon: string
  template: string
  /** Defaults to true. Set to false to hide from the component panel. */
  show?: boolean
}

export type PlatformStyleType = "standard" | "github" | "gitlab" | "bitbucket"

export { STANDARD_COMPONENTS, GITHUB_COMPONENTS, GITLAB_COMPONENTS, BITBUCKET_COMPONENTS }

/** Maps each platform to its list of platform-specific insertable components. */
export const PLATFORM_COMPONENTS: Record<PlatformStyleType, InsertableComponent[]> = {
  standard: STANDARD_COMPONENTS,
  github: GITHUB_COMPONENTS,
  gitlab: GITLAB_COMPONENTS,
  bitbucket: BITBUCKET_COMPONENTS,
}

/**
 * Returns the full component list for a given platform - standard components
 * plus any platform-specific additions. Returns only standard components
 * when platform is "standard" to avoid duplication.
 */
const COMBINED_CACHE: Partial<Record<PlatformStyleType, InsertableComponent[]>> = {}

export function getComponentsForPlatform(platform: string): InsertableComponent[] {
  if (platform === "standard") return STANDARD_COMPONENTS
  const key = platform as PlatformStyleType
  if (!COMBINED_CACHE[key]) {
    COMBINED_CACHE[key] = [...STANDARD_COMPONENTS, ...(PLATFORM_COMPONENTS[key] || [])]
  }
  return COMBINED_CACHE[key]!
}
