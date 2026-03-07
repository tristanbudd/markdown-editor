"use client"

import { useCallback, useRef, useState } from "react"

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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef(initialValue)

  const set = useCallback((newValue: string, immediate = false) => {
    if (immediate) {
      setState((prev) => ({
        past: [...prev.past, prev.present].slice(-100),
        present: newValue,
        future: [],
      }))
      lastSavedRef.current = newValue
      return
    }

    setState((prev) => ({
      ...prev,
      present: newValue,
    }))

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setState((prev) => {
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
