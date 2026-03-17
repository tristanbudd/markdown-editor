/**
 * @file use-mobile.ts
 * @description Hook that returns true when the viewport is narrower than the mobile breakpoint.
 * Responds to resize events via matchMedia rather than polling.
 */

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialised as undefined to distinguish "not yet measured" from a known false
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Coerce undefined (pre-measurement) to false so callers always receive a boolean
  return !!isMobile
}
