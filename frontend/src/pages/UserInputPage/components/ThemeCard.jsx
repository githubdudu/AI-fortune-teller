// For actual use with theme prop from AppContext, replace ThemeCardPlaceholder with proper image.
import PropTypes from 'prop-types';
import themeCardPlaceholder from '$/assets/ThemeCardPlaceholder.png';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '$/context/AppContextProvider';
import useSound from '$/hooks/useAudio';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? '';

function ThemeCard({ theme, onHover, disabled = false }) {
  const image = IMAGE_BASE_URL + theme.image;

  const { saveUserChosenTheme, saveUserPrompt } = useContext(AppContext);

  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  // Cached images can finish loading before React attaches onLoad
  useEffect(() => {
    if (imgRef.current?.complete) setIsLoaded(true);
  }, []);

  const navigate = useNavigate();
  const playSound = useSound();

  const handleClick = () => {
    // If there is a API error at input page, do not allow to click on theme card
    if (disabled) return;
    // so drop any question left over from an earlier reading.
    saveUserPrompt('');
    // Store the selected theme in context for later use
    saveUserChosenTheme(theme);

    // Navigate to the user input page
    navigate(`/fortune`);
  };

  const handleMouseEnter = () => {
    // Silent while disabled, matching handleClick: a card that cannot be
    // picked should not answer the cursor as though it could.
    if (!disabled) playSound('hover');

    // Call the onHover prop function with the current theme
    if (onHover) {
      onHover(theme);
    }
  };

  return (
    <div className="`w-full flex justify-center pt-2 pb-8">
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`cursor-pointer relative h-60 w-[135px] shrink-0 rounded-md shadow-[0_2px_15px] shadow-ink/25 hover:ring-spark hover:ring-2 ${
          isLoaded ? '' : 'bg-bloom'
        }`}
      >
        <img
          ref={imgRef}
          src={image}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = themeCardPlaceholder;
            setIsLoaded(true);
          }}
          className={`h-full w-full object-cover rounded-md transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          alt={`${theme.name} theme card`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-ring-1 inset-ring-citrine inset-0 rounded-md"
        />
      </div>
    </div>
  );
}

ThemeCard.propTypes = {
  theme: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onHover: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ThemeCard;
