import { BITBUCKET_COMPONENTS } from "./bitbucket"
import { GITHUB_COMPONENTS } from "./github"
import { GITLAB_COMPONENTS } from "./gitlab"
import { SHARED_COMPONENTS } from "./shared"
import { STANDARD_COMPONENTS } from "./standard"

export { HEADING_STYLES, PARAGRAPH_STYLE, type HeadingLevel } from "./styles"

export interface InsertableComponent {
  id: string
  label: string
  description: string
  icon: string
  template: string
  show?: boolean // defaults to true, set to false to hide from component panel
}

export type PlatformStyleType = "shared" | "standard" | "github" | "gitlab" | "bitbucket"

export {
  SHARED_COMPONENTS,
  STANDARD_COMPONENTS,
  GITHUB_COMPONENTS,
  GITLAB_COMPONENTS,
  BITBUCKET_COMPONENTS,
}

export const PLATFORM_COMPONENTS: Record<PlatformStyleType, InsertableComponent[]> = {
  shared: SHARED_COMPONENTS,
  standard: STANDARD_COMPONENTS,
  github: GITHUB_COMPONENTS,
  gitlab: GITLAB_COMPONENTS,
  bitbucket: BITBUCKET_COMPONENTS,
}

export function getComponentsForPlatform(platform: string): InsertableComponent[] {
  const shared = SHARED_COMPONENTS
  const platformSpecific = PLATFORM_COMPONENTS[platform as PlatformStyleType] || []
  return [...shared, ...platformSpecific]
}
