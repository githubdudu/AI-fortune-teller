import { motion, AnimatePresence } from 'framer-motion';
import './FloatingPrompt.css';
import PropTypes from 'prop-types';

function FloatingPrompt({ onClick, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="floating-prompt-container">
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
  onClick: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default FloatingPrompt;
