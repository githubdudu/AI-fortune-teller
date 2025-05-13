// For actual use with theme prop from AppContext, replace ThemeCardPlaceholder with proper image.
import PropTypes from 'prop-types';
import themeCardPlaceholder from '../../assets/ThemeCardPlaceholder.png';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContextProvider';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? '';

function ThemeCard({ theme, onHover, disabled = false }) {
  const image = IMAGE_BASE_URL + theme.image;

  const { saveUserChosenTheme, clearQuestionAndTheme, saveUserChosenCards } =
    useContext(AppContext);

  const navigate = useNavigate();

  const handleClick = () => {
    // If there is a API error at input page, do not allow to click on theme card
    if (disabled) return;
    // Clear the user question and theme from context
    clearQuestionAndTheme();
    saveUserChosenCards(null);
    // Store the selected theme in context for later use
    saveUserChosenTheme(theme);

    // Navigate to the user input page
    navigate(`/fortune`);
  };

  const handleMouseEnter = () => {
    // Call the onHover prop function with the current theme
    if (onHover) {
      onHover(theme);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className="cursor-pointer w-full flex justify-center py-12"
    >
      <img
        src={image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = themeCardPlaceholder;
        }}
        className="h-60 object-contain border-1 border-gray-300 rounded-md shadow-lg transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_1.5em_rgba(100,108,255,0.67))]"
        alt={`${theme.name} theme card`}
      />
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
