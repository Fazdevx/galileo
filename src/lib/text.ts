/** Utilidades de texto compartidas por el cliente. */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escapa HTML. Necesario porque varias vistas arman markup con template
 * strings a partir de datos que escribe una persona desde el panel.
 */
export function esc(valor: unknown): string {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}
