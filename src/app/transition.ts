interface TransOptions {
  /** Transition duration in milliseconds */
  duration: number
  onUpdate(val: number): void
}

/**
 * Represents an animated transition between 0 and 1.
 */
export default function transition({ duration, onUpdate }: TransOptions) {
  let start = 0
  const id: { current?: number } = {}
  // Adapted from:
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  const step = (timestamp: number) => {
    if (!start) {
      start = timestamp
    }
    const delta = timestamp - start
    const progress = Math.min(delta / duration, 1)
    const currentValue = progress
    onUpdate(currentValue)
    if (delta < duration) {
      id.current = requestAnimationFrame(step)
    }
  }
  id.current = requestAnimationFrame(step)
  return {
    cancel() {
      cancelAnimationFrame(id.current!)
    },
  }
}
