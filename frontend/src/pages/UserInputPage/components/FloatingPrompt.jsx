import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

function FloatingPrompt({ visible, children }) {
  // Lock the page behind the modal. Below 320px the body's own `min-width`
  // gives it a horizontal scrollbar, which would sit alongside the overlay's —
  // two scrollbars for one thing to scroll. Locking leaves only the overlay's.
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <div className="floating-prompt-container fixed z-50 flex items-center-safe justify-center-safe bg-ink/35 inset-0 shadow-2xl overflow-auto p-1">
          <motion.div
            className="floating-prompt-modal min-h-[550px] min-w-xs w-full sm:w-xl py-8 px-4 sm:px-9 border-2 border-core rounded-2xl bg-bg drop-shadow-2xl/25 text-center"
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
