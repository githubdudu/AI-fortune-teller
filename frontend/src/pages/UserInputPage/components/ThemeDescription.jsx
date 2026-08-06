import PropTypes from 'prop-types';
import { stoneClasses } from '$/constants/themeStone';

function ThemeDescription({ theme }) {
  const formattedThemeName =
    theme.name.charAt(0).toUpperCase() + theme.name.slice(1);
  return (
    <>
      {/* The top edge carries the hovered theme's stone — the same colour as
          that card's frame, so the description is visibly *about* that card. */}
      <div
        className={`max-w-2xl overflow-hidden shadow-md rounded-lg bg-veil border-t-4 ${stoneClasses(theme.name).edge}`}
      >
        <div className="px-2 py-2">
          <div className="flex flex-col items-stretch gap-1 px-4">
            <div className="text-ink font-bold text-xl text-center">
              {formattedThemeName} Theme
            </div>
            <hr className="border-ink/15 block w-full" />
            <p className="text-ink text-base overflow-hidden text-ellipsis line-clamp-3">
              {theme.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

ThemeDescription.propTypes = {
  theme: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default ThemeDescription;
