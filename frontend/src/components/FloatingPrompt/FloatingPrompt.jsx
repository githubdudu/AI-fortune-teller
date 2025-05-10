import { motion, AnimatePresence } from 'framer-motion';
import './FloatingPrompt.css';
import PropTypes from 'prop-types';

const colorMap = {
  Red: '#FF4C4C',
  Blue: '#4C6EFF',
  Green: '#4CFF4C',
  Yellow: '#FFFF4C',
  Orange: '#FFAE42',
  Pink: '#FFB6C1',
  Navy: '#001F54',
  'Lime Green': '#32CD32',
  'Baby Pink': '#FFC1CC',
  Coral: '#FF7F50',
  Gray: '#BEBEBE',
  Khaki: '#F0E68C',
  Beige: '#F5F5DC',
  Brown: '#8B4513',
  Mint: '#98FF98',
  Lavender: '#E6E6FA',
  Purple: '#A020F0',
  Black: '#000000',
  White: '#FFFFFF',
};

function FloatingPrompt({ onClick, visible, dailyFortune, loading, error }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="floating-prompt-container" exit={{ opacity: 0 }}>
          <motion.div
            className="floating-prompt-modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1, scale: [1, 1.02, 1] }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              y: { type: 'spring', stiffness: 60, damping: 22 },
              opacity: { duration: 0.5 },
              scale: {
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: 1,
              },
            }}
          >
            <p className="prompt-text">The future is calling.</p>
            <p className="prompt-text">Are you ready to unlock it?</p>

            {loading && <p>Loading themes...</p>}
            {error ? (
              <p className="prompt-text error">{error}</p>
            ) : dailyFortune ? (
              <div className="fortune-card">
                <div
                  className="fortune-color"
                  style={{
                    backgroundColor:
                      colorMap[dailyFortune.luckyColor] || '#FFC0CB',
                  }}
                >
                  <span className="fortune-number">
                    {dailyFortune.luckyColor}
                  </span>
                  <span className="fortune-color-name">
                    {dailyFortune.luckyNumber}
                  </span>
                </div>
                <div className="fortune-advice">
                  <p>Piece of Advice: {dailyFortune.advice}</p>
                </div>
              </div>
            ) : (
              <p className="prompt-text">Loading your daily fortune...</p>
            )}

            <button className="prompt-button" onClick={onClick}>
              Start Reading
            </button>
          </motion.div>
        </motion.div>
      )}
      ;
    </AnimatePresence>
  );
}

FloatingPrompt.propTypes = {
  onClick: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  dailyFortune: PropTypes.shape({
    luckyColor: PropTypes.string.isRequired,
    luckyNumber: PropTypes.number.isRequired,
    advice: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default FloatingPrompt;
