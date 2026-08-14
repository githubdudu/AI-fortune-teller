import { Toaster as SonnerToaster } from 'sonner';

/**
 * App-wide toast host. Mounted once in RootLayoutPage; fire toasts from
 * anywhere with `import { toast } from 'sonner'`.
 *
 * Colours come from the Sugar Crystal tokens in index.css, not sonner's
 * defaults. All five types share one formula — a wash of the status colour
 * over the page ground, ink copy, and the status colour itself as the border —
 * so type reads from hue rather than from an inverted normal toast.
 *
 * `richColors` is required for the per-type vars (--error-*, --success-*, ...)
 * to apply at all; without it every toast falls back to --normal-*.
 */
const wash = (token) =>
  `color-mix(in oklab, var(${token}) 18%, var(--color-bg))`;

function Toaster(props) {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      style={{
        '--normal-bg': wash('--color-core'),
        '--normal-text': 'var(--color-ink)',
        '--normal-border': 'var(--color-core)',

        '--success-bg': wash('--color-success'),
        '--success-text': 'var(--color-ink)',
        '--success-border': 'var(--color-success)',

        '--error-bg': wash('--color-danger'),
        '--error-text': 'var(--color-ink)',
        '--error-border': 'var(--color-danger)',

        '--warning-bg': wash('--color-warning'),
        '--warning-text': 'var(--color-ink)',
        '--warning-border': 'var(--color-warning)',

        '--info-bg': wash('--color-info'),
        '--info-text': 'var(--color-ink)',
        '--info-border': 'var(--color-info)',

        '--border-radius': '0.75rem',
      }}
      toastOptions={{
        className: 'font-cormorant',
      }}
      {...props}
    />
  );
}

export { Toaster };
