import './Card.css';
import PropTypes from 'prop-types';

const TarotCard = ({
  frontImage,
  backImage,
  disabled,
  description,
  name,
  isShowFront,
}) => {
  return (
    <div
      className={`tarot-card ${isShowFront ? 'flipped' : ''} ${disabled ? 'disabled' : ''} ${isShowFront ? 'no-flip-back' : ''}`}
    >
      <div className="tarot-card-inner">
        <div className="tarot-card-back">
          <img src={backImage} alt="Tarot Card Back" />
        </div>
        <div className="tarot-card-front">
          <img src={frontImage} alt="Tarot Card Front" />
          <div className="tarot-card-description">
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

TarotCard.propTypes = {
  frontImage: PropTypes.string,
  backImage: PropTypes.string,
  disabled: PropTypes.bool,
  description: PropTypes.string,
  name: PropTypes.string,
  isShowFront: PropTypes.bool,
};

TarotCard.defaultProps = {
  frontImage: null,
  backImage: null,
  disabled: false,
  description: '',
  name: '',
};

export default TarotCard;
