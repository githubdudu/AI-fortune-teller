import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

function FloatingPrompt({ visible, children }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="floating-prompt-container fixed z-50 flex items-center justify-center bg-ink/35 inset-0 shadow-2xl ">
          <motion.div
            className="floating-prompt-modal min-h-[550px] sm:min-w-xl min-w-sm py-8 px-6 border-2 border-core rounded-2xl bg-bg drop-shadow-2xl/25 text-center"
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
  children: PropTypes.node,
};

export default FloatingPrompt;
