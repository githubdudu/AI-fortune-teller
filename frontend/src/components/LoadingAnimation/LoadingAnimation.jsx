import { motion } from 'framer-motion';
import './LoadingAnimation.css';
import PropTypes from 'prop-types';

const loadingText = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

function LoadingAnimation({ text = 'Shuffling your destiny...' }) {
  return (
    <div className="loading-wrapper">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.p
        className="loading-text"
        variants={loadingText}
        initial="initial"
        animate="animate"
      >
        {text}
      </motion.p>
    </div>
  );
}

LoadingAnimation.propTypes = {
  text: PropTypes.string,
};

export default LoadingAnimation;
