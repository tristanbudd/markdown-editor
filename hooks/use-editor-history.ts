"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * @file use-editor-history.ts
 * @description Custom hook that manages undo/redo history for the editor content.
 * Immediate changes (e.g. toolbar inserts) are committed to history straight away,
 * while typed changes are debounced so rapid keystrokes don't flood the history stack.
 */

interface HistoryState {
  past: string[]
  present: string
  future: string[]
}

export function useEditorHistory(initialValue: string) {
  const [state, setState] = useState<HistoryState>({
    past: [],
    present: initialValue,
    future: [],
  })

  // Holds the debounce timer for non-immediate history commits
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Tracks the last value that was committed to history, used to avoid
  // creating duplicate entries when the debounce fires with no new changes
  const lastSavedRef = useRef(initialValue)

  // Clear any pending debounce timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const set = useCallback((newValue: string, immediate = false) => {
    if (immediate) {
      // Bypass the debounce and commit directly to history (e.g. toolbar actions)
      setState((prev) => ({
        past: [...prev.past, prev.present].slice(-100),
        present: newValue,
        future: [],
      }))
      lastSavedRef.current = newValue
      return
    }

    // Update the visible content immediately so the editor stays responsive
    setState((prev) => ({
      ...prev,
      present: newValue,
    }))

    // Debounce the history commit - only save to past after 500ms of inactivity
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setState((prev) => {
        // Skip if nothing has changed since the last commit
        if (lastSavedRef.current === prev.present) return prev
        lastSavedRef.current = prev.present
        return {
          past: [...prev.past, lastSavedRef.current].slice(-100),
          present: prev.present,
          future: [],
        }
      })
    }, 500)
  }, [])

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev
      const previous = prev.past[prev.past.length - 1]
      const newPast = prev.past.slice(0, prev.past.length - 1)
      lastSavedRef.current = previous
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev
      const next = prev.future[0]
      const newFuture = prev.future.slice(1)
      lastSavedRef.current = next
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      }
    })
  }, [])

  return {
    value: state.present,
    set,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  }
}
