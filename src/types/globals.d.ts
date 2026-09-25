/**
 * Globals provided by static scripts in /public/js.
 * They are loaded with <script src="..." is:inline> so they are not bundled
 * by Vite and therefore invisible to TypeScript.
 */

/** Returns an inline SVG string for a named icon. Defined in public/js/icons.js */
declare function faIcon(name: string, size?: number, className?: string): string;

interface DialogOptions {
  /** Container carrying role="dialog" aria-modal="true". */
  root: HTMLElement;
  /** Custom close handler, e.g. one that plays an exit animation. */
  close?: () => void;
  /** Element to focus on open; defaults to the first focusable child. */
  initialFocus?: string | HTMLElement | null;
}

interface DialogHandle {
  open(): void;
  /** Runs the custom close handler when provided, then unhooks. */
  close(): void;
  /** Unhook listener and restore scroll/focus without changing visibility. */
  destroy(): void;
}

interface Window {
  faIcon: (name: string, size?: number, className?: string) => string;
  createDialog: (opts: DialogOptions) => DialogHandle;
}
