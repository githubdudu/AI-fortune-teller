import PropTypes from 'prop-types';
import './DailyFortuneContent.css';

const colorMap = {
  Red: '#FF0000',
  Blue: '#0000FF',
  Green: '#008000',
  Yellow: '#FFD700',
  Orange: '#FFA500',
  Pink: '#FFC0CB',
  Navy: '#000080',
  'Lime Green': '#32CD32',
  'Baby Pink': '#F4C2C2',
  Coral: '#FF7F50',
  Gray: '#808080',
  Khaki: '#F0E68C',
  Beige: '#F5F5DC',
  Brown: '#A52A2A',
  Mint: '#98FF98',
  Lavender: '#E6E6FA',
  Purple: '#800080',
  Black: '#000000',
  White: '#FFFFFF',
};

function DailyFortuneContent({ loading, error, dailyFortune, onClick }) {
  return (
    <div className="h-[50vh] flex flex-col justify-between items-center">
      <div>
        <p className="text-3xl text-figma-red font-medium">
          The future is calling.
        </p>
        <p className="text-3xl text-figma-red font-medium">
          Click to start your fortune.
        </p>
      </div>

      {loading && <p>Loading themes...</p>}
      {error ? (
        <p className="error text-red-500 font-medium ">{error}</p>
      ) : dailyFortune ? (
        <div className="fortune-daily bg-daily-fortune animate-daily-fortune-bg flex flex-col gap-6 rounded-2xl drop-shadow-2xl/15 shadow-lg hover:shadow-xl py-6 px-5 max-w-md w-[90%]">
          <div className="fortune-main flex max-sm:flex-col justify-between gap-4">
            <div className="fortune-block flex-1 flex flex-col justify-between items-center min-h-20">
              <div className="fortune-label text-sm mb-1.5 text-neutral-800">
                Your lucky number
              </div>
              <div className="fortune-number">{dailyFortune.luckyNumber}</div>
            </div>

            <div className="fortune-block flex-1 flex flex-col justify-between items-center min-h-20">
              <div className="fortune-label text-sm mb-1.5 text-neutral-800">
                Your lucky colour
              </div>
              <div className="fortune-color-line">
                <span
                  className="color-swatch"
                  style={{
                    backgroundColor:
                      colorMap[dailyFortune.luckyColor] || '#FFC0CB',
                  }}
                ></span>
                <span className="fortune-color-name">
                  {dailyFortune.luckyColor}
                </span>
              </div>
            </div>
          </div>
          <div className="fortune-advice">
            <div className="fortune-label text-sm mb-1.5 text-neutral-800">
              Piece of advice:
            </div>
            <p>{dailyFortune.advice}</p>
          </div>
        </div>
      ) : (
        <p className="text-3xl text-figma-red font-medium">
          Loading your daily fortune...
        </p>
      )}

      <button
        className="bg-figma-red text-white text-base font-medium rounded-4xl cursor-pointer px-7 py-3 hover:bg-[#FF9E6B] hover:translate-y-[-2px] hover:shadow-md transition-all duration-200"
        onClick={onClick}
      >
        Start Reading
      </button>
    </div>
  );
}

DailyFortuneContent.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  dailyFortune: PropTypes.shape({
    luckyColor: PropTypes.string.isRequired,
    luckyNumber: PropTypes.number.isRequired,
    advice: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }),
};

export default DailyFortuneContent;
