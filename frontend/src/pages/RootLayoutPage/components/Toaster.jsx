import { Toaster as SonnerToaster } from 'sonner';

/**
 * App-wide toast host. Mounted once in RootLayoutPage; fire toasts from
 * anywhere with `import { toast } from 'sonner'`.
 *
 * Colours are wired to the ink/mist ramps in index.css rather than sonner's
 * defaults. `richColors` is required for the per-type vars (--error-*,
 * --success-*, ...) to apply at all — without it every toast falls back to
 * --normal-*. Contrast of each pairing below is >= 8.7:1.
 */
function Toaster(props) {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      style={{
        // default toast: brand dark on light text
        '--normal-bg': 'var(--color-ink-900)',
        '--normal-text': 'var(--color-mist-50)',
        '--normal-border': 'var(--color-ink-700)',

        // success — figma-green, 12.95:1
        '--success-bg': 'var(--color-figma-green)',
        '--success-text': 'var(--color-ink-900)',
        '--success-border': 'var(--color-ink-700)',

        // error — figma-red, 8.74:1
        '--error-bg': 'var(--color-figma-red)',
        '--error-text': 'var(--color-ink-900)',
        '--error-border': 'var(--color-ink-700)',

        // warning — figma-yellow, 12.45:1
        '--warning-bg': 'var(--color-figma-yellow)',
        '--warning-text': 'var(--color-ink-900)',
        '--warning-border': 'var(--color-ink-700)',

        // info — figma-pink, 10.76:1
        '--info-bg': 'var(--color-figma-pink)',
        '--info-text': 'var(--color-ink-900)',
        '--info-border': 'var(--color-ink-700)',

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
