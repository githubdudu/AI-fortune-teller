import PropTypes from 'prop-types';

function ThemeDescription({ theme }) {
  const formattedThemeName =
    theme.name.charAt(0).toUpperCase() + theme.name.slice(1);
  return (
    <>
      <div
        className="max-w-2xl overflow-hidden shadow-md"
        style={{ backgroundColor: '#FFFBEF' }}
      >
        <div className="px-3 py-2">
          <div className="flex items-center gap-5 px-4">
            <div className="w-2 h-2 rounded-full bg-orange-300 shrink-0 mb-12" />
            <div>
              <div className="text-ink-900 font-bold text-xl pt-2 mb-2">
                {formattedThemeName}
              </div>
              <hr className="mb-2 border-gray-400 opacity-40" />
              <p className="mb-2 text-ink-900 text-base overflow-hidden text-ellipsis line-clamp-3">
                {theme.description}
              </p>
            </div>
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
