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
    <>
      <p className="prompt-text">The future is calling.</p>
      <p className="prompt-text">Click to start your fortune.</p>

      {loading && <p>Loading themes...</p>}
      {error ? (
        <p className="prompt-text error">{error}</p>
      ) : dailyFortune ? (
        <div className="fortune-card">
          <div className="fortune-main">
            <div className="fortune-block">
              <div className="fortune-label">Your lucky number</div>
              <div className="fortune-number">{dailyFortune.luckyNumber}</div>
            </div>

            <div className="fortune-block">
              <div className="fortune-label">Your lucky colour</div>
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
            <div className="fortune-label">Piece of advice:</div>
            <p>{dailyFortune.advice}</p>
          </div>
        </div>
      ) : (
        <p className="prompt-text">Loading your daily fortune...</p>
      )}

      <button className="prompt-button" onClick={onClick}>
        Start Reading
      </button>
    </>
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
