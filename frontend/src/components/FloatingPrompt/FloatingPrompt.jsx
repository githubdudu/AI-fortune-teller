import { motion, AnimatePresence } from 'framer-motion';
import './FloatingPrompt.css';
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

function FloatingPrompt({ visible, shouldReduceMotion = true, children }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="floating-prompt-container">
          <motion.div
            className="floating-prompt-modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={
              shouldReduceMotion
                ? { y: 0, opacity: 1 }
                : { y: 0, opacity: 1, scale: [1, 1.02, 1] }
            }
            exit="hidden"
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
            <p className="prompt-text">Click to start your fortune.</p>

            {loading && <p>Loading themes...</p>}
            {error ? (
              <p className="prompt-text error">{error}</p>
            ) : dailyFortune ? (
              <div className="fortune-card">
                <div className="fortune-main">
                  <div className="fortune-block">
                    <div className="fortune-label">Your lucky number</div>
                    <div className="fortune-number">
                      {dailyFortune.luckyNumber}
                    </div>
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
          </motion.div>
        </div>
      )}
      ;
    </AnimatePresence>
  );
}

FloatingPrompt.propTypes = {
  visible: PropTypes.bool.isRequired,
  shouldReduceMotion: PropTypes.bool,
  children: PropTypes.node,
};

export default FloatingPrompt;
