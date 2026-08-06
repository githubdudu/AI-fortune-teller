import { Button } from 'gestalt';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';

import useSound from '$/hooks/useAudio';

/**
 * Card selection screen
 * /fortune
 */
const SelectionView = ({ selectedCounts }) => {
  const navigate = useNavigate();
  const playSound = useSound();

  const onConfirmButtonClick = () => {
    playSound('confirm');
    navigate('reading', { replace: true });
  };

  return (
    <div className="selection-container contents ">
      <h1 className="selection-title order-0 mb-5 text-3xl md:text-4xl font-bold font-cormorant text-ink-900">
        Select Three Cards for your Reading
      </h1>

      <div className="action-container order-2 ">
        {selectedCounts === 3 ? (
          <Button
            text="Confirm Card Selection"
            name="edit-button"
            color="blue"
            onClick={onConfirmButtonClick}
            size="lg"
            accessibilityLabel="Confirm Tarot Card Selection"
            disabled={selectedCounts !== 3}
          />
        ) : (
          <div className="cards-remaining px-5 py-2 mb-2 rounded-full shadow-lg bg-mist-200 font-medium  text-ink-900">
            <span>{3 - selectedCounts} cards remaining</span>
          </div>
        )}
      </div>
    </div>
  );
};

SelectionView.propTypes = {
  selectedCounts: PropTypes.number.isRequired,
};

export default SelectionView;
