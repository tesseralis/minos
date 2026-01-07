import type { Attachment } from "svelte/attachments"

/**
 * Fires only when clicking and not on drag.
 */
export default function onClickOnly(onClick: () => void): Attachment {
  return (el) => {
    let dragged = false

    const handlers = {
      pointerdown() {
        dragged = false
      },
      pointermove() {
        dragged = true
      },
      pointerup() {
        if (!dragged) {
          onClick()
        }
      },
      keydown(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          onClick()
        }
      },
    }
    for (const [name, callback] of Object.entries(handlers)) {
      el.addEventListener(name as any, callback)
    }
    return () => {
      for (const [name, callback] of Object.entries(handlers)) {
        el.removeEventListener(name as any, callback)
      }
    }
  }
}
