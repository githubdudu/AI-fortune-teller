/**
 * Which of Sugar Crystal's four stones stands for each fortune theme.
 *
 * The stones are matched in lightness (see the `@theme` block in index.css), so
 * they encode *which* and never *how important* — that is what makes them safe
 * to hang on a theme's identity. The colour then follows the reading all the
 * way through: theme card -> description -> the interpretation on FortunePage.
 *
 * Eight themes over four stones, paired by what the themes are about:
 *
 *   quartz     love, relationships     people and feeling
 *   citrine    finance, career         worldly achievement
 *   celestine  travel, decisions       outward, forward
 *   amethyst   general, health         inward — and the closest to the app's
 *                                      own hue, so the two least specific
 *                                      themes read as the neutral default
 *
 * Colour lives here rather than on the Theme entity in the backend: it is a
 * presentation choice, and the API's themes are matched by name below just
 * like the hardcoded fallback in ThemeView.jsx.
 */

const STONE_FOR_THEME = {
  love: 'quartz',
  relationships: 'quartz',
  finance: 'citrine',
  career: 'citrine',
  travel: 'celestine',
  decisions: 'celestine',
  general: 'amethyst',
  health: 'amethyst',
};

/**
 * Full class strings, never interpolated.
 *
 * Tailwind scans source text for literal class names; a template literal like
 * `inset-ring-${stone}` compiles to nothing at all and fails silently, with no
 * build error and no missing-token warning. Every class a stone can produce
 * therefore has to appear verbatim somewhere in this file.
 *
 * `ring` uses the pale stone — it sits on the card artwork, where a pale
 * hairline reads as a frame. `edge` uses the deep counterpart, because a pale
 * stone on a `veil` or `bg` surface is very nearly invisible.
 */
const STONE_CLASSES = {
  quartz: { ring: 'inset-ring-quartz ring-quartz', edge: 'border-quartz-deep' },
  citrine: {
    ring: 'inset-ring-citrine ring-citrine',
    edge: 'border-citrine-deep',
  },
  celestine: {
    ring: 'inset-ring-celestine ring-celestine',
    edge: 'border-celestine-deep',
  },
  amethyst: {
    ring: 'inset-ring-amethyst ring-amethyst',
    edge: 'border-amethyst-deep',
  },
};

// Amethyst is the fallback: it is the stone nearest the palette's own hue, so
// an unmapped theme — a new one from the API, or ThemeView's "Explore the
// themes" placeholder — reads as unaccented rather than as a wrong accent.
const FALLBACK = 'amethyst';

/** @returns {{ring: string, edge: string}} class strings for a theme's stone. */
export function stoneClasses(themeName) {
  return STONE_CLASSES[STONE_FOR_THEME[themeName] ?? FALLBACK];
}

export { STONE_FOR_THEME };
