// For actual use with theme prop from AppContext, replace ThemeCardPlaceholder with proper image.
import PropTypes from 'prop-types';
import themeCardPlaceholder from '../../assets/ThemeCardPlaceholder.png';
import { useNavigate } from 'react-router-dom';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? '';

function ThemeCard({ theme }) {
  const image = IMAGE_BASE_URL + theme.image;

  const navigate = useNavigate();

  const handleClick = () => {
    // Store the selected theme in localStorage or context for later use
    localStorage.setItem('selectedTheme', JSON.stringify(theme));

    // Navigate to the user input page
    navigate(`/user-info-input`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <img
        src={image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = themeCardPlaceholder;
        }}
        className="h-60 border-1 border-gray-300 mx-auto rounded-md shadow-md transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_2em_rgba(100,108,255,0.67))]"
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
};

export default ThemeCard;
