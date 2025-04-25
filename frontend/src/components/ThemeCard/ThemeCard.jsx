// For actual use with theme prop from AppContext, replace ThemeCardPlaceholder with proper image.
import PropTypes from 'prop-types';
import themeCardPlaceholder from '../../assets/ThemeCardPlaceholder.png';
import { useNavigate } from 'react-router-dom';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL ?? '';

function ThemeCard({ theme }) {
  const image = IMAGE_BASE_URL + theme.image;

  const navigate = useNavigate();

  const handleClick = () => {
    // Post API to come;

    // Change route name accordingly.
    navigate(`/user-info-input`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <img
        // TODO: Change themeCardPlaceholder accordingly
        // TODO: once proper "image" exists, uncomment line 24 and delete line 27~31.
        // src={image || themeCardPlaceholder}

        // This is for ESLint, husky, commit passing only...
        src={image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = themeCardPlaceholder;
        }}
        className="h-60 border-1 border-gray-300 mx-auto rounded-md shadow-md transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_2em_rgba(100,108,255,0.67))]"
        alt="Theme card"
      />
    </div>
  );
}

ThemeCard.propTypes = {
  theme: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default ThemeCard;
