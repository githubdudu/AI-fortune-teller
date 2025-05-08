import { motion, AnimatePresence } from 'framer-motion';
import './FloatingPrompt.css';
import PropTypes from 'prop-types';

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
              <>
                <p className="prompt-text">
                  Your Lucky Color: {dailyFortune.luckyColor}
                </p>
                <p className="prompt-text">
                  Your Lucky Number: {dailyFortune.luckyNumber}
                </p>
                <p className="prompt-text">
                  Piece of Advice: {dailyFortune.advice}
                </p>
              </>
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
