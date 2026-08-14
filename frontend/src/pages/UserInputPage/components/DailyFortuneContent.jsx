import PropTypes from 'prop-types';

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
  dailyFortune = dailyFortune || {
    luckyNumber: 7,
    luckyColor: 'Pink',
    advice: 'Trust your instincts today.',
  };
  return (
    <div className="flex flex-col gap-12 justify-between items-center">
      <div>
        <p className="text-3xl text-ink font-medium">The future is calling.</p>
        <p className="text-3xl text-core font-medium">
          Click to start your fortune.
        </p>
      </div>

      {loading && <p>Loading themes...</p>}
      {error ? (
        <p className="error text-danger font-medium ">{error}</p>
      ) : dailyFortune ? (
        <div className="fortune-daily bg-daily-fortune animate-daily-fortune-bg flex flex-col gap-6 rounded-2xl drop-shadow-2xl/15 shadow-lg hover:shadow-xl py-6 px-5 max-w-md w-[90%]">
          <div className="fortune-main flex justify-between gap-4">
            <div className="fortune-block flex-1 flex flex-col justify-around items-center min-h-20">
              <div className="fortune-label text-sm mb-1.5 text-ink">
                Your lucky number
              </div>
              <div className="fortune-number text-3xl font-bold text-ink">
                {dailyFortune.luckyNumber}
              </div>
            </div>

            <div className="fortune-block flex-1 flex flex-col justify-around items-center min-h-20">
              <div className="fortune-label text-sm mb-1.5 text-ink">
                Your lucky colour
              </div>
              <div className="fortune-color-line flex items-center gap-2">
                <span
                  className="color-swatch rounded-full shadow-md size-6"
                  style={{
                    backgroundColor: colorMap[dailyFortune.luckyColor],
                  }}
                ></span>
                <span className="fortune-color-name text-2xl font-medium text-ink ">
                  {dailyFortune.luckyColor}
                </span>
              </div>
            </div>
          </div>
          <div className="fortune-advice mt-8 pt-4 border-t-2 border-ink/20">
            <div className="fortune-label text-sm font-medium mb-1.5 text-ink">
              Piece of advice:
            </div>
            <p className="text-xl text-ink font-medium">
              {dailyFortune.advice}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-3xl text-spark font-medium">
          Loading your daily fortune...
        </p>
      )}

      <button
        className="bg-core text-bg text-base font-medium rounded-4xl cursor-pointer px-7 py-3 hover:bg-spark hover:translate-y-[-2px] shadow-sm hover:shadow-md transition-all duration-200"
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
