import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function LoadingAnimation({ text = 'Shuffling your destiny...' }) {
  return (
    <div className="wrapper flex flex-col gap-8 items-center justify-center">
      <motion.div
        className="spinner size-12 rounded-full border-4 border-spark border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.p
        className="loading-text text-core font-medium"
        initial={{ opacity: 0.3 }}
        animate={{
          opacity: 1,
          transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' },
        }}
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
