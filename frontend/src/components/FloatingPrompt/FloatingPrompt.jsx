import { motion } from 'framer-motion';
import './FloatingPrompt.css';
import PropTypes from 'prop-types';

function FloatingPrompt({ onClick }) {
  return (
    <div className="floating-prompt-container">
      <motion.div
        className="floating-prompt"
        onClick={onClick}
        initial={{ y: '100%', opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: [1, 1.02, 1],
        }}
        transition={{
          y: { type: 'spring', stiffness: 60, damping: 22 },
          opacity: { duration: 0.8 },
          scale: {
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 1, // Delay before starting the scale animation
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
  );
}

FloatingPrompt.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FloatingPrompt;
