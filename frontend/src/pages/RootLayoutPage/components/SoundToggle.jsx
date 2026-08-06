import PropTypes from 'prop-types';

import { useAudioStore } from '$/stores/audioStore';

const BUTTON_CLASS =
  'flex items-center justify-center w-9 h-9 rounded-full bg-mist-100/70 text-ink-800 ' +
  'border border-mist-300 cursor-pointer transition-colors hover:bg-mist-200 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

// Small enough to read at 20px; drawn inline so there is no icon dependency
const MusicIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      d="M9 18V6l10-2v12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="6.5" cy="18" r="2.5" fill="currentColor" />
    <circle cx="16.5" cy="16" r="2.5" fill="currentColor" />
    {off && (
      <path
        d="M3 21L21 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const SpeakerIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
    {off ? (
      <path
        d="M16 9l5 6M21 9l-5 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    )}
  </svg>
);

MusicIcon.propTypes = { off: PropTypes.bool };
SpeakerIcon.propTypes = { off: PropTypes.bool };

/**
 * Ambient music and sound-effect switches for the header.
 *
 * Both are plain buttons rather than Gestalt IconButtons: the two states need
 * a struck-through variant of the same glyph, which the Gestalt icon set does
 * not carry, and this keeps the pair visually identical.
 */
function SoundToggle() {
  const musicEnabled = useAudioStore((state) => state.musicEnabled);
  const sfxEnabled = useAudioStore((state) => state.sfxEnabled);
  const toggleMusic = useAudioStore((state) => state.toggleMusic);
  const toggleSfx = useAudioStore((state) => state.toggleSfx);

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={BUTTON_CLASS}
        onClick={toggleMusic}
        aria-pressed={musicEnabled}
        aria-label={
          musicEnabled
            ? 'Turn background music off'
            : 'Turn background music on'
        }
        title={musicEnabled ? 'Music on' : 'Music off'}
      >
        <MusicIcon off={!musicEnabled} />
      </button>
      <button
        type="button"
        className={BUTTON_CLASS}
        onClick={toggleSfx}
        aria-pressed={sfxEnabled}
        aria-label={
          sfxEnabled ? 'Turn sound effects off' : 'Turn sound effects on'
        }
        title={sfxEnabled ? 'Sound effects on' : 'Sound effects off'}
      >
        <SpeakerIcon off={!sfxEnabled} />
      </button>
    </div>
  );
}

export default SoundToggle;
