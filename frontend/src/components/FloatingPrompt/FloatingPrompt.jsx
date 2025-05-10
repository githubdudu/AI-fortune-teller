import { motion, AnimatePresence } from 'framer-motion';
import './FloatingPrompt.css';
import PropTypes from 'prop-types';

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
            {children}
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
