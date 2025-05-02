import PropTypes from 'prop-types';

function ThemeDescription({ theme }) {
  return (
    <>
      <div
        className="w-2xl overflow-hidden shadow-md"
        style={{ backgroundColor: '#FFFBEF' }}
      >
        <div className="px-3 py-2">
          <div className="flex items-center gap-5 px-4">
            <div className="w-2 h-2 rounded-full bg-orange-300 shrink-0 mb-12" />
            <div>
              <div className="text-[#261060] font-bold text-xl pt-2 mb-2">
                {theme.name}
              </div>
              <p className="text-[#261060] text-base overflow-hidden text-ellipsis line-clamp-3">
                {theme.description}
              </p>
            </div>
          </div>
          <hr className="mt-4 border-gray-400 opacity-40" />
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
