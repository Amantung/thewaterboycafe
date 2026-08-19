/**
 * Route-transition fallback. Deliberately quiet — a full skeleton flashing
 * between fast server-rendered pages is more distracting than a still frame.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60svh] items-center justify-center bg-linen"
    >
      <span className="sr-only">Loading</span>
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-beige-strong border-t-clay"
      />
    </div>
  )
}
