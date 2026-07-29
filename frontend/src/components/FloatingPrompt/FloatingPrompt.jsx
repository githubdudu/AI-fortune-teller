import { motion, AnimatePresence } from 'framer-motion';
import './FloatingPrompt.css';
import PropTypes from 'prop-types';

function FloatingPrompt({ visible, children }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="floating-prompt-container">
          <motion.div
            className="floating-prompt-modal"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              y: { duration: 0.6, ease: 'easeOut' },
              opacity: { duration: 0.6 },
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

FloatingPrompt.propTypes = {
  visible: PropTypes.bool.isRequired,
  shouldReduceMotion: PropTypes.bool,
  children: PropTypes.node,
};

export default FloatingPrompt;
